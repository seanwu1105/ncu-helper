const SWITCH_NAMES = ['portal', 'lms', 'score-inquiries', 'graduate'];
/**
 * Update the settings.
 */
function updateSettings() {
    for (switchName of SWITCH_NAMES) {
        let checkbox = document.getElementById(switchName).firstElementChild;
        chrome.storage.sync.set({[switchName]: checkbox.checked});
    }
}

chrome.storage.sync.get(null, (result) => {
    for (switchName of SWITCH_NAMES) {
        // Load settings.
        let toggle = document.getElementById(switchName);
        let checkbox = toggle.firstElementChild;
        checkbox.checked = result[switchName];
        toggle.MaterialSwitch.checkToggleState();

        // Add update to event listener.
        toggle.addEventListener('click', updateSettings);
    }
});

