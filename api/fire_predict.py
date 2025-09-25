from http.server import BaseHTTPRequestHandler
import json
import urllib.parse
import numpy as np
import rasterio
from rasterio.features import shapes
from shapely.geometry import shape, Polygon
from shapely.ops import unary_union
from flask import request, jsonify
from shapely.geometry.polygon import orient
import flask
import sqlite3
import jwt
from datetime import datetime, timedelta

app = flask.Flask(__name__)
conn = sqlite3.connect('Users.db')
cur = conn.cursor()
sql = 'SELECT * FROM ADMIN'
Users = cur.execute(sql).fetchall()


class fire_predict(object):
    def __init__(self, input_raster, width=200, height=200):
        dataset = rasterio.open(input_raster)
        # 读取栅格
        self.matrix = dataset.read(1)
        self.left, self.top = dataset.transform * (0, 0)
        self.res_x, self.res_y = dataset.transform[0], -dataset.transform[4]
        del dataset
        # 定义风速、风向
        self.wind_speed = 15.778  # 风速，单位：米/秒
        self.wind_direction = np.pi * 1.5  # 风向，单位：弧度
        # 定义火灾状态
        self.TREE, self.BURNING = 0, 1
        self.height, self.width = height, width

        # 定义基础蔓延概率
        self.base_spread_probability = 0.3

    def sigmoid(self, x, k=1, x0=0):
        return 1 / (1 + np.exp(-k * (x - x0)))

    def locate(self, x, y):
        # 定义火点坐标
        self.x, self.y = x, y
        self.dem_m, self.dem_n = int((self.x - self.left) / self.res_x), int((self.top - self.y) / self.res_y)
        self.start_m, self.end_m = self.dem_m - 100, self.dem_m + 100
        self.start_n, self.end_n = self.dem_n - 100, self.dem_n + 100
        dem = self.matrix[self.start_n:self.end_n, self.start_m:self.end_m]
        return dem

    def compute_spread_probability(self, dem, wind_speed, wind_direction, i, j, di, dj):
        # 计算地形坡度影响
        if 0 <= i + di < self.height and 0 <= j + dj < self.width:
            slope = (dem[i + di, j + dj] - dem[i, j]) / np.sqrt(di ** 2 + dj ** 2)
            # print(slope)
            slope_effect = self.sigmoid(slope, k=5, x0=0)  # 使用 Sigmoid 函数映射坡度
            # print(f"Slope from ({i}, {j}) to ({i + di}, {j + dj}): {slope_effect}")
        else:
            slope_effect = self.sigmoid(np.random.uniform(0, 0.3), k=5, x0=0)  # 使用随机值并映射

        # 计算风力影响
        if 0 <= i + di < self.height and 0 <= j + dj < self.width:
            wind_effect = np.cos(wind_direction - np.arctan2(dj, di)) / 2
        else:
            wind_effect = 0.3

        # 计算降水和温度影响
        if 0 <= i + di < self.height and 0 <= j + dj < self.width:
            weather_effect = 0.5
        else:
            weather_effect = 0.5

        # 综合蔓延概率（加法模型）
        spread_probability = self.base_spread_probability * 0 + slope_effect * 0.5 + wind_effect * 0.25 + weather_effect * 0.15
        return spread_probability

    def update_forest(self, forest, dem, wind_speed, wind_direction):
        new_forest = forest.copy()
        for i in range(self.height):
            for j in range(self.width):
                if forest[i, j] == self.BURNING:
                    for di, dj in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                        ni, nj = i + di, j + dj
                        if 0 <= ni < self.height and 0 <= nj < self.width and forest[ni, nj] == self.TREE:
                            spread_probability = self.compute_spread_probability(dem, wind_speed, wind_direction, i, j,
                                                                                 di,
                                                                                 dj)
                            if np.random.random() < spread_probability:
                                new_forest[ni, nj] = self.BURNING
        return new_forest

    # def plot_forest(self, forest, step):
    #     plt.figure(figsize=(8, 8))
    #     plt.imshow(forest, cmap='Reds', interpolation='nearest')
    #     plt.title(f'Step: {step}')
    #     plt.show()

    def predict(self, x, y, steps=60):
        dem = self.locate(x, y)
        # 初始化森林状态
        forest = np.full((self.height, self.width), self.TREE)  # type: ignore
        fire_points = [(100, 100)]  # 初始火点
        for (x, y) in fire_points:
            forest[x, y] = self.BURNING
        # 运行模型
        results = []
        for step in range(steps):
            # if step == int((1/3)*steps):
            #     self.plot_forest(forest, step)
            # elif step == int((2/3)*steps):
            #     self.plot_forest(forest, step)
            # elif step == steps - 1:
            #     self.plot_forest(forest, step)
            forest = self.update_forest(forest, dem, self.wind_speed, self.wind_direction)
            results.append(forest)

        return results

    def trans(self):
        left = self.left + self.res_x * self.start_m
        top = self.top - self.res_y * self.start_n
        transform = rasterio.transform.Affine(self.res_x, 0, left, 0, -self.res_y, top)
        return transform

    def project(self, x, y):
        print(x, y)
        left = self.left + self.res_x * (self.dem_m - 100)
        top = self.top - self.res_y * (self.dem_n - 100)
        x = left + self.res_x * 1000 * x
        y = top - self.res_y * 1000 * y
        return x, y

    def extractShape(self, results, n):
        # 获取最后一次迭代结果
        final_forest = results[n].astype(np.int32)  # 转换数据类型为 int32
        transform = self.trans()  # 获取新的 transform 参数
        # 提取火焰部分面积的矢量
        shapes_gen = shapes(final_forest, mask=final_forest == self.BURNING, transform=transform)

        geometries = []
        for geom, val in shapes_gen:
            if val == 1:
                poly = shape(geom)
                if poly.is_valid:
                    poly = poly.buffer(0)  # 移除内部空洞
                geometries.append(poly)

        # 合并所有多边形，消除内部空洞
        unified = unary_union(geometries)
        if isinstance(unified, Polygon):
            geometries = [unified]
        else:
            geometries = list(unified)

        return geometries

    def to_geojson(self, geometries):
        features = []
        for poly in geometries:
            if isinstance(poly, Polygon):
                # 使用 shapely.geometry.polygon.orient 来确保符合右手法则
                poly = orient(poly, sign=1.0)
                exterior_coords = [(x, y) for x, y in zip(*poly.exterior.xy)]
                feature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [exterior_coords]
                    },
                    "properties": {}
                }
                features.append(feature)

        geojson = {
            "type": "FeatureCollection",
            "features": features
        }

        return geojson


