<template>
  <v-app style="background: initial">
    <v-container fluid>
      <v-layout></v-layout>
    </v-container>
    <v-footer app color="primary" height="auto">
      <v-layout justify-center row wrap>
        <v-tooltip
          top
          v-for="link in footerLinks"
          :key="link.tooltip"
        >
          <v-btn icon slot="activator" @click="link.action">
            <v-icon color="white">{{ link.icon }}</v-icon>
          </v-btn>
          <span>{{ link.tooltip }}</span>
        </v-tooltip>
        <v-flex xs12 class="secondary lighten-1 py-1 text-xs-center white--text" >
          &copy;2018 - <strong>NCU Helper</strong>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      footerLinks: [{
        action () { open('https://chrome.google.com/webstore/detail/ncu-helper/khhogbhcofdjjccjhgganhkhokibnfnb') },
        icon: 'rate_review',
        tooltip: '評分擴充程式'
      }, {
        action () { open('mailto:seanwu1105@gmail.com') },
        icon: 'email',
        tooltip: '開發者信箱'
      }, {
        action () { open('https://github.com/GLaDOS1105/ncu-helper/issues') },
        icon: 'bug_report',
        tooltip: '錯誤回報'
      }, {
        action () { open('https://github.com/GLaDOS1105/ncu-helper') },
        icon: 'code',
        tooltip: 'GitHub'
      }]
    }
  }
}
</script>

<style>
html {
  min-width: 600px;
  min-height: 100px;
  overflow: auto;
}
body {
  font-size: initial;
}
</style>
