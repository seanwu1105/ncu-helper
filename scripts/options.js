// remove this list. load this from bgpage.
const SWITCH_NAMES = [
  'portal',
  'lms',
  'score-inquiries',
  'gpa',
  'graduate',
  'dorm-netflow'
]
/**
 * Update the settings.
 * @param {string} switchName The name of the material switch.
 */
function updateSettings (switchName) {
  let checkbox = document.getElementById(switchName).querySelector('input[type="checkbox"]')
  chrome.storage.sync.set({ [switchName]: checkbox.checked })
}

chrome.storage.sync.get(result => {
  if (!result.dormIpAddress) chrome.storage.sync.set({ 'dorm-netflow': false })
  syncToggles()
})

/**
 * Sync toggle status.
 */
function syncToggles () {
  chrome.storage.sync.get(result => {
    for (let switchName of SWITCH_NAMES) {
      // Load settings.
      let toggle = document.getElementById(switchName)
      let checkbox = toggle.querySelector('input[type="checkbox"]')
      checkbox.checked = result[switchName]
      toggle.MaterialSwitch.checkToggleState()

      // Add update to event listener.
      toggle.addEventListener('click', () => updateSettings(switchName))
    }
    syncDormNetflowBtnStatus()
    updateCurrentNetflowIp()
  })
}

/* bind the switch of netflow detection to the set-ip-address button. */
let dormNetflowToggle = document.getElementById('dorm-netflow')
let dormNetflowCheckbox = dormNetflowToggle.querySelector(
  '#dorm-netflow-checkbox')
let dormNetflowSetBtn = document.getElementById('dorm-netflow-btn')
let dormNetflowDialog = document.getElementById('dorm-netflow-dialog')

/**
 * Sync dorm netflow set-ip-address button status with its toggle.
 */
function syncDormNetflowBtnStatus () {
  dormNetflowSetBtn.disabled = !dormNetflowCheckbox.checked
}

/**
 * Update the current monitoring IP address.
 */
function updateCurrentNetflowIp () {
  let currentIpAddressDisplay = document.getElementById('currentIpAddress')
  chrome.storage.sync.get('dormIpAddress', (result) => {
    if (!dormNetflowCheckbox.checked) {
      currentIpAddressDisplay.innerHTML = 'undefined'
    } else {
      currentIpAddressDisplay.innerHTML = result.dormIpAddress
      chrome.runtime.sendMessage(
        {
          name: 'updateDormNetflowIp',
          dormNetflowIp: result.dormIpAddress
        },
        (response) => {
          if (!response) console.log('e: cannot update ip settings')
        }
      )
    }
  })
}

// set the dialog open button events
dormNetflowToggle.addEventListener('click', () => {
  syncDormNetflowBtnStatus()
  updateCurrentNetflowIp()
})
dormNetflowSetBtn.addEventListener(
  'click', () => dormNetflowDialog.showModal())

// set the dialog close button events
let allDialogBtns = dormNetflowDialog.querySelectorAll('button')
let ipAddressTextField = dormNetflowDialog.querySelector(
  'input#dorm-netflow-ipaddress')
let confirmDialogBtn = dormNetflowDialog.querySelector('button#confirm')
let cancelDialogBtn = dormNetflowDialog.querySelector('button#cancel')
confirmDialogBtn.disabled = !ipAddressTextField.checkValidity()

confirmDialogBtn.addEventListener('click', () => {
  chrome.storage.sync.set({ dormIpAddress: ipAddressTextField.value })
  updateCurrentNetflowIp()
})
ipAddressTextField.addEventListener('input', () => {
  confirmDialogBtn.disabled = !ipAddressTextField.checkValidity()
})
cancelDialogBtn.addEventListener('click', () => {
  chrome.storage.sync.get('dormIpAddress', (result) => {
    dormNetflowCheckbox.checked = Boolean(result.dormIpAddress)
    dormNetflowToggle.MaterialSwitch.checkToggleState()
    updateSettings('dorm-netflow')
    syncDormNetflowBtnStatus()
  })
})
Array.from(allDialogBtns).forEach((btn) => {
  btn.addEventListener('click', () => dormNetflowDialog.close())
})
