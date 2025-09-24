<template>
  <div class="outer-container">
    <h2>火灾蔓延预测模型核心算法</h2>
    <el-divider class="divider"></el-divider>
    <p class="description">
      &nbsp;&nbsp;<strong>CA模型（Cellular Automaton，细胞自动机）是一种基于离散格点的数学模型，
      广泛用于火势模拟与预测。该模型将模拟区域划分为网格，每个网格单元代表特定的地理位置和状态，
      如燃烧、未燃或燃尽状态。火势传播由局部规则控制，这些规则决定了一个单元的状态如何受其邻近单元状态的影响。
      通过反复迭代计算，CA模型能够模拟火势在不同环境和条件下的动态变化，预测火势扩展的路径和速度。其优点在于
      计算简单，能够结合地形、气象和植被等多种因素，提供细致和逼真的火灾扩散过程预测。</strong>
    </p>
    <img src="@/assets/model_explain.jpg" alt="模型图片" class="model-image"/>
    <div class="container">
      <div class="content">
        <div class="head">Demo.py</div>
        <el-scrollbar class="code-scrollbar">
          <pre class="code-container" v-html="highlightedCode"></pre>
        </el-scrollbar>
      </div>
    </div>

    <div class="result-container">
      <div class="head-result">运行结果</div>
      <el-carousel :interval="5000" height="400px">
        <el-carousel-item v-for="item in results" :key="item.step">
          <img :src="item.image" :alt="'Step ' + item.step" class="result-image"/>
          <div class="caption">Step {{ item.step }}</div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <h2 class="title">Sigmoid激活函数</h2>
    <el-divider class="divider"></el-divider>
    <p class="description">
      &nbsp;&nbsp;<strong>Sigmoid激活函数是一种常用于神经网络和其他机器学习算法的非线性函数,
      该函数的输出范围为[0, 1]，将输入值映射到一个有限的范围内，适合表示概率值。</strong>
    </p>
    <p class="description">
      &nbsp;&nbsp;<strong>在火势模拟中，Sigmoid激活函数可以将各种要素（如风速、湿度、地形等）对火势扩散概率的影响转化为一个[0,
      1]之间的值，
      使这些影响易于与其他因素综合计算。通过加法模型，这些影响因素的综合值可以进一步反映火势扩散的总体概率，从而实现更精确的模拟和预测。</strong>
    </p>
    <img src="@/assets/wind-inf.jpg" alt="模型图片" class="model-image"/>
    <img src="@/assets/sigmoid.png" alt="模型图片" class="model-image"/>

    <h2 class="title">面向对象的后端程序</h2>
    <el-divider class="divider"></el-divider>
    <p class="description">
      &nbsp;&nbsp;<strong>从展示原理的demo程序到实际可运行的后端程序过程实际非常复杂，不仅需要考虑算法的正确性。</strong>
    </p>
    <p class="description">
      <strong>(1)栅格数据的地理属性</strong>
    </p>
    <p class="description">
      <strong>(2)算法的时间复杂度、空间复杂度</strong>
    </p>
    <p class="description">
      <strong>(3)数据格式转换 numpy array-> Raster -> Shapefile -> Geojson</strong>
    </p>
    <p class="description">
      <strong>(4)异常处理、抛出</strong>
    </p>
    <div class="container">
      <div class="content">
        <div class="head">Demo.py</div>
        <el-scrollbar class="code-scrollbar">
          <pre class="code-container" v-html="actualCode"></pre>
        </el-scrollbar>
      </div>
    </div>

    <h2 class="title">基于Flask框架的后端程序</h2>
    <el-divider class="divider"></el-divider>

    <p class="description">
      &nbsp;&nbsp;<strong>使用Flask框架来实现后台数据库与前端网页的通信。
      Flask是一种轻量级的Python微框架，适用于构建快速且高效的Web应用。通过Flask，
      能够方便地定义路由来处理HTTP请求，将前端发送的数据传递到后端，
      并从数据库中获取所需信息进行处理和返回。Flask框架具有灵活性和扩展性，
      支持各种数据库连接和模板渲染，使得构建复杂的Web应用变得简便快捷，适合于各种规模的项目。</strong>
    </p>
    <div class="container">
      <div class="content">
        <div class="head">Demo.py</div>
        <el-scrollbar class="code-scrollbar">
          <pre class="code-container" v-html="flaskCode"></pre>
        </el-scrollbar>
      </div>
    </div>

    <h2 class="title">系统全局架构</h2>
    <el-divider class="divider"></el-divider>
    <p class="description">
      &nbsp;&nbsp;<strong>下面是本系统的完整技术架构</strong>
    </p>
    <div id="echart-treemap" style="width: 600px; height: 400px;"></div>
  </div>


