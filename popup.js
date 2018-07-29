const SWITCH_NAMES = ['lms'];
/**
 * Update the settings.
 */
function updateSettings() {
    for (switchName of SWITCH_NAMES) {
        let toggle = document.getElementById(switchName);
        let checkbox = toggle.firstElementChild;
        chrome.storage.sync.set({[switchName]: checkbox.checked});
    }
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.reload(tabs[0].id);
    });
}

for (switchName of SWITCH_NAMES) {
    // Load settings.
    let toggle = document.getElementById(switchName);
    let checkbox = toggle.firstElementChild;
    chrome.storage.sync.get(switchName, function(result) {
        checkbox.checked = result.lms;
        toggle.MaterialSwitch.checkToggleState();
    });
    // Add update to event listener.
    toggle.addEventListener('click', updateSettings);
}
