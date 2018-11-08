import moment from 'moment'

const defaultOptions = {
  'portal': true,
  'lms': true,
  'score-inquiries': true,
  'gpa': true,
  'graduate': true,
  'dorm-netflow': false,
  'dormIpAddress': '140.115.202.163' // XXX: testing
}

// Set default settings.
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(results => {
    for (let [key, value] of Object.entries(defaultOptions)) {
      if (results[key] === undefined) chrome.storage.sync.set({ [key]: value })
    }
  })
})

/* Dorm Netflow */
let dormIpAddress
let dormNetflowUsageSet = [] // This will be requested by popup.

// Initialize the update alarms.
chrome.storage.sync.get('dormIpAddress', result => {
  dormIpAddress = result.dormIpAddress
  updateDormNetflowUsage()
  chrome.alarms.create('updateDormNetflow', { periodInMinutes: 3 })
  chrome.alarms.onAlarm.addListener(_alarm => { updateDormNetflowUsage() })
})

// Initialize message listeners.
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.name === 'getDormNetflowUsage') sendResponse(dormNetflowUsageSet)
  if (message.name === 'updateDormIpAddress') {
    dormIpAddress = message.dormIpAddress
    updateDormNetflowUsage()
    sendResponse(true)
  }
})

/**
 * Send post request to `uncia.cc.ncu.edu.tw/dormnet` and get the 24 hrs dorm
 * net flow usage statistics. And save the result in netflowUsage.
 * @param {string} ipAddress The target ip address.
 */
function updateDormNetflowUsage () {
  if (dormIpAddress) {
    const ret = []
    const url = 'https://uncia.cc.ncu.edu.tw/dormnet/index.php'
    const xhr = new XMLHttpRequest()
    xhr.addEventListener('load', function () {
      if (this.status === 200) {
        console.log('Dorm netflow info updated.')
        const table = this.responseXML.querySelector('table[border="1"][cellspacing="0"][cellpadding="5"]')
        table.querySelectorAll('tr[bgcolor="#ffffee"], tr[bgcolor="#eeeeee"]').forEach(tr => {
          const data = []
          tr.querySelectorAll('td').forEach((td, idx) => { data[idx] = td.innerText })
          ret.push({
            time: moment(data[0]),
            externalUpload: Number(data[1]),
            externalDownload: Number(data[2]),
            totalUpload: Number(data[3]),
            totalDownload: Number(data[4])
          })
        })
        ret.reverse()
        dormNetflowUsageSet = ret
      }
    })
    xhr.open('post', url, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.responseType = 'document'
    xhr.send(`section=netflow&ip=${dormIpAddress}`)
  }
}