app = flask.Flask(__name__)

# 示例使用
model = fire_predict("./data/dem2.tif", )


@app.route('/')
def index():
    html = """<b>本界面为林火综合管理系统数据库后端</b>
     <br><b>火势预测测试信息--/test2</b>
    <br><b>火点信息接口--/fire_points</b>
    <br><b>火点统计接口--/fire_statistic</b>
    <br><b>居民点接口--/get_residents</b>
    <br><b>消防站点接口--/get_stations</b>"""
    return html


@app.route('/test2', methods=['GET', 'POST'])
def test2():
    html = """<b>该界面为火势蔓延模型后端界面</b><br><b>测试模型请访问/Fire_Predict路由，测试数据?x=103.151&y=26.222</b>"""

    return html


@app.route('/Fire_Predict', methods=['GET', 'POST'])
def FirePredict():
    try:
        if request.method == 'GET':
            # 从查询参数中获取传入的 x 和 y
            x = float(request.args.get('x'))
            y = float(request.args.get('y'))
        elif request.method == 'POST':
            # 从请求体中获取传入的 x 和 y
            data = request.get_json()
            x = data['x']
            y = data['y']

        steps = 150
        # 获取预测结果
        results = model.predict(x, y, steps=steps)

        # 提取指定步骤的结果
        stepsLst = [-91, -61, -1]
        geojson_results = {}
        for step in stepsLst:
            geometries = model.extractShape(results, step)
            geojson_data = model.to_geojson(geometries)
            geojson_results[f"step_{steps + step + 1}"] = geojson_data
            # # 保存 GeoJSON 文件
            # with open(f"./data/{steps + step + 1}.geojson", "w") as f:
            #     json.dump(geojson_data, f, indent=2)

        return jsonify(geojson_results)
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/checkLoginInfo', methods=['GET', 'POST'])
def checkLoginInfo():
    form = flask.request.json
    # print(form)
    # for item in form:
    #     # print(item)
    for user in Users:
        if user[0] == form['name']:
            if user[1] == form['password']:
                # 生成随机令牌
                payload = {
                    'exp': datetime.now() + timedelta(hours=5),  # 令牌过期时间
                    'username': form['name']  # 想要传递的信息,如用户名ID
                }
                key = 'SECRET_KEY'
                encoded_jwt = jwt.encode(payload, key, algorithm='HS256')
                return flask.jsonify({'status': 'success', 'access_token': encoded_jwt, 'user_name': form["name"]})
    return flask.jsonify({'status': 'fail', 'access_token': None, 'user_name': None})


