<template>
  <v-app style="background: initial">
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12>
          <v-list subheader three-line>
            <v-subheader>深色外觀</v-subheader>
            <switch-option
              v-for="option in skinOptions"
              :key="option.storageKey"
              :title="option.title"
              :storage-key="option.storageKey"
            >
              {{ option.subtitle }}此效果會套用至<code>{{ option.match }}</code>等網頁。
            </switch-option>
          </v-list>

          <v-list subheader three-line>
            <v-subheader>功能設定</v-subheader>
            <switch-option
              title="GPA 計算工具"
              storage-key="gpaCalculator"
            >
              於國立中央大學教務系統啟用 GPA 計算工具。所有計算皆在本地端運行，不會上傳任何個人資料。計算後成績僅供參考。
            </switch-option>
            <v-dialog full-width persistent v-model="dormNetflow.dialog">
              <v-list-tile slot="activator" @click=";" ripple>
                <v-list-tile-content>
                  <v-list-tile-title>宿網流量監控</v-list-tile-title>
                  <v-list-tile-sub-title>
                    設定剩餘宿舍網路上傳流量顯示器。目前設定：<code>{{ dormNetflow.enabled ? dormNetflow.ip : '未啟用' }}</code>。
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-card>
                <v-card-title primary-title class="headline primary">
                  宿網上傳顯示設定
                </v-card-title>
                <v-card-text>
                  <v-switch
                    :label="dormNetflow.enabled ? '啟用' : '未啟用'"
                    v-model="dormNetflow.enabled"
                  ></v-switch>
                  啟用宿網流量監控工具。監控宿網流量並顯示剩餘上傳流量在彈跳視窗（popup），以方便使用者得知會不會超量使用（24 小時內上傳流量超過 3GB）導致計算機中心鎖卡。設定新 IP 位址後，需要等待至多 5 分鐘取得流量資訊。流量資訊僅供參考，實際資訊請至<a href="http://uncia.cc.ncu.edu.tw/dormnet/index.php?section=netflow">中央大學學生宿舍網路系統查詢</a>。
                  <v-divider class="my-4"></v-divider>
                  <v-form v-model="dormNetflow.valid">
                    <v-layout row>
                      <v-flex xs10>
                        <v-text-field
                          v-model="dormNetflow.ip"
                          :disabled="!dormNetflow.enabled"
                          label="輸入目標 IP 位址"
                          placeholder="中央大學宿舍網路 IP 位址"
                          hint="For example, 140.115.202.163"
                          :rules="[dormNetflow.rule]"
                          box
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs2>
                        <v-btn
                          flat
                          color="secondary"
                          class="mx-2"
                          :disabled="dormNetflow.enabled && !dormNetflow.valid"
                          @click.native="saveDormNetflow"
                        >確定</v-btn>
                      </v-flex>
                    </v-layout>
                  </v-form>
                </v-card-text>
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
import SwitchOption from '../components/SwitchOption'

export default {
  components: {
    SwitchOption
  },
  data () {
    return {
      skinOptions: [{
        title: '彈跳視窗（popup）深色外觀',
        subtitle: '對 NCU Helper 的彈跳視窗套用深色外觀。',
        match: 'popup/popup.html',
        storageKey: 'popupDarkTheme'
      }, {
        title: 'Portal 深色外觀',
        subtitle: '對 NCU Portal 入口網站部份網頁套用深色外觀。',
        match: 'https://portal.ncu.edu.tw/',
        storageKey: 'portalSkin'
      }, {
        title: 'LMS 深色外觀',
        subtitle: '對 NCN Learning Management System 網頁套用深色外觀。',
        match: 'https://lms.ncu.edu.tw/*',
        storageKey: 'lmsSkin'
      }, {
        title: '成績查詢系統深色外觀',
        subtitle: '對國立中央大學教務系統套用深色外觀。',
        match: 'https://cis.ncu.edu.tw/ScoreInquiries/*',
        storageKey: 'scoreInquiriesSkin'
      }, {
        title: '畢審系統深色外觀',
        subtitle: '對中大畢審系統查詢網頁套用深色外觀。',
        match: 'https://cis.ncu.edu.tw/grad/index.php*',
        storageKey: 'graduateSkin'
      }],
      dormNetflow: {
        dialog: false,
        enabled: false,
        ip: undefined,
        valid: true,
        rule (value) {
          const pattern = /^140\.115\.(0|1([0-9][0-9]?)?|2([5-9]|[0-4][0-9]?|5[0-5]?)?|[3-9][0-9]?)\.(0|1([0-9][0-9]?)?|2([5-9]|[0-4][0-9]?|5[0-5]?)?|[3-9][0-9]?)$/
          return pattern.test(value) || '格式錯誤。IP 格式須為 "140.115.X.X"，X 介於 0 至 255。'
        }
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
  },
  methods: {
    saveDormNetflow () {
      chrome.runtime.sendMessage({
        name: 'updateDormNetflow',
        enabled: this.dormNetflow.enabled,
        ip: this.dormNetflow.ip
      })
      chrome.storage.sync.set({
        dormNetflow: {
          enabled: this.dormNetflow.enabled,
          ip: this.dormNetflow.ip
        }
      })
      this.dormNetflow.dialog = false
    }
  },
  created () {
    chrome.storage.sync.get(results => {
      this.dormNetflow = Object.assign(this.dormNetflow, results.dormNetflow)
    })
  }
}
</script>

<style>
html {
  min-width: 650px;
  overflow: auto;
}
body {
  font-size: initial;
}
</style>