</template>

<script setup>
import {ref, onMounted} from 'vue';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // 使用Prism的黑色背景主题
import 'prismjs/components/prism-python';
import 'element-plus/es/components/scrollbar/style/css'; // 引入element-plus滚动条样式
import * as echarts from 'echarts';

import step20 from '@/assets/step20.png';
import step30 from '@/assets/step30.png';
import step40 from '@/assets/step40.png';

// 示例图片路径
const results = ref([
  {step: 20, image: step20},
  {step: 30, image: step30},
  {step: 40, image: step40}
]);

const code = `
import numpy as np
import matplotlib.pyplot as plt

# 定义网格大小
width, height = 100, 100

# 生成示例栅格数据
np.random.seed(50)
dem = np.random.rand(height, width) * 1000  # 高程，单位：米
wind_speed = np.random.rand(height, width) * 10  # 风速，单位：米/秒
wind_direction = np.random.rand(height, width) * 2 * π  # 风向，单位：弧度
precipitation = np.random.rand(height, width)  # 降水量，单位：毫米
temperature = np.random.rand(height, width) * 40  # 温度，单位：摄氏度

# 定义火灾状态
TREE, BURNING = 0, 1

# 初始化森林状态
forest = np.full((height, width), TREE)
fire_points = [(50, 50)]  # 初始火点
for (x, y) in fire_points:
    forest[x, y] = BURNING

# 定义基础蔓延概率
base_spread_probability = 0.3

def compute_spread_probability(dem, wind_speed, wind_direction, precipitation, temperature, i, j, di, dj):
    # 计算地形坡度影响
    if 0 <= i + di < height and 0 <= j + dj < width:
        slope = (dem[i + di, j + dj] - dem[i, j]) / np.sqrt(di ** 2 + dj ** 2)
    else:
        slope = 0

    # 计算风力影响
    if 0 <= i + di < height and 0 <= j + dj < width:
        wind_effect = 1.0 + wind_speed[i, j] * np.cos(wind_direction[i, j] - np.arctan2(dj, di))
    else:
        wind_effect = 1.5

    # 计算降水和温度影响
    if 0 <= i + di < height and 0 <= j + dj < width:
        weather_effect = (1.0 + temperature[i, j]) * (1.0 - precipitation[i, j])
    else:
        weather_effect = 0.5

    # 综合蔓延概率
    spread_probability = base_spread_probability * (1 + slope / 10) * wind_effect * weather_effect
    return spread_probability

def update_forest(forest, dem, wind_speed, wind_direction, precipitation, temperature):
    new_forest = forest.copy()
    for i in range(height):
        for j in range(width):
            if forest[i, j] == BURNING:
                for di, dj in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                    ni, nj = i + di, j + dj
                    if 0 <= ni < height and 0 <= nj < width and forest[ni, nj] == TREE:
                        spread_probability = compute_spread_probability(dem, wind_speed, wind_direction, precipitation, temperature, i, j, di, dj)
                        if np.random.random() < spread_probability:
                            new_forest[ni, nj] = BURNING
    return new_forest

def plot_forest(forest, step):
    plt.figure(figsize=(8, 8))
    plt.imshow(forest, cmap='Reds', interpolation='nearest')
    plt.title(f'Step: {step}')
    plt.show()

# 运行模型
steps = 20
results = []
for step in range(steps):
    plot_forest(forest, step)
    forest = update_forest(forest, dem, wind_speed, wind_direction, precipitation, temperature)
    results.append(forest)

results[-1]

`;
const actual =
    `
import numpy as np
import rasterio
  from rasterio.features import shapes
  from shapely.geometry import shape, Polygon
from shapely.ops import unary_union
import flask
  from flask import request, jsonify
from shapely.geometry.polygon import orient
import flask
import sqlite3
import jwt
  from datetime import datetime, timedelta

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
self.start_n, self.end_n= self.dem_n - 100, self.dem_n + 100
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
x = left + self.res_x*1000 * x
y = top - self.res_y*1000 * y
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
          stepsLst = [-1, -61, -91]
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

          if __name__ == "__main__":
          app.run(host='localhost', port=8765)
`;
const flask =
    `
"""
2024/04/27 13:02
登录界面及火点读取后端程序
"""
import flask
import sqlite3
import jwt
  from datetime import datetime, timedelta

app = flask.Flask(__name__)
conn = sqlite3.connect('Users.db')
cur = conn.cursor()
sql = 'SELECT * FROM ADMIN'
Users = cur.execute(sql).fetchall()


# print(Users)

@app.route('/')
def index():
html = """<b>本界面为林火综合管理系统数据库后端</b>"""
return html

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
  "Y": Y,}
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
  "Y": Y,}
return flask.jsonify(dic)

if __name__ == "__main__":
app.run(host='localhost', port=8765)
`;

