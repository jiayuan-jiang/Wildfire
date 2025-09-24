<template>
  <div class="container">
    <div id="mapView"></div>
    <!-- 直接传递 props 给子组件 -->
    <FirePoints :map="map" :feature="feature" :baseMaps="baseMaps" />
  </div>
  <div v-if="anticipateShow" class="input-panel" @click="handleAnticipate">
    <el-button class="button" type="primary">火险等级预测</el-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as L from 'leaflet';
import 'leaflet.heat';
import FirePoints from './FirePoints.vue';
import icon from 'leaflet/dist/images/marker-icon.png';
import feature from '@/assets/dc.json';
import { anticipateShow } from "@/components/leaflet/dialogDisplay";
import axios from 'axios';
import 'leaflet/dist/leaflet.css';  // 引入leaflet的CSS文件

const map = ref(null);
const baseMaps = ref(null);

const DefaultIcon = L.icon({
  iconUrl: icon,
  iconAnchor: [15, 0]
});

onMounted(() => {
  map.value = L.map('mapView', {
    zoomSnap: 0.1, // 地图的有效缩放级别
    maxZoom: 13,
    zoomControl: true,
    wheelPxPerZoomLevel: 60, // 鼠标滚轮缩放 较小的值将使滚轮缩放更快
  }).setView([26.195746, 103.060725], 11); // 默认中心点

  const baseLayer = L.tileLayer("http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
    attribution: '&copy; 高德地图',
    maxZoom: 13,
    minZoom: 3,
    subdomains: "1234",
  }).addTo(map.value);

  const gaodeMap = L.tileLayer("https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}", {
    attribution: '&copy; 高德地图',
    maxZoom: 18,
    minZoom: 3,
    subdomains: "1234",
  });

  baseMaps.value = {
    '街道图': baseLayer,
    '影像图': gaodeMap
  };

});

const handleAnticipate = async () => {
  try {
    const response = await axios.get('/flask/fire_points');
    const firePoints = response.data;

    const heatData = [];
    for (const key in firePoints) {
      const point = firePoints[key];
      heatData.push([point.Y, point.X, point.LEVEL]);
    }

    const heatLayer = L.heatLayer(heatData, {
      radius: 50,  // 增大半径
      blur: 15,
      maxZoom: 17,
      gradient: {
        0.2: 'rgba(255, 0, 0, 0.4)',   // 浅红色，透明度降低
        0.4: 'rgba(255, 0, 0, 0.6)',   // 红色，透明度适中
        0.6: 'rgba(255, 69, 0, 0.8)',  // 深红色，透明度适中
        0.8: 'rgba(255, 69, 0, 0.9)',  // 深红色，透明度较高
        1.0: 'rgb(1,68,139)'    // 最深红色，不透明
      }
    }).addTo(map.value);
  } catch (error) {
    console.error("Error fetching fire points:", error);
  }
};
</script>

<style scoped>
#heatNumbers, #heatRadius {
  width: 50px;
  display: inline-block;
}

#mapView {
  height: 100vh;
  width: 100%;
}

:deep(.leaflet-control-attribution) {
  display: none ;
}

.container {
  width: 170vh;
  height: 90vh;
  padding: 0;
  border: 0;
  overflow: hidden;
  margin-top: 5px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 20px;
}
.input-panel {
  position: absolute;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 10px;
  border-radius: 7px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中 */
  justify-content: center; /* 垂直居中 */
  z-index: 1000;
}
.button{
  margin: auto;
}
</style>
