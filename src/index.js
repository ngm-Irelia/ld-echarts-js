
import * as echarts from 'echarts'

/**
 * 加载地图的方法 - 可以展示 点数据，线数据
 * @param {*} ids        显示地图的元素id
 * @param {*} showDatas  地图上显示的数据
 * @param {*} mapJson    地图json
 * @param {*} lData      地图上线条的数据
 */
 export function initMap (ids, showData, mapJson, lData) {
  const CityEnum = {
    '东营市': [118.625299, 37.636119],
    '临沂市': [118.286436, 35.311894],
    '威海市': [122.000809, 37.118689],
    '德州市': [116.653994, 37.251363],
    '日照市': [119.146499, 35.578656],
    '枣庄市': [117.39817, 34.916234],
    '泰安市': [117.030947, 36.002333],
    '济南市': [117.221244, 36.639974],
    '济宁市': [116.74105, 35.371092],
    '淄博市': [118.058672, 36.610968],
    '滨州市': [117.847396, 37.542717],
    '潍坊市': [119.077723, 36.554349],
    '烟台市': [120.805129, 37.241857],
    '聊城市': [115.887733, 36.460089],
    '菏泽市': [115.698013, 35.152536],
    '青岛市': [120.150851, 36.451234],
  }

  const CityList = ['东营市', '临沂市', '威海市', '德州市', '日照市', '枣庄市', '泰安市', '济南市', '济宁市', '淄博市', '滨州市', '潍坊市', '烟台市', '聊城市', '菏泽市', '青岛市'];
  
  /* let baseRegions = {}
  mapJson.features.map(item => {// 获得每个市的名字,经纬度信息
    baseRegions[item.properties.name] = item.properties.centroid
  } ); */

  let maxNum = 0;
  showData.forEach((item) => {
    if(item.value > maxNum) {
      maxNum = item.value
    }
  })

  // 点数据
  let newShowData = []
  for(let i=0;i<CityList.length;i++){
    let cityItem = '';
    for(let j=0;j<showData.length;j++){
      if(CityList[i] == showData[j].name) {
        cityItem = showData[j]
      }
    }
    if(cityItem) {
      let newItem = JSON.parse(JSON.stringify(cityItem));
      newItem.num = newItem.value;
      if(CityEnum.hasOwnProperty(cityItem.name)) {
        newItem.value = [...CityEnum[cityItem.name], newItem.value]
      }
      newShowData.push(newItem)
    }else{
      newShowData.push({
        name: CityList[i],
        value: CityEnum[CityList[i]],
        num: ''
      })
    }
  }

  // 线数据
  let lineData = []
  lData.forEach((item) => {
    if(CityEnum.hasOwnProperty(item.city)) {
      lineData.push({
        fromName: '济南市', // 起点城市name
        toName: item.city, // 终点城市name
        coords: [
          [117.221244, 36.639974], // 起点城市坐标
          CityEnum[item.city] // 终点城市坐标
        ],
      })
    }
  })

  let v = this;
  echarts.registerMap('shandong', mapJson);
  let chart = echarts.init(document.getElementById(ids));

  let option = {

    visualMap: {
      min: 0,
      max: maxNum,
      show: false,
      text: ['High', 'Low'],
      realtime: false,
      calculable: true,
      inRange: {
        color: ['#4D7BA9', '#386EA8', '#2860A7', '#1C4B91', '#123A7B']
      }
    },
    geo: {
      geoIndex: 1,
      zoom: 1.1,
      map: 'shandong',
      label: {
        position: 'top',
        distance: 150,
        formatter: '{b}\n{c}',
        show: false,
        color: '#fff',
        normal: {
            show: false,
            formatter: '{b}\n{c}',
            textStyle: {
              formatter: '{b}\n{c}',
                color: '#fff'
            }
        },
        emphasis: {
          show: false,
          color: '#fff',
          formatter: '{b}\n{c}',
        }
      },
      itemStyle: {
        normal: {
        color: '#fff',
        areaColor: '#4E545F',
        borderColor: '#87929F',
        borderWidth: 1,
        
        }
      },
      data: newShowData,
    },
    series: [
      {
        name: 'mapLines',
        type: 'lines',
        zlevel: 1,
        symbolSize: 6,
        effect: {
          show: true,
          period: 4, // 箭头指向速度，值越小速度越快
          trailLength: 0.2, // 特效尾迹的长度。取从 0 到 1 的值，数值越大尾迹越长。
          symbol: 'arrow', // 特效图形的标记。
          symbolSize: 6 // 特效标记的大小
        },
        lineStyle: {
          normal: {
            width: 1, // 尾迹线条宽度
            color: '#1DE9B6', // 线颜色 4ab2e5 1DE9B6   1DE9B6 FF4500
            opacity: 0.1, // 尾迹线条透明度
            curveness: 0.2 // 边的曲度，支持从 0 到 1 的值，值越大曲度越大。
          }
        },
        data: lineData
      },
      {
        type: 'scatter', //类型，表示点数据
        coordinateSystem: 'geo',
        data: newShowData, //数据源
        symbolSize: 1, //标记点大小
        //标记样式：可使用svg图标
        //symbol: 'path://M877.632 456.8c14.976-14.72 20.384-32.96 14.816-49.984-5.536-17.024-20.608-28.544-41.344-31.584l-190.24-27.84c-6.976-1.024-18.464-9.472-21.6-15.904l-85.12-173.696c-9.28-18.944-24.896-29.76-42.88-29.76-17.952 0-33.6 10.816-42.816 29.76l-85.12 173.696c-3.104 6.432-14.592 14.848-21.6 15.904l-190.24 27.84c-20.704 3.04-35.776 14.56-41.344 31.584-5.568 17.024-0.16 35.232 14.816 49.984l137.696 135.232c5.088 4.992 9.536 18.816 8.32 25.92l-32.48 190.912c-3.552 20.832 2.752 38.816 17.344 49.344 7.52 5.44 16.224 8.16 25.472 8.16 8.576 0 17.6-2.336 26.56-7.04l170.176-90.176c6.048-3.2 20.448-3.2 26.528 0l170.144 90.112c18.528 9.856 37.504 9.44 52.064-1.056 14.56-10.528 20.864-28.48 17.344-49.28l-32.48-190.976c-1.28-7.104 3.2-20.928 8.32-25.92l137.664-135.232z',
        //角度信息
        symbolRotate: 0,
        //鼠标选中说明
        label: {
          distance: 50,
          normal: {
              formatter: function (item) {
                return `${item.name}\n${item.data.num}`
              },
              show: true, //是否一直显示
              color: '#fff',
              fontWeight: '400'
          },
          emphasis: {
              show: true,
              distance: 50,
              color: '#fff',
          }
        },
      },
      {
        geoIndex: 0,
        name: 'yh',
        type: 'map',
        mapType: 'shandong',
        zoom: 1.2,
        data: newShowData,
        symbolSize: function(val) {
          return val[2] / 15;
        },
        label: {
          position: 'top',
          distance: 50,
          formatter: '{b}\n{c}',
          show: false,
          color: '#fff',
          emphasis: {
            show: false,
            color: '#fff'
          },
          normal: {
              formatter: '{b}\n{c}', //tooltip显示，自定义参考上方例子
              position: 'left', //对齐
              show: false //是否一直显示
          }
        },
        itemStyle: {
          normal: {
          color: '#fff',
          areaColor: '#4E545F',
          borderColor: '#87929F',
          borderWidth: 1
          }
        },
        zlevel: 13
      },
    ]

  };
  chart.setOption(option);
  window.addEventListener("resize", function() {
    chart.resize();
  });
}