@app.route('/test', methods=['GET', 'POST'])
def test():
    return "hello world"


@app.route('/getInfo', methods=['POST'])
def getInfo():
    pass


@app.route('/login_out', methods=['POST'])
def login_out():
    # jet设计中没有销毁令牌，直接在前端销毁token
    return flask.jsonify({'status': 'success', 'message': 'Logout successful'})


@app.route('/fire_points', methods=['POST', "GET"])
def fire_points():
    connF = sqlite3.connect('fire_points.db')
    curF = connF.cursor()
    sql = 'SELECT * FROM points'
    points = curF.execute(sql).fetchall()
    dic = {}
    for index, point in enumerate(points):
        ID, DATE, X, Y, AREA, LEVEL = point
        dic[ID] = {"DATE": DATE,
                   "X": X,
                   "Y": Y,
                   "AREA": AREA,
                   "LEVEL": LEVEL}
    return flask.jsonify(dic)


@app.route('/fire_statistic', methods=['POST', "GET"])
def fire_statistic():
    connF = sqlite3.connect('fire_points.db')
    curF = connF.cursor()
    sql = 'SELECT * FROM points ORDER BY DATE ASC'
    points = curF.execute(sql).fetchall()
    doc = {}
    for index, point in enumerate(points):
        if point[4] not in doc:
            doc[point[4]] = []
            doc[point[4]].append((point[1].split(" ")[0], point[5]))
        else:
            doc[point[4]].append((point[1].split(" ")[0], point[5]))
    return flask.jsonify(doc)


@app.route('/get_residents', methods=['GET', "POST"])
def get_residents():
    connR = sqlite3.connect('fire_points.db')
    curR = connR.cursor()
    sql = 'SELECT * FROM residents'
    dic = {}
    residents = curR.execute(sql).fetchall()

    for resident in residents:
        ID, NAME, AVENUE, X, Y = resident
        dic[ID] = {"NAME": NAME,
                   "AVENUE": AVENUE,
                   "X": X,
                   "Y": Y, }
    return flask.jsonify(dic)


@app.route('/get_stations', methods=['GET', "POST"])
def get_station():
    connS = sqlite3.connect('fire_points.db')
    curS = connS.cursor()
    sql = 'SELECT * FROM station'
    dic = {}
    station = curS.execute(sql).fetchall()
    for station in station:
        ID, NAME, X, Y = station
        dic[ID] = {"NAME": NAME,
                   "X": X,
                   "Y": Y, }
    return flask.jsonify(dic)


if __name__ == "__main__":
    app.run(host='localhost', port=8765)
