<template>
  <v-app :dark="darkTheme">
    <v-toolbar app dense>
      <img src="@/assets/logo.png" alt="NCU Helper" class="logo ma-1">
      <v-toolbar-title>NCU Helper</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <v-btn icon @click="openOptionsPage" slot="activator">
          <v-icon>settings</v-icon>
        </v-btn>
        <span>設定</span>
      </v-tooltip>
      <v-menu bottom left>
        <v-btn slot="activator" icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile
            v-for="item in menuItems"
            :key="item.title"
            :disabled="item.disabled"
            @click="item.action"
            target="_blank"
          >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <v-layout row wrap>
          <v-subheader>宿舍上傳流量</v-subheader>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <span class="my-2" slot="activator">
              <code>{{ dormNetflow.enabled ? dormNetflow.ip || '未設定' : '未開啟宿網流量顯示功能'}}</code>
            </span>
            <span>{{ dormNetflow.enabled ? '目前追蹤宿網 IP 位址' || '需至設定頁面設定目標 IP 位址' : '需至設定頁面開啟宿網流量顯示功能'}}</span>
          </v-tooltip>
          <v-flex xs9>
            <v-progress-linear
              v-model="totalDormExternalUploadRatio"
              :color="totalDormExternalUploadRatio > 100 ? 'error' : undefined"
            ></v-progress-linear>
          </v-flex>
          <v-flex xs3 fill-height class="text-xs-center">
            <span class="body-1">
              <span :class="totalDormExternalUploadRatio > 100 ? 'error--text' : ''">
                {{ totalDormExternalUpload }}
              </span>
              / 3 GB
            </span>
          </v-flex>
          <v-flex xs12>
            <apexcharts
              type="bar"
              :options="chartOptions"
              :series="series"
            ></apexcharts>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'

export default {
  components: {
    apexcharts: VueApexCharts
  },
  data () {
    return {
      darkTheme: 'dark',
      menuItems: {
        gpa: {
          title: '計算 GPA',
          action () { open('https://portal.ncu.edu.tw/system/162') },
          icon: 'pages',
          disabled: false
        },
        rateReview: {
          title: '評分擴充程式',
          action () { open('https://chrome.google.com/webstore/detail/ncu-helper/khhogbhcofdjjccjhgganhkhokibnfnb') },
          icon: 'rate_review',
          disabled: false
        },
        bugReport: {
          title: '錯誤回報',
          action () { open('https://github.com/GLaDOS1105/ncu-helper/issues') },
          icon: 'bug_report',
          disabled: false
        }
      },
      dormNetflow: {
        enabled: false,
        ip: undefined,
        data: []
      },
      noDataPlaceholder: {
        data: [],
        timer: undefined,
        counter: 0,
        sampleNum: 25
      }
    }
  },
  computed: {
    totalDormExternalUpload () {
      if (!this.dormNetflow.enabled) {
        return (this.noDataPlaceholder.data.reduce(
          (a, b) => a + b,
          0
        ) / this.noDataPlaceholder.sampleNum).toFixed(2)
      }
      return (this.dormNetflow.data.reduce(
        (prev, cur) => prev + cur.externalUpload,
        0
      ) / 1024 / 1024 / 1024).toFixed(2)
    },
    totalDormExternalUploadRatio () {
      return this.totalDormExternalUpload / 3 * 100
    },
    series () {
      if (!this.dormNetflow.enabled) {
        return [{ name: '', data: this.noDataPlaceholder.data }]
      }
      return [{
        name: '校外上傳',
        data: this.dormNetflow.data.map(d => ({ x: d.time, y: d.externalUpload }))
      }, {
        name: '校內上傳',
        data: this.dormNetflow.data.map(d => ({ x: d.time, y: d.totalUpload - d.externalUpload }))
      }]
    },
    chartOptions () {
      return {
        chart: {
          stacked: true,
          zoom: { enabled: false },
          animations: { easing: 'linear' },
          toolbar: { show: false }
        },
        grid: { padding: { top: -20 } },
        xaxis: {
          type: this.dormNetflow.enabled ? 'datetime' : 'numeric',
          labels: {
            show: this.dormNetflow.enabled && this.dormNetflow.data.length,
            style: { colors: (this.darkTheme ? '#F3F3F3' : undefined) }
          }
        },
        yaxis: {
          labels: {
            show: this.dormNetflow.enabled,
            formatter: value => (value / 1024 / 1024).toFixed(2) + 'MB',
            style: { color: (this.darkTheme ? '#F3F3F3' : undefined) }
          }
        },
        legend: { labels: { color: (this.darkTheme ? '#F3F3F3' : undefined) } },
        dataLabels: { enabled: false },
        tooltip: {
          enabled: this.dormNetflow.enabled,
          x: { format: 'MMM dd HH:mm' },
          theme: this.darkTheme ? 'dark' : 'light'
        },
        colors: ['#FBC02D', '#F57F17'],
        states: {
          hover: { filter: { type: this.dormNetflow.enabled ? 'lighten' : 'none' } },
          active: { filter: { type: this.dormNetflow.enabled ? 'lighten' : 'none' } }
        }
      }
    }
  },
  methods: {
    initialize () {
      chrome.storage.sync.get(
        ['popupDarkTheme', 'gpaCalculator', 'dormNetflow'],
        results => {
          this.darkTheme = results.popupDarkTheme
          this.menuItems.gpa.disabled = !results.gpaCalculator
          this.dormNetflow = Object.assign(this.dormNetflow, results.dormNetflow)
          if (!this.dormNetflow.enabled) {
            this.changeNoDataPlaceholder()
            this.noDataPlaceholder.timer = setInterval(this.changeNoDataPlaceholder, 350)
          }
        }
      )
    },
    readDormNetflowData () {
      chrome.storage.local.get('dormNetflowData', results => {
        this.dormNetflow.data = results.dormNetflowData
      })
    },
    changeNoDataPlaceholder () {
      const data = []
      for (let i = 0; i < this.noDataPlaceholder.sampleNum; i++) {
        data.push(
          Math.sin(
            (this.noDataPlaceholder.counter + i) * 2.7 * Math.PI / this.noDataPlaceholder.sampleNum
          ) + 1
        )
      }
      this.noDataPlaceholder.counter++
      this.noDataPlaceholder.data = data
    },
    openOptionsPage () {
      chrome.runtime.openOptionsPage()
    }
  },
  created () {
    this.initialize()
    this.readDormNetflowData()
  },
  beforeDestroy () {
    clearInterval(this.noDataPlaceholder.timer)
  }
}
</script>

<style>
html {
  width: 400px;
  min-height: 250px;
}
body {
  font-size: initial;
}
.logo {
  max-width: 70%;
  max-height: 70%;
}
</style>
