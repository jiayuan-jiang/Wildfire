<template>
  <div id="cesiumContainer"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import * as Cesium from 'cesium';
import axios from 'axios';

const cesiumContainer = ref<HTMLDivElement | null>(null);

const initializeCesium = () => {
  const viewer = new Cesium.Viewer(cesiumContainer.value!, {
    terrainProvider: Cesium.createWorldTerrain(),
  });

  // 示例火灾蔓延矢量模型
  const firePoints = [
    { position: Cesium.Cartesian3.fromDegrees(-115.0, 37.0), radius: 1000 },
    { position: Cesium.Cartesian3.fromDegrees(-115.2, 37.2), radius: 1500 },
  ];

  const updateFire = (viewer: Cesium.Viewer) => {
    firePoints.forEach((point) => {
      viewer.entities.add({
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
  setInterval(() => {
    firePoints.forEach(point => point.radius += 100); // 增加火灾蔓延半径
    updateFire(viewer);
  }, 10000); // 每10秒更新一次

  updateFire(viewer);
};

onMounted(() => {
  if (cesiumContainer.value) {
    initializeCesium();
  }
});
</script>

<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100vh;
}
</style>
