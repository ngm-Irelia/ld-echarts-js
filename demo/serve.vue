<template>
  <div
    class="container"
    style="background: rgba(3, 25, 53, 1)"
  >
    <button @click="clickBtn">柱状图</button>
    <div
      id="barchartbox"
      style="width: 400px; height: 300px;"
    >

    </div>

    <button @click="secondClickBtn">横向柱状图</button>
    <div
      id="xbarchartbox"
      style="width: 400px; height: 300px;"
    >

    </div>

    <button @click="secondClickBtn">折线图 LineChart</button>
    <div
      id="linechartbox"
      style="width: 400px; height: 300px;"
    >

    </div>

    <button @click="pieClickBtn">饼图 PieChart</button>
    <div
      id="piechartbox"
      style="width: 600px; height: 400px;"
    >

    </div>

    <!-- <button @click="gismapClickBtn">地图 GisMap</button>
    <div style="width: 600px; height: 400px;">
      <gis-map
        :type="'advance'"
        :mapArea="'shandong'"
        :areaData="[]"
        :lineData="[]"
        :mapJson="[]"
      />
    </div> -->

  </div>
</template>

<script>
import * as charts from '@/index'

export default {
  data() {
    return {
      title: 'demo',
      axisData: ['1'],
      valueData: [222],
      secondAxisData: ['1', '2'],
      secondValueData: [333, 33],
      threeValueData: [
        { value: 1048, name: '搜索引擎' },
        { value: 735, name: '直接访问' },
        { value: 580, name: '邮件营销' },
        { value: 484, name: '联盟' },
        { value: 484, name: '联盟1' },
        { value: 484, name: '联盟2' },
        { value: 300, name: '视频广告' },
      ],
    }
  },
  created() {},
  mounted() {},
  methods: {
    ...charts,
    clickBtn: function () {
      let num = Math.floor(Math.random() * 10 + 1)
      let tArr = []
      let vArr = []
      for (let i = 0; i < num; i++) {
        tArr.push(i)
        vArr.push(Math.floor(Math.random() * 100 + 1))
      }

      this.addBarChart('', document.getElementById('barchartbox'), tArr, [
        {
          name: '',
          type: 'bar',
          label: {
            show: true,
            position: 'top',
          },
          data: vArr,
          itemStyle: {
            normal: {
              color: '#917DF7',
            },
          },
          barWidth: '15px',
        },
      ])
    },
    secondClickBtn: function () {
      let num = Math.floor(Math.random() * 10 + 1)
      let tArr = []
      let vArr = []
      for (let i = 0; i < num; i++) {
        tArr.push(i)
        vArr.push(Math.floor(Math.random() * 100 + 1))
      }

      this.addXBarChart(
        '',
        document.getElementById('xbarchartbox'),
        tArr,
        [
          {
            name: '',
            type: 'bar',
            label: {
              show: true,
              position: 'right',
            },
            data: vArr,
            itemStyle: {
              normal: {
                color: '#41d9ed',
              },
            },
            barWidth: '15px',
          },
        ],
      )
    
      let lineSerise = [
        {
          name: '',
          type: 'line',
          stack: '金额',
          data: vArr,
          symbol: 'circle', //折线点设置为实心点
          symbolSize: 8, //折线点的大小
          itemStyle: {
            normal: {
              color: '#41d9ed', //折线点的颜色
              lineStyle: {
                width: 1.5,
                color: '#41d9ed', //折线的颜色
              },
            },
          },
        },
      ]
      this.addLineChart(
        '',
        document.getElementById('linechartbox'),
        tArr,
        lineSerise,
      )
    },
    pieClickBtn: function () {
      let num = Math.floor(Math.random() * 10 + 1)
      let vArr = []
      for (let i = 0; i < num; i++) {
        vArr.push({
          name: "name"+i,
          value: Math.floor(Math.random() * 100 + 1),
        })
      }

      this.addPieChart('', document.getElementById('piechartbox'), [{
          name: '',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          label: {
            alignTo: 'edge',
            formatter: '{d}%\n{c}亿元',
            minMargin: 5,
            edgeDistance: 10,
            lineHeight: 15,
            rich: {
              time: {
                fontSize: 10,
                color: '#999'
              }
            }
          },
          data: vArr
        }]);
    },
  },
}
</script>