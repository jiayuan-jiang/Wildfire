<template>
  <div>
    <div id="container"></div>
    <div class="control-panel" :class="{ open: panelOpen }">
      <button @click="togglePanel" class="toggle-button">{{ panelOpen ? '收起' : '展开' }}</button>
      <div v-if="panelOpen" class="input-card">
        <div class="input-item">
          <input type="checkbox" v-model="controls.scale" @change="toggleScale"/> 比例尺
        </div>
        <div class="input-item">
          <input type="checkbox" v-model="controls.toolbar" @change="toggleToolBar"/> 工具条
        </div>
        <div class="input-item">
          <input type="checkbox" v-model="controls.controlBar" @change="toggleControlBar"/> 指北针
        </div>
        <div class="input-item">
          <input type="checkbox" v-model="controls.overview" @change="toggleOverViewShow"/> 显示鹰眼
        </div>
        <div class="input-item">
          <input type="checkbox" v-model="controls.residentsMarkers" @change="toggleResidentsMarkers"/> 显示居民区
        </div>
        <div class="input-item">
          <input type="checkbox" v-model="controls.stationMarkers" @change="toggleStationMarkers"/> 显示消防站
        </div>
      </div>
    </div>
    <div v-if="isShow" class="input-panel">
      <el-input class="coordinate-inputs" v-model="inputX" placeholder="请输入经度" />
      <el-input class="coordinate-inputs" v-model="inputY" placeholder="请输入纬度" />
      <el-button type="primary" @click="fetchGeoJSON" class="model_input">确定</el-button>
    </div>
    <predictFire @showpanel="showInputPanel" />
  </div>
  <div v-if="BufferShow" class="input-panel">
    <el-input class="coordinate-inputs" v-model="bufferDistance" placeholder="请输入缓冲区距离 (米)" />
    <el-button type="primary" class="buffer_input" @click="performBuffer">执行缓冲区分析</el-button>
  </div>
  <div v-if="dispatchShow" class="input-panel">
    <el-button class="A1" type="primary" @click="analyzeStations">分析出警站点</el-button><br/>
    <el-button class="A2" type="primary" @click="planRoutes">路径规划</el-button>
  </div>
  <div v-if="evacuateShow" class="input-panel">
    <el-button type="primary" @click="analyzeEvacuate">火灾影响范围</el-button><br/>
    <el-button type="primary" @click="evacuateInform">发送撤离通知</el-button>
  </div>
  <div id="panel">
    <div v-for="(route, index) in routes" :key="index">
      <div :id="'panel' + index" class="panel-content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch} from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import axios from 'axios';
import predictFire from "@/components/dialogManagement/predictFire.vue";
import {BufferShow} from "@/components/AMap/bufferProcessParameter";
import {isShow, step} from "@/components/AMap/hidePanel";
import {dispatchShow} from "@/components/AMap/stationDispatchParameter.vue";
import residentsIcon from '@/assets/resident.svg';
import stationIcon_ from '@/assets/station.svg';
import * as turf from '@turf/turf';
import {evacuateShow} from "@/components/AMap/evacuateParameter";

declare global {
  interface Window {
    _AMapSecurityConfig: any;
  }
}

const map = ref<AMap.Map | null>(null);
let AMap: any = null;
let scaleControl: AMap.Scale | null = null;
let toolBarControl: AMap.ToolBar | null = null;
let controlBarControl: AMap.ControlBar | null = null;
let overViewControl: AMap.HawkEye | null = null;
let residentMarkers: AMap.Marker[] = [];
let stationMarkers: AMap.Marker[] = [];
let bufferLayer = null;
let jsonResponse = ref(null);
let firePredictLayers: AMap.GeoJSON[] = [];
let dispatchStations: AMap.Marker[] = [];
let inputLngLat: AMap.LngLat | null = null;
let driving: AMap.Driving | null = null;
let drivingResultsLayer: AMap.OverlayGroup | null = null;
let drivingInstances: AMap.Driving[] = []; // 存储所有的驾车实例
let evacuateResidents: AMap.Marker[] = [];
let draggableMarker: AMap.Marker | null = null;


const controls = ref({
  scale: false,
  toolbar: false,
  controlBar: false,
  overview: true,
  residentsMarkers: false,
  stationMarkers: false
});

