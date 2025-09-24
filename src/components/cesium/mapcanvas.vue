<template>
  <div id="canvas">
    <div id="cesiumContainer" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as Cesium from 'cesium';

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjYzRmOTkyMy0wZWFiLTRlZDQtOTM5OC00OTg4MTdiNjk0ZTAiLCJpZCI6MjIwNDM1LCJpYXQiOjE3MTc2NDQ2MzF9.DV56ZSdFT9a_vasa0H4dr4lw9spoDNgW0x9yogJl-88';

// 在组件外部定义变量
const viewer = ref<Cesium.Viewer | null>(null);

const initializeCesium = async () => {
  // 创建 Cesium Viewer
  viewer.value = new Cesium.Viewer('cesiumContainer', {
    baseLayerPicker: false
  });

  const terrainProvider = await Cesium.createWorldTerrainAsync({
    requestWaterMask: true,
    requestVertexNormals: true
  });

  viewer.value.scene.terrainProvider = terrainProvider;

  // 设置相机视角到火灾区域
  viewer.value.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-115.1, 37.1, 200000.0), // 聚焦到火灾区域
    orientation: {
      heading: Cesium.Math.toRadians(0.0),
      pitch: Cesium.Math.toRadians(-30.0),
      roll: 0.0,
    },
  });

  // 示例火灾蔓延矢量模型
  const firePoints = [
    { position: Cesium.Cartesian3.fromDegrees(-115.0, 37.0), radius: 1000 },
    { position: Cesium.Cartesian3.fromDegrees(-115.2, 37.2), radius: 1500 },
  ];

  // 定义地形坡度、风速和风向（简单示例）
  const windSpeed = 5; // 风速（单位：米/秒）
  const windDirection = Cesium.Math.toRadians(45); // 风向（单位：弧度）

  const computeSlope = async (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const positions = [
      Cesium.Cartographic.fromDegrees(lon1, lat1),
      Cesium.Cartographic.fromDegrees(lon2, lat2),
    ];
    const terrainData = await Cesium.sampleTerrainMostDetailed(viewer.value!.terrainProvider, positions);
    const height1 = terrainData[0].height;
    const height2 = terrainData[1].height;
    const distance = Cesium.Cartesian3.distance(
        Cesium.Cartesian3.fromDegrees(lon1, lat1, height1),
        Cesium.Cartesian3.fromDegrees(lon2, lat2, height2)
    );
    const slope = (height2 - height1) / distance;
    return slope;
  };

  const computeSpreadProbability = async (lat: number, lon: number, direction: number) => {
    const deltaLat = 0.001 * Math.cos(direction);
    const deltaLon = 0.001 * Math.sin(direction);
    const slope = await computeSlope(lat, lon, lat + deltaLat, lon + deltaLon);
    const windEffect = 1 + windSpeed * Math.cos(windDirection - direction);
    const slopeEffect = 1 + slope / 10;
    return windEffect * slopeEffect * 0.3; // 基础概率为 0.3
  };

  const updateFire = () => {
    if (!viewer.value) return;

    firePoints.forEach((point) => {
      viewer.value.entities.add({
        position: point.position,
        ellipse: {
          semiMinorAxis: point.radius,
          semiMajorAxis: point.radius,
          material: Cesium.Color.RED.withAlpha(0.5),
        },
      });
    });
  };

  // 更新火灾位置
  setInterval(async () => {
    for (const point of firePoints) {
      const cartographic = Cesium.Cartographic.fromCartesian(point.position);
      const lat = Cesium.Math.toDegrees(cartographic.latitude);
      const lon = Cesium.Math.toDegrees(cartographic.longitude);
      const directions = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]; // 四个方向：东、南、西、北
      for (const direction of directions) {
        const spreadProbability = await computeSpreadProbability(lat, lon, direction);
        if (Math.random() < spreadProbability) {
          point.radius += 100; // 增加火灾蔓延半径
        }
      }
    }
    viewer.value?.entities.removeAll(); // 清除之前的火灾实体
    updateFire();
  }, 10000); // 每10秒更新一次

  updateFire();
};

onMounted(() => {
  initializeCesium();
});
</script>

<style scoped>
#cesiumContainer {
  width: 170vh;
  height: 88vh;
  padding: 0;
  border: 0;
  overflow: hidden;
  margin: auto;
  border-radius: 20px;
}

#canvas {
  width: 100%;
  height: 100%;
}
</style>