/**
 * 加载地图的方法 - 只展示地图
 * @param {*} ids        显示地图的元素id
 * @param {*} showDatas  地图上显示的数据
 * @param {*} mapJson    地图json
 */
export function initMapBase (ids, showData, mapJson) {
  let maxNum = 0;
  showData.forEach((item) => {
    if(item.value > maxNum) {
      maxNum = item.value
    }
  })
  let v = this;
  echarts.registerMap('shandong', mapJson);
  let chart = echarts.init(document.getElementById(ids));

  let option = {
    visualMap: {
    min: 0,
    max: maxNum,
    show: false,
    text: ['High', 'Low'],
    realtime: false,
    calculable: true,
    inRange: {
      color: ['#4D7BA9', '#386EA8', '#2860A7', '#1C4B91', '#123A7B']
    }
    },
    series: [{
    name: 'yh',
    type: 'map',
    mapType: 'shandong',
    zoom: 1.2,
    data: showData,
    symbolSize: function(val) {
      return val[2] / 15;
    },
    label: {
      position: 'top',
      distance: 50,
      formatter: '{b}\n{c}',
      show: true,
      color: '#fff',
      emphasis: {
      show: true,
      color: '#fff'
      }
    },
    itemStyle: {
      normal: {
      color: '#fff',
      areaColor: '#4E545F',
      borderColor: '#87929F',
      borderWidth: 1
      }
    },
    zlevel: 13
    }]

  };
  chart.setOption(option);
  window.addEventListener("resize", function() {
    chart.resize();
  });
}

