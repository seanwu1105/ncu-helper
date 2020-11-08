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
        <v-alert :value="true" type="error">
            因為本人已從中央大學畢業，無法使用 Portal 多項功能，更新不便， 將停止更新，若有任何熱心人士想要接手專案請<a href="mailto:seanwu1105@gmail.com" target="_blank">聯繫我</a>，謝謝。
        </v-alert>
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
              <span
                :class="totalDormExternalUploadRatio > 100 ? 'error--text' : ''"
              >{{ totalDormExternalUpload }}</span>
              / 3 GB
            </span>
          </v-flex>
          <v-flex v-if="dormNetflow.enabled" xs12>
            <apexcharts
              type="area"
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
          action () {
            open('https://portal.ncu.edu.tw/system/162')
          },
          icon: 'pages',
          disabled: false
        },
        rateReview: {
          title: '評分擴充程式',
          action () {
            open(
              'https://chrome.google.com/webstore/detail/ncu-helper/khhogbhcofdjjccjhgganhkhokibnfnb'
            )
          },
          icon: 'rate_review',
          disabled: false
        },
        bugReport: {
          title: '錯誤回報',
          action () {
            open('https://github.com/seanwu1105/ncu-helper/issues')
          },
          icon: 'bug_report',
          disabled: false
        }
      },
      dormNetflow: {
        enabled: false,
        ip: undefined,
        data: []
      }
    }
  },
  computed: {
    totalDormExternalUpload () {
      if (!this.dormNetflow.enabled) {
        return 0
      }
      return (
        this.dormNetflow.data.reduce(
          (prev, cur) => prev + cur.externalUpload,
          0
        ) / 1024 / 1024 / 1024
      ).toFixed(2)
    },
    totalDormExternalUploadRatio () {
      return (this.totalDormExternalUpload / 3) * 100
    },
    series () {
      return [{
        name: '校外上傳',
        data: this.dormNetflow.data.map(d => ({
          x: d.time,
          y: d.externalUpload
        }))
      }, {
        name: '校內上傳',
        data: this.dormNetflow.data.map(d => ({
          x: d.time,
          y: d.totalUpload - d.externalUpload
        }))
      }]
    },
    chartOptions () {
      return {
        theme: {
          mode: this.darkTheme ? 'dark' : 'light'
        },
        chart: {
          zoom: { enabled: false },
          animations: { easing: 'linear' },
          toolbar: { show: false }
        },
        stroke: { width: 1 },
        grid: { padding: { top: -20 } },
        xaxis: {
          type: 'datetime',
          labels: {
            show: this.dormNetflow.data.length
          }
        },
        yaxis: {
          labels: {
            formatter: value => (value / 1024 / 1024).toFixed(2) + 'MB'
          },
          min: 0
        },
        dataLabels: { enabled: false },
        tooltip: {
          x: { format: 'MMM dd HH:mm' }
        },
        colors: ['#FBC02D', '#F57F17']
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
          this.dormNetflow = Object.assign(
            this.dormNetflow,
            results.dormNetflow
          )
        }
      )
    },
    readDormNetflowData () {
      chrome.storage.local.get('dormNetflowData', results => {
        this.dormNetflow.data = results.dormNetflowData
      })
    },
    openOptionsPage () {
      chrome.runtime.openOptionsPage()
    }
  },
  created () {
    this.initialize()
    this.readDormNetflowData()
  }
}
</script>

<style>
html {
  width: 400px;
}
body {
  font-size: initial;
}
.logo {
  max-width: 70%;
  max-height: 70%;
}
.apexcharts-canvas.dark {
  background: transparent !important;
}
</style>
