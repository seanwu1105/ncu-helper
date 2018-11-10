<template>
  <v-app style="background: initial">
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12>
          <v-list subheader three-line>
            <v-subheader>深色外觀</v-subheader>
            <template v-for="option in skinOptions">
              <v-list-tile @click=";" :key="option.title">
                <v-list-tile-content @click.prevent="option.setting = !option.setting">
                  <v-list-tile-title>{{ option.title }}</v-list-tile-title>
                  <v-list-tile-sub-title>
                    {{ option.subtitle }}此效果會套用至<code>{{ option.match }}</code>等網頁。
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-switch v-model="option.setting"></v-switch>
                </v-list-tile-action>
              </v-list-tile>
            </template>
          </v-list>

          <v-list subheader three-line>
            <v-subheader>功能設定</v-subheader>
            <v-list-tile @click=";">
              <v-list-tile-content @click.prevent="gpaCalculatorEnabled = !gpaCalculatorEnabled">
                <v-list-tile-title>GPA 計算工具</v-list-tile-title>
                <v-list-tile-sub-title>
                  於國立中央大學教務系統啟用 GPA 計算工具。所有計算皆在本地端運行，不會上傳任何個人資料。計算後成績僅供參考。
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-switch v-model="gpaCalculatorEnabled"></v-switch>
              </v-list-tile-action>
            </v-list-tile>
            <v-dialog full-width v-model="dormNetflowUsage.dialog">
              <v-list-tile slot="activator" @click=";" ripple>
                <v-list-tile-content>
                  <v-list-tile-title>宿網流量監控</v-list-tile-title>
                  <v-list-tile-sub-title>
                    設定剩餘宿舍網路上傳流量顯示器。目前設定：<code>{{ dormNetflowUsage.enabled ? dormNetflowUsage.ipAddress : '未啟用' }}</code>。
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-card>
                <v-card-title primary-title class="headline primary">
                  宿網上傳顯示設定
                </v-card-title>
                <v-card-text>
                  <v-switch
                    :label="dormNetflowUsage.enabled ? '啟用' : '未啟用'"
                    v-model="dormNetflowUsage.enabled"
                  ></v-switch>
                  啟用宿網流量監控工具。監控宿網流量並顯示剩餘上傳流量在彈跳視窗（popup），以方便使用者得知會不會超量使用（24 小時內上傳流量超過 3GB）導致計算機中心鎖卡。設定新 IP 位址後，需要等待至多 5 分鐘取得流量資訊。流量資訊僅供參考，實際資訊請至<a href="http://uncia.cc.ncu.edu.tw/dormnet/index.php?section=netflow">中央大學學生宿舍網路系統查詢</a>。
                </v-card-text>
                <v-card-actions>
                  <v-text-field
                    label="目標 IP 位址"
                    placeholder="中央大學宿舍網路 IP 位址"
                    v-model="dormNetflowUsage.ipAddress"
                    :disabled="!dormNetflowUsage.enabled"
                  ></v-text-field>
                  <v-btn flat color="secondary" class="mx-2">確定</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
    <v-footer color="primary" height="auto">
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
      skinOptions: [{
        title: '彈跳視窗（popup）深色外觀',
        subtitle: '對 NCU Helper 的彈跳視窗套用深色外觀。',
        match: 'popup/popup.html',
        setting: true,
        key: 'theme'
      }, {
        title: 'Portal 深色外觀',
        subtitle: '對 NCU Portal 入口網站部份網頁套用深色外觀。',
        match: 'https://portal.ncu.edu.tw/',
        setting: true,
        key: 'portal'
      }, {
        title: 'LMS 深色外觀',
        subtitle: '對 NCN Learning Management System 網頁套用深色外觀。',
        match: 'https://lms.ncu.edu.tw/*',
        setting: true,
        key: 'lms'
      }, {
        title: '成績查詢系統深色外觀',
        subtitle: '對國立中央大學教務系統套用深色外觀。',
        match: 'https://cis.ncu.edu.tw/ScoreInquiries/*',
        setting: true,
        key: 'score-inquiries'
      }, {
        title: '畢審系統深色外觀',
        subtitle: '對中大畢審系統查詢網頁套用深色外觀。',
        match: 'https://cis.ncu.edu.tw/grad/index.php*',
        setting: true,
        key: 'graduate'
      }],
      gpaCalculatorEnabled: true,
      dormNetflowUsage: {
        dialog: false, // XXX: use this to detect use finish the setting (in order to set chrome.storage)
        enabled: false,
        ipAddress: ''
      },
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
  overflow: auto;
}
body {
  font-size: initial;
}
</style>