/**
 * 柱状图
 * @param {*} title 标题
 * @param {*} dom 图表存放的元素id
 * @param {*} data 数据
 * @param {*} series 配置
 */
export function addBarChart (title, dom, data, series) {
  let myChart = echarts.init(dom);
  myChart.setOption({
    title: {
      text: title
    },
    tooltip: {},
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
    },
    xAxis: {
      data: data,
      axisLine: {
        lineStyle: {
          color: "#386db3"
        },
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff',
          fontSize: 10
        },
        interval: 0,  
        rotate: 25,
      },
      axisTick: {
        show: false
      },
      spiltLine: {
        show: false,
        lineStyle: {
          color: "#fff"
        }
      }
    },
    yAxis: {
      //网格样式
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#adf4fd'],
          width: 0.3,
          type: 'solid'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff'
        }
      },
    },
    series: series
  });
}

/**
 * 横向柱状图
 * @param {*} title 标题
 * @param {*} dom 图表存放的元素id
 * @param {*} data 数据
 * @param {*} series 配置
 */
export function addXBarChart (title, dom, data, series) {
  let myChart = echarts.init(dom);
  
  myChart.setOption({
    title: {
      text: title
    },
    tooltip: {},
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '5%',
        containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      //网格样式
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#adf4fd'],
          width: 0.3,
          type: 'solid'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff'
        }
      },
    },
    yAxis: {
      type: 'category',
      data: data,
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff'
        }
      },
    },
    series: series
  });
}

/**
 * 折线图
 * @param {*} title 标题
 * @param {*} dom 图表存放的元素id
 * @param {*} data 数据
 * @param {*} series 配置
 */
export function addLineChart (title, dom, data, series) {
  let myChart = echarts.init(dom);
  myChart.setOption({
    title: {
      text: title
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['月份']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '5%',
        containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data,
      axisLine: {
        lineStyle: {
          color: "#386db3"
        },
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff'
        }
      },
      axisTick: {
        show: true
      },
      //网格样式
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#adf4fd'],
          width: 0.2,
          type: 'solid'
        }
      }
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: series
  });
}

/**
 * 饼图
 * @param {*} title 标题
 * @param {*} dom 图表存放的元素id
 * @param {*} data 数据
 * @param {*} series 配置
 */
export function addPieChart (title, dom, series) {
  let myChart = echarts.init(dom);
  myChart.setOption({
    title: {
      text: title
    },
    tooltip: {
      trigger: 'item',
      formatter: "{b}:{c}"
    },
    legend: {
      orient: 'vertical',
      x: 'right',
      textStyle: {
        color: '#fff'
      }
    },
    calculable: true,
    series: series
  })

}