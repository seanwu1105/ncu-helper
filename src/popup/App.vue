<template>
  <v-app :dark="dark">
    <v-toolbar app dense>
      <img src="@/assets/logo.png" alt="NCU Helper" class="logo ma-1">
      <v-toolbar-title>NCU Helper</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom left>
        <v-btn slot="activator" icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile
          v-for="(item, index) in menuItems"
          :key="index"
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
          <span class="my-2"><code>{{ dormIpAddress || '未設定' }}</code></span>
        </v-layout>
        <v-layout row wrap align-center>
          <v-flex xs9>
            <v-progress-linear
              v-model="totalDormExternalUploadUsageRatio"
              :indeterminate="!dormNetflowUsageEnabled"
              :color="totalDormExternalUploadUsageRatio > 100 ? 'error' : undefined"
            ></v-progress-linear>
          </v-flex>
          <v-flex xs3 fill-height class="text-xs-center">
            <span class="body-1">
              <span :class="totalDormExternalUploadUsageRatio > 100 ? 'error--text' : ''">
              {{ totalDormExternalUploadUsage }}
              </span>
              / 3 GB
            </span>
          </v-flex>
        </v-layout>
        <apexcharts
          type="bar"
          :options="chartOptions"
          :series="series"
        ></apexcharts>
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
      theme: 'dark',
      menuItems: [{
        title: '計算 GPA',
        action: () => { open('https://portal.ncu.edu.tw/system/162') },
        icon: 'pages'
      }, {
        title: '設定',
        action: () => { chrome.runtime.openOptionsPage() },
        icon: 'settings'
      }, {
        title: '評分擴充程式',
        action: () => { open('https://chrome.google.com/webstore/detail/ncu-helper/khhogbhcofdjjccjhgganhkhokibnfnb') },
        icon: 'rate_review'
      }, {
        title: '錯誤回報',
        action: () => { open('https://github.com/GLaDOS1105/ncu-helper/issues') },
        icon: 'bug_report'
      }],
      dormNetflowUsageEnabled: true,
      dormIpAddress: '',
      dormNetflowUsageSet: [],
      noDataPlacehold: []
    }
  },
  computed: {
    dark () { return (this.theme === 'dark') },
    totalDormExternalUploadUsage () {
      if (!this.dormNetflowUsageEnabled || !this.dormNetflowUsageSet) return '??'
      return (this.dormNetflowUsageSet.reduce((prev, cur) => {
        return prev + cur.externalUpload
      }, 0) / 1024 / 1024 / 1024).toFixed(2)
    },
    totalDormExternalUploadUsageRatio () {
      return this.totalDormExternalUploadUsage / 3 * 100
    },
    series () {
      if (!this.dormNetflowUsageEnabled || !this.dormNetflowUsageSet) {
        return [{ name: '', data: this.noDataPlacehold }]
      }
      return [{
        name: '校外上傳',
        data: this.dormNetflowUsageSet.map(d => ({ x: d.time, y: d.externalUpload }))
      }, {
        name: '校內上傳',
        data: this.dormNetflowUsageSet.map(d => ({ x: d.time, y: d.totalUpload - d.externalUpload }))
      }]
    },
    chartOptions () {
      return {
        chart: {
          stacked: true,
          zoom: { enabled: false }
        },
        grid: { padding: { top: -20 } },
        xaxis: {
          type: this.dormNetflowUsageEnabled ? 'datetime' : 'numeric',
          labels: {
            show: this.dormNetflowUsageEnabled,
            style: { colors: (this.theme === 'dark' ? '#F3F3F3' : undefined) }
          }
        },
        yaxis: {
          labels: {
            show: this.dormNetflowUsageEnabled,
            formatter: value => (value / 1024 / 1024).toFixed(2) + 'MB',
            style: { color: (this.theme === 'dark' ? '#F3F3F3' : undefined) }
          }
        },
        legend: { labels: { color: (this.theme === 'dark' ? '#F3F3F3' : undefined) } },
        dataLabels: { enabled: false },
        tooltip: {
          enabled: this.dormNetflowUsageEnabled,
          shared: true,
          x: { format: 'MMM dd HH:mm' },
          theme: this.theme
        },
        colors: ['#FBC02D', '#F57F17'],
        states: {
          hover: { filter: { type: this.dormNetflowUsageEnabled ? 'lighten' : 'none' } },
          active: { filter: { type: this.dormNetflowUsageEnabled ? 'lighten' : 'none' } }
        }
      }
    }
  },
  methods: {
    initialize () {
      chrome.storage.sync.get(results => {
        this.theme = results.theme
        this.dormIpAddress = results.dormIpAddress
        this.dormNetflowUsageEnabled = results['dorm-netflow']
        if (!this.dormNetflowUsageEnabled) this.displayNoData()
      })
    },
    updateDormNetflowUsageSet () {
      chrome.storage.local.get('dormNetflowUsageSet', results => {
        this.dormNetflowUsageSet = results.dormNetflowUsageSet
      })
    },
    displayNoData () {
      this.noDataPlacehold = [1, 2, 3, 4]
    }
  },
  created () {
    this.initialize()
    this.updateDormNetflowUsageSet()
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