const panelOpen = ref(false);
const centerGPS = [103.060725, 26.195746];
const inputX = ref<string>('');
const inputY = ref<string>('');
const isPanelVisible = ref(false);
const bufferDistance = ref<string>('');
const routes = ref<number[]>([]);  // 使用number数组来生成panel

const convertCoords = async (coords: [number, number]) => {
  const key = "2503aafba139b9680a3630040830c541"; // 请替换为您申请的Key
  const url = `https://restapi.amap.com/v3/assistant/coordinate/convert?locations=${coords[1]},${coords[0]}&coordsys=gps&output=json&key=${key}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    if (data.status === '1') {
      const [lng, lat] = data.locations.split(',').map(parseFloat);
      return [lat, lng];
    } else {
      throw new Error(data.info);
    }
  } catch (error) {
    console.error("坐标转换错误:", error);
    throw error;
  }
};

const addDraggableMarker = () => {
  const x = 103.060725
  const y = 26.195746
  if (draggableMarker) {
    map.value?.remove(draggableMarker);
  }

  draggableMarker = new AMap.Marker({
    position: [x, y],
    draggable: true,
    map: map.value
  });

  map.value.add(draggableMarker);

  draggableMarker.on('dragend', (event: any) => {
    const position = event.lnglat;
    inputX.value = position.getLng().toFixed(6);
    inputY.value = position.getLat().toFixed(6);
  });
};

const clearDraggableMarker = () =>{
  if (draggableMarker) {
    map.value?.remove(draggableMarker);
    draggableMarker = null;
  }
}

const fetchGeoJSON = async () => {
  try {
    const x = parseFloat(inputX.value);
    const y = parseFloat(inputY.value);

    if (isNaN(x) || isNaN(y)) {
      ElMessage.error("请输入有效的经度和纬度");
      return;
    }

    inputLngLat = new AMap.LngLat(x, y);

    jsonResponse.value = await axios.post('/predict/Fire_Predict', {
      x,
      y
    });

    const geojsonData = jsonResponse.value.data;
    console.log("预测结果:", geojsonData);

    // 清除以前的图层
    if (firePredictLayers.length > 0) {
      firePredictLayers.forEach(layer => {
        map.value?.remove(layer);
      });
      firePredictLayers = [];
    }

    // 添加 GeoJSON 数据到地图
    addGeoJSONToMap(geojsonData);
    ElMessage.success("火点预测成功");

  } catch (error) {
    console.error("预测错误:", error);
    ElMessage.error("火点预测失败");
  }
};

const addGeoJSONToMap = (geojsonData: any) => {
  if (map.value) {
    Object.keys(geojsonData).forEach(step => {
      let fillColor = 'red'; // 默认颜色

      // 根据step值设置不同的颜色
      if (step === 'step_60') {
        fillColor = '#ff3636';
      } else if (step === 'step_90') {
        fillColor = '#FF8000';
      } else if (step === 'step_150') {
        fillColor = '#FFD700';
      }

      const geoJSONLayer = new AMap.GeoJSON({
        geoJSON: geojsonData[step],
        getPolygon: (geojson: any, lnglats: any) => {
          const area = AMap.GeometryUtil.ringArea(lnglats[0]);
          console.log("燃烧区域面积：", area)
          return new AMap.Polygon({
            path: lnglats,
            fillOpacity: 0.5, // 设置填充透明度
            strokeColor: fillColor, // 边界颜色
            fillColor: fillColor // 根据步骤设置填充颜色
          });
        }
      });

      map.value.add(geoJSONLayer);
      firePredictLayers.push(geoJSONLayer);
    });
    console.log('后端返回的 GeoJSON 数据加载完成');
  }
};

const performBuffer = () => {
  if (!jsonResponse.value) {
    ElMessage.error("请先执行火点预测");
    return;
  }

  const distance = parseFloat(bufferDistance.value);
  if (isNaN(distance)) {
    ElMessage.error("请输入有效的缓冲区距离");
    return;
  }

  console.log(jsonResponse.value);
  const step150Features = jsonResponse.value.data.step_150.features;
  console.log(step150Features);
  const bufferedFeatures = step150Features.map((feature: any) => {
    const buffered = turf.buffer(feature, distance, { units: 'meters' });
    return buffered;
  });

  console.log(bufferedFeatures);

  // 将缓冲区图层添加到地图
  const bufferedGeoJSON = {
    type: "FeatureCollection",
    features: bufferedFeatures
  };

  // 清除之前的缓冲区图层
  if (bufferLayer) {
    map.value?.remove(bufferLayer);
  }

  bufferLayer = new AMap.GeoJSON({
    geoJSON: bufferedGeoJSON,
    getPolygon: (geojson: any, lnglats: any) => {
      return new AMap.Polygon({
        path: lnglats,
        fillOpacity: 0.5,
        strokeColor: 'rgba(0,217,255,0.58)',
        fillColor: '#00D9FF94'
      });
    }
  });

  if (map.value) {
    map.value.add(bufferLayer);
  }

  console.log('缓冲区分析完成并添加到地图');
  ElMessage.success("缓冲区分析成功");
};

const addResidentsMarkers = async () => {
  try {
    const response = await axios.get('/flask/get_residents');
    const residents = response.data;
    // 创建一个 icon
    var residentIcon = new AMap.Icon({
      size: new AMap.Size(25, 25),
      image: residentsIcon,
      imageSize: new AMap.Size(25, 25),
    });

    Object.keys(residents).forEach(key => {
      const { X, Y, NAME } = residents[key];
      const marker = new AMap.Marker({
        position: new AMap.LngLat(X, Y),
        icon: residentIcon,
        offset: new AMap.Pixel(-12.5, -12.5),
        title: NAME
      });
      residentMarkers.push(marker);
      if (controls.value.residentsMarkers && map.value) {
        map.value.add(marker);
      }
    });
  } catch (error) {
    console.error("获取居民区数据失败:", error);
    ElMessage.error("获取居民区数据失败");
  }
};

const addStationMarkers = async () => {
  try {
    const response = await axios.get('/flask/get_stations');
    const stations = response.data;
    // 创建一个 icon
    var stationIcon = new AMap.Icon({
      size: new AMap.Size(25, 25),
      image: stationIcon_,
      imageSize: new AMap.Size(25, 25),
    });

    Object.keys(stations).forEach(key => {
      const { X, Y, NAME } = stations[key];
      const marker = new AMap.Marker({
        position: new AMap.LngLat(X, Y),
        icon: stationIcon,
        offset: new AMap.Pixel(-12.5, -12.5),
        title: NAME
      });
      stationMarkers.push(marker);
      if (controls.value.stationMarkers && map.value) {
        map.value.add(marker);
      }
    });
  } catch (error) {
    console.error("获取消防站数据失败:", error);
    ElMessage.error("获取消防站数据失败");
  }
};

const toggleResidentsMarkers = () => {
  if (controls.value.residentsMarkers) {
    // 显示居民区标记
    if (map.value) {
      residentMarkers.forEach(marker => {
        map.value.add(marker);
      });
    }
  } else {
    // 隐藏居民区标记
    if (map.value) {
      residentMarkers.forEach(marker => {
        map.value.remove(marker);
      });
    }
  }
};

const toggleStationMarkers = () => {
  if (controls.value.stationMarkers) {
    // 显示消防站标记
    if (map.value) {
      stationMarkers.forEach(marker => {
        map.value.add(marker);
      });
    }
  } else {
    // 隐藏消防站标记
    if (map.value) {
      stationMarkers.forEach(marker => {
        map.value.remove(marker);
      });
    }
  }
};

const analyzeStations = () => {
  if (!bufferLayer) {
    ElMessage.error("请先执行缓冲区分析");
    return;
  }

  const polygons = bufferLayer.getOverlays().filter(overlay => overlay instanceof AMap.Polygon);
  if (polygons.length === 0) {
    ElMessage.error("没有找到缓冲区多边形");
    return;
  }

// 清除所有标记的标签
  residentMarkers.forEach(marker => {
    marker.setLabel({
      content: '',
      offset: new AMap.Pixel(20, 0)
    });
  });

  const bufferPath = polygons[0].getPath();
  dispatchStations = [];

  stationMarkers.forEach(marker => {
    const point = marker.getPosition();
    const isPointInRing = AMap.GeometryUtil.isPointInRing(point, bufferPath);
    if (isPointInRing) {
      marker.setLabel({
        content: marker.getTitle(),
        offset: new AMap.Pixel(20, 0)
      });
      dispatchStations.push(marker);
    } else {
      marker.setLabel(null);
    }
  });

  if (dispatchStations.length === 0) {
    ElMessage.info("没有消防站在缓冲区内");
  } else {
    ElMessage.success(`找到 ${dispatchStations.length} 个消防站在缓冲区内`);
  }
};
const clearRoute = () => {
  // 清除之前的驾车实例结果
  drivingInstances.forEach(drivingInstance => {
    drivingInstance.clear();
  });
  drivingInstances = [];
}

const analyzeEvacuate = () => {
  if (!bufferLayer) {
    ElMessage.error("请先执行缓冲区分析");
    return;
  }

  const polygons = bufferLayer.getOverlays().filter(overlay => overlay instanceof AMap.Polygon);
  if (polygons.length === 0) {
    ElMessage.error("没有找到缓冲区多边形");
    return;
  }

  // 清除所有标记的标签
  residentMarkers.forEach(marker => {
    marker.setLabel({
      content: '',
      offset: new AMap.Pixel(20, 0)
    });
  });


  const bufferPath = polygons[0].getPath();
  evacuateResidents = [];

  residentMarkers.forEach(marker => {
    const point = marker.getPosition();
    const isPointInRing = AMap.GeometryUtil.isPointInRing(point, bufferPath);
    if (isPointInRing) {
      marker.setLabel({
        content: marker.getTitle(),
        offset: new AMap.Pixel(20, 0)
      });
      evacuateResidents.push(marker);
    } else {
      marker.setLabel(null);
    }
  });

  if (evacuateResidents.length === 0) {
    ElMessage.info("没有居民点在缓冲区内");
  } else {
    ElMessage.success(`找到 ${evacuateResidents.length} 个居民点在缓冲区内`);
  }
};
const evacuateInform = () => {
  if (evacuateResidents.length === 0) {
    ElMessage.error("没有需要通知的居民点");
    return;
  }
  console.log(evacuateResidents)
  evacuateResidents.forEach(marker => {
    const { title, position } = marker._originOpts;
    ElMessage.success(`通知已发送给 ${title.slice(0, -3)}`);
    // // 发送通知到微信小程序，具体实现取决于微信小程序的API和后端服务
    // axios.post('/api/sendEvacuationNotice', {
    //   name: title,
    //   location: position
    // }).then(response => {
    //   if (response.data.success) {
    //     ElMessage.success(`通知已发送给 ${title}`);
    //   } else {
    //     ElMessage.error(`通知发送失败: ${response.data.error}`);
    //   }
    // }).catch(error => {
    //   console.error("通知发送错误:", error);
    //   ElMessage.error("通知发送错误");
    // });
  });
};


const planRoutes = () => {
  if (!inputLngLat) {
    ElMessage.error("请先输入经纬度");
    return;
  }

  // 清除之前的路径规划结果
  if (drivingResultsLayer) {
    map.value?.remove(drivingResultsLayer);
  }

  clearRoute()

  const drivingRoutes = [];

  // 显示 panel div
  const panel = document.getElementById('panel');
  if (panel) {
    panel.style.display = 'block';
  }

  routes.value = dispatchStations.map((_, index) => index); // 根据 dispatchStations 数量生成 panel

  dispatchStations.forEach((station, index) => {
    const panelId = `panel${index}`;
    const drivingInstance = new AMap.Driving({
      map: map.value,
      panel: panelId
    });

    const startLngLat = station.getPosition();
    drivingInstances.push(drivingInstance); // 存储实例以便清除

    drivingInstance.search(startLngLat, inputLngLat, (status: any, result: any) => {
      if (status === 'complete') {
        console.log('绘制驾车路线完成');
        map.value?.setCenter(inputLngLat);

        // 保存每个规划的结果
        result.routes.forEach(route => {
          const path = route.steps.reduce((path, step) => {
            return path.concat(step.path);
          }, []);
          const polyline = new AMap.Polyline({
            path,
            isOutline: true,
            outlineColor: '#ffeeee',
            borderWeight: 2,
            strokeWeight: 5,
            strokeColor: '#0091ff',
            lineJoin: 'round'
          });
          drivingRoutes.push(polyline);
        });
      } else {
        console.error('获取驾车数据失败：', result);
      }
    });
  });

  // 创建一个 OverlayGroup 将所有的 Polyline 添加进去
  drivingResultsLayer = new AMap.OverlayGroup(drivingRoutes);
  map.value?.add(drivingResultsLayer);
};

onMounted(async () => {
  const centerAMap = await convertCoords(centerGPS);
  console.log(centerAMap);
  window._AMapSecurityConfig = {
    securityJsCode: "b1c914cfb0bb70a7b5c4b1a0bb54a400",
  };
  AMapLoader.load({
    key: "571e66529d0579cd26e1c5031dcb1b3e",
    version: "2.0",
    plugins: ["AMap.Scale", "AMap.ToolBar", "AMap.ControlBar", "AMap.HawkEye", "AMap.GeometryUtil", "AMap.GeoJSON", "AMap.Driving"],
  })
      .then((AMapInstance) => {
        AMap = AMapInstance;
        map.value = new AMap.Map("container", {
          viewMode: "3D",
          zoom: 11,
          center: centerAMap,
        });

        scaleControl = new AMap.Scale({ visible: controls.value.scale });
        toolBarControl = new AMap.ToolBar({ visible: controls.value.toolbar });
        controlBarControl = new AMap.ControlBar({ visible: controls.value.controlBar });
        overViewControl = new AMap.HawkEye({ visible: controls.value.overview });

        map.value.addControl(scaleControl);
        map.value.addControl(toolBarControl);
        map.value.addControl(controlBarControl);
        map.value.addControl(overViewControl);

        // 添加居民区标记
        addResidentsMarkers();

        // 添加消防站标记
        addStationMarkers();
      })
      .catch((e: any) => {
        console.error(e);
      });
});

onUnmounted(() => {
  if (map.value) {
    map.value.destroy();
  }
});

const toggleScale = () => {
  if (scaleControl) {
    if (controls.value.scale) {
      scaleControl.show();
    } else {
      scaleControl.hide();
    }
  }
};

const toggleToolBar = () => {
  if (toolBarControl) {
    if (controls.value.toolbar) {
      toolBarControl.show();
    } else {
      toolBarControl.hide();
    }
  }
};

const toggleControlBar = () => {
  if (controlBarControl) {
    if (controls.value.controlBar) {
      controlBarControl.show();
    } else {
      controlBarControl.hide();
    }
  }
};

const toggleOverViewShow = () => {
  if (overViewControl) {
    if (controls.value.overview) {
      overViewControl.show();
    } else {
      overViewControl.hide();
    }
  }
};

const togglePanel = () => {
  panelOpen.value = !panelOpen.value;
};

const showInputPanel = () => {
  console.log("触发 showInputPanel");
  isPanelVisible.value = true;
};

// 监视 dispatchShow 变量的变化
watch(
    () => dispatchShow.value,
    (newValue, oldValue) => {
      if ((oldValue && !newValue) && (newValue === false)) {
        clearRoute();
        // 隐藏 panel div
        const panel = document.getElementById('panel');
        if (panel) {
          panel.style.display = 'none';
        }
      }

    }

);
watch(
    () => isShow.value,
    (newValue, oldValue) => {
      if (!oldValue && newValue) {
        addDraggableMarker()
      }else if (oldValue && !newValue) {
        clearDraggableMarker();
      }
    }
);

</script>


<style scoped>
#container {
  width: 100%;
  height: calc(100vh - 85px);
  padding: 0;
  border: 0;
  overflow: hidden;
  margin-top: 5px;
  margin-right: auto;
  margin-left: auto;
  border-radius: 20px;
}

.control-panel {
  position: absolute;
  top: 15px;
  right: 45px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: all 0.3s;
}

.control-panel.open {
  width: 150px;
  padding: 10px;
}

.control-panel:not(.open) {
  width: 60px;
  height: 30px;
  overflow: hidden;
}

.toggle-button {
  width: 100%;
  height: 30px;
  background: #366476;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: auto;
  font-weight: bold; /* 字体加粗 */
}

.input-card {
  display: flex;
  flex-direction: column;
}

.input-item {
  margin-bottom: 0px;
}

.input-panel {
  position: absolute;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中 */
  justify-content: center; /* 垂直居中 */
}

.coordinate-inputs {
  display: flex;
  gap: 10px; /* 调整输入框之间的间隔 */
  margin: 5px;
}

:deep(.el-button){
  margin-bottom: 0;
  border-radius: 5px;
  background-color: #366476FF;
  border: none;
  align-items: center;
  justify-content: center;
  display: flex;
  position: relative;
}

#panel {
  position: absolute;
  top: 120px;
  left: 10px;
  width: 280px;
  max-height: 75%;
  background-color: white;
  overflow-y: auto;
  border-radius: 5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

#panel .panel-content {
  background-color: #f0f0f0;
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
}

#panel .amap-call {
  background-color: #009cf9;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

#panel .amap-lib-driving {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  overflow: hidden;
}
</style>