import moment from 'moment'

const defaultOptions = {
  popupDarkTheme: true,
  portalSkin: true,
  lmsSkin: true,
  scoreInquiriesSkin: true,
  graduateSkin: true,
  gpaCalculator: true,
  dormNetflow: {
    enabled: false,
    ip: undefined
  }
}

// Set default settings when installation, extension or chrome update.
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(results => {
    for (let [key, value] of Object.entries(defaultOptions)) {
      if (results[key] === undefined) chrome.storage.sync.set({ [key]: value })
    }
  })
})

/* Dorm Netflow */

// Initialize the updating alarms.
chrome.storage.sync.get('dormNetflow', results => {
  writeDormNetflowData(results.dormNetflow)
  chrome.alarms.create('updateDormNetflow', { periodInMinutes: 3 })
  chrome.alarms.onAlarm.addListener(_alarm => {
    writeDormNetflowData(results.dormNetflow)
  })
})

// Initialize message listeners.
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.name === 'updateDormNetflow') {
    writeDormNetflowData(message)
  }
})

function writeDormNetflowData (dormNetflow) {
  if (dormNetflow && dormNetflow.enabled && dormNetflow.ip) {
    const ret = []
    const url = 'https://uncia.cc.ncu.edu.tw/dormnet/index.php'
    const xhr = new XMLHttpRequest()
    xhr.addEventListener('load', function () {
      if (this.status === 200) {
        const table = this.responseXML.querySelector('table[border="1"][cellspacing="0"][cellpadding="5"]')
        table.querySelectorAll('tr[bgcolor="#ffffee"], tr[bgcolor="#eeeeee"]').forEach(tr => {
          const data = []
          tr.querySelectorAll('td').forEach((td, idx) => { data[idx] = td.innerText })
          ret.push({
            time: moment(data[0]).toString(),
            externalUpload: data[1] * 1 || 0,
            externalDownload: data[2] * 1 || 0,
            totalUpload: data[3] * 1 || 0,
            totalDownload: data[4] * 1 || 0
          })
        })
        ret.reverse()
        chrome.storage.local.set({ dormNetflowData: ret }, () => {
          console.log('Dorm netflow info updated.', dormNetflow.ip)
        })
      }
    })
    xhr.open('post', url, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.responseType = 'document'
    xhr.send(`section=netflow&ip=${dormNetflow.ip}`)
  }
}
