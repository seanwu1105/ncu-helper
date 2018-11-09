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
        <v-layout row>
          <v-subheader>宿舍上傳流量</v-subheader>
          <v-spacer></v-spacer>
          <span class="my-2"><code>{{ dormIpAddress }}</code></span>
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
      dark: false,
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
      dormIpAddress: '',
      dormNetflowUsageSet: [],
      chartOptions: {
        chart: { stacked: true, zoom: { enabled: false } },
        xaxis: { type: 'datetime' },
        yaxis: { labels: { formatter: value => (value / 1024 / 1024).toFixed(2) + 'MB' } },
        dataLabels: { enabled: false },
        tooltip: { shared: true, x: { format: 'MMM dd HH:mm' } }
      }
    }
  },
  computed: {
    series () {
      if (!this.dormNetflowUsageSet) return [{ name: '', data: [] }]
      return [{
        name: '校外上傳',
        data: this.dormNetflowUsageSet.map(d => ({ x: d.time, y: d.externalUpload }))
      }, {
        name: '校內上傳',
        data: this.dormNetflowUsageSet.map(d => ({ x: d.time, y: d.totalUpload - d.externalUpload }))
      }]
    }
  },
  methods: {
    updateTheme () {
      chrome.storage.sync.get('theme', results => {
        this.dark = (results.theme === 'dark')
      })
    },
    updateDormIpAddress () {
      chrome.storage.sync.get('dormIpAddress', results => {
        this.dormIpAddress = results.dormIpAddress
      })
    },
    updateDormNetflowUsageSet () {
      chrome.storage.local.get('dormNetflowUsageSet', results => {
        this.dormNetflowUsageSet = results.dormNetflowUsageSet
      })
    }
  },
  created () {
    this.updateTheme()
    this.updateDormIpAddress()
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
