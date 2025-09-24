<template>
  <div></div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import * as L from 'leaflet';
import axios from 'axios';
import blueIcon from '@/assets/blue.svg';
import yellowIcon from '@/assets/yellow.svg';
import orangeIcon from '@/assets/orange.svg';
import redIcon from '@/assets/red.svg';
import * as echarts from 'echarts';

// 使用 defineProps 接收父组件传递的 props
const props = defineProps(['map', 'baseMaps', 'feature']);
const statistic = ref(null);
const markers = L.layerGroup();
const BlueIcon = new L.Icon({
  iconUrl: blueIcon,
  iconSize: [30, 30],
});
const YellowIcon = new L.Icon({
  iconUrl: yellowIcon,
  iconSize: [30, 30],
});
const OrangeIcon = new L.Icon({
  iconUrl: orangeIcon,
  iconSize: [30, 30],
});
const RedIcon = new L.Icon({
  iconUrl: redIcon,
  iconSize: [30, 30],
});

async function fetchPointsForm() {
  try {
    const response = await axios.post("/flask/fire_points", {});
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

async function fetchStatistic() {
  try {
    const response = await axios.post("/flask/fire_statistic", {});
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

function getOption(data: any[], title: string) {
  return {
    title: {
      text: title,
      left: 'center'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(item => item[0])
    },
    yAxis: {
      type: 'value',
      name: "火灾等级",
      boundaryGap: [0, '30%']
    },
    visualMap: {
      type: 'piecewise',
      show: false,
      dimension: 0,
      seriesIndex: 0,
      pieces: [
        {gte: 0, lt: 1, color: 'rgba(180,0,75,0.4)'},
        {gt: 1, lt: 3, color: 'rgba(0, 0, 180, 0.4)'},
        {gt: 3, lt: 5, color: 'rgba(180,0,75,0.4)'},
        {gt: 5, lt: 7, color: 'rgba(0, 0, 180, 0.4)'},
        {gte: 7, color: 'rgba(180,0,75,0.4)'},
      ]
    },
    series: [
      {
        type: 'line',
        smooth: 0.4,
        symbol: 'circle',
        lineStyle: {color: '#5470C6', width: 2},
        markLine: {
          symbol: ['none', 'none'],
          label: {show: false},
          data: [{xAxis: 1}, {xAxis: 3}, {xAxis: 5}, {xAxis: 7}]
        },
        areaStyle: {},
        data: data
      }
    ]
  };
}

function getBarOption(data: any[], title: string) {
  const yearCount = data.reduce((acc: any, cur: any) => {
    const year = new Date(cur[0]).getFullYear();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  const years = Object.keys(yearCount);
  const counts = Object.values(yearCount);

  return {
    title: {
      text: title,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {type: 'shadow'}
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {type: 'category', data: years, axisTick: {alignWithLabel: true}}
    ],
    yAxis: [
      {type: 'value', name: "火灾数量"}
    ],
    series: [
      {name: '火灾数量', type: 'bar', barWidth: '60%', data: counts}
    ]
  };
}

function getColorByDataCount(count: number): string {
  if (count > 7) {
    return '#d63429';
  } else if (count > 6) {
    return '#f3986a';
  } else if (count > 5) {
    return '#f8e85b';
  } else if (count > 3) {
    return '#4876b4';
  } else {
    return '#8ca4b9';
  }
}

function onEachFeature(feature, layer) {
  if (feature.properties && feature.properties.DISTRICT !== undefined) {
    const studyName = feature.properties.Study;
    const studyData = statistic.value[studyName];
    if (studyData) {
      const dataCount = studyData.length;
      layer.setStyle({
        color: "#ffffff",
        weight: 3,
        opacity: 0.65,
        fillColor: getColorByDataCount(dataCount),
        fillOpacity: 0.7
      });

      const chartDiv = document.createElement('div');
      chartDiv.style.width = '300px';
      chartDiv.style.height = '200px';

      const barChartDiv = document.createElement('div');
      barChartDiv.style.width = '300px';
      barChartDiv.style.height = '200px';

      const popupDiv = document.createElement('div');
      popupDiv.appendChild(chartDiv);
      popupDiv.appendChild(barChartDiv);

      layer.bindPopup(popupDiv);

      let myChart = null;
      let myBarChart = null;

      layer.on('popupopen', () => {
        setTimeout(() => {
          myChart = echarts.init(chartDiv);
          const option = getOption(studyData, studyName + '历史火灾信息');
          myChart.setOption(option);

          myBarChart = echarts.init(barChartDiv);
          const barOption = getBarOption(studyData, studyName + '每年火灾数量');
          myBarChart.setOption(barOption);
        }, 0);
      });

      layer.on('popupclose', () => {
        if (myChart) {
          myChart.dispose();
          myChart = null;
        }
        if (myBarChart) {
          myBarChart.dispose();
          myBarChart = null;
        }
      });
    }
  }
}

async function fetchDataAndProcess() {
  const pointForm = await fetchPointsForm();
  statistic.value = await fetchStatistic();
  if (pointForm) {
    Object.entries(pointForm).forEach(([key, value]) => {
      const area = value.AREA;
      const date = value.DATE;
      const level = value.LEVEL;
      const x = value.X;
      const y = value.Y;
      let FireIcon;
      switch (level) {
        case 1:
          FireIcon = BlueIcon;
          break;
        case 2:
          FireIcon = YellowIcon;
          break;
        case 3:
          FireIcon = OrangeIcon;
          break;
        case 4:
          FireIcon = RedIcon;
          break;
        default:
          FireIcon = BlueIcon;
          break;
      }

      let marker = L.marker(new L.LatLng(y, x), {
        draggable: false,
        icon: FireIcon
      }).bindPopup(`<div style="font-size: 16px;">
                          <b>火点编号:</b> <b>${key}</b><br>
                          <b>火灾地区:</b> <b>${area}</b><br><b>火灾时间:</b>
                          <b>${date}</b><br><b>火灾等级:</b> <b>${level}</b><br>
                          <b>伤亡人数: 0</b>`);
      markers.addLayer(marker);
    });
    markers.addTo(props.map);
  }
  const polygon = L.geoJSON(props.feature, {
    onEachFeature: onEachFeature
  });
  const overlayMaps = {
    'points': markers,
    'MultiPolygon': polygon,
  };
  L.control.layers(props.baseMaps, overlayMaps, {position: 'topleft'}).addTo(props.map);

  // // 添加 zoom 控件到左下角
  // L.control.zoom({position:'topright', zoomInTitle:'放大', zoomOutTitle:'缩小'}).addTo(props.map);
}

onMounted(async () => {
  await fetchDataAndProcess();
});
</script>