const highlightedCode = ref('');
const actualCode = ref('')
const flaskCode = ref('')
onMounted(() => {
  highlightedCode.value = Prism.highlight(code, Prism.languages.python, 'python');
  actualCode.value = Prism.highlight(actual, Prism.languages.python, 'python');
  flaskCode.value = Prism.highlight(flask, Prism.languages.python, 'python');
});
onMounted(() => {
  const chartDom = document.getElementById('echart-treemap');
  const myChart = echarts.init(chartDom);
  const option = {
    series: [
      {
        name:"architecture",
        type: 'treemap',
        data: [
          {
            name: 'Frontend',
            value: 10,
            children: [
              {
                name: 'TypeScript',
                value: 2
              },
              {
                name: 'Vue',
                value: 2,
                children: [
                  {
                    name: 'Pinia',
                    value: 1
                  },
                  {
                    name: 'AJAX',
                    value: 1
                  },
                  {
                    name: 'Axios',
                    value: 1
                  }
                ]
              },
              {
                name: 'Leaflet',
                value: 1
              },
              {
                name: 'Amap JsApi',
                value: 1
              },
              {
                name: 'Turf',
                value: 1
              },
              {
                name: 'ECharts',
                value: 2
              }
            ]
          },
          {
            name: 'Backend',
            value: 5,
            children: [
              {
                name: 'Python',
                value: 1
              },
              {
                name: 'Flask',
                value: 1
              },
              {
                name: 'Gunicorn',
                value: 1
              },
              {
                name: 'SQLite',
                value: 1
              }
            ]
          },
          {
            name: 'Deployment',
            value: 5,
            children: [
              {
                name: 'Cloud Server',
                value: 2,
                children: [
                  {
                    name: '宝塔',
                    value: 1
                  },
                  {
                    name: 'Nginx',
                    value: 1
                  }
                ]
              }
            ]
          }
        ],
        label: {
          show: true,
          fontWeight: 'bold'
        },
        itemStyle: {
          borderColor: '#d1edff',
          borderWidth: 2
        }
      }
    ]
  };
  myChart.setOption(option);
});
</script>

<style scoped>
.outer-container {
  height: 700vh;
  overflow: hidden; /* 隐藏外部容器滚动条 */
  padding: 20px;
  background-color: white;
}

.container {
  display: flex;
  justify-content: center;
  height: 90vh;
  width: auto
}

.content {
  background-color: #2d2d2d; /* 黑色背景 */
  border-radius: 10px;
  overflow: hidden; /* 确保边框圆角有效 */
}

.head {
  background-color: #444;
  color: #f8f8f2;
  padding: 10px;
  font-size: 1.2em;
  border-bottom: 1px solid #333;
  font-weight: bold; /* 加粗 */
}

.head-result {
  background-color: #444;
  color: #f8f8f2;
  padding: 10px;
  font-size: 1.2em;
  font-weight: bold; /* 加粗 */
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.code-container {
  padding: 20px;
  height: 90vh;
  white-space: pre-wrap; /* 保持换行格式 */
  color: #f8f8f2; /* 使用浅色文字以确保在黑色背景上的可读性 */
  line-height: 1.5; /* 增加行间距 */
}

.description {
  font-size: 18px;
  width: 150vh;
  margin-left: 20px;
  line-height: 1.5; /* 增加行间距 */
  margin-bottom: 20px;
}

.code-scrollbar {
  max-height: 85vh; /* 设置滚动区域的最大高度 */
}

.divider {
  border-color: rgb(0, 0, 0);
  width: 25%;
  align-items: center;
  justify-content: center;
  font-weight: bold; /* 加粗 */
}

.result-container {
  width: 50vh;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  height: 50vh;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.result-image {
  height: 94%;
  width: auto;
}

.caption {
  margin-top: 10px;
  font-size: 16px;
  color: #f8f8f2;
  text-align: center;
}

.model-image {
  align-items: center;
  display: flex;
  margin: 20px auto;
}

.title {
  margin-top: 50px;
}
#echart-treemap {
  width: 100%;
  height: 400px;
  margin: auto;
}
</style>
