const SWITCH_NAMES = [
    'portal',
    'lms',
    'score-inquiries',
    'gpa',
    'graduate',
    'dorm-netflow',
];
/**
 * Update the settings.
 * @param {str} switchName The name of the material switch.
 */
function updateSettings(switchName) {
    let checkbox = document.getElementById(switchName).firstElementChild;
    chrome.storage.sync.set({[switchName]: checkbox.checked});
}

chrome.storage.sync.get(null, (result) => {
    for (let switchName of SWITCH_NAMES) {
        // Load settings.
        let toggle = document.getElementById(switchName);
        let checkbox = toggle.firstElementChild;
        checkbox.checked = result[switchName];
        toggle.MaterialSwitch.checkToggleState();

        // Add update to event listener.
        toggle.addEventListener(
            'click', () => updateSettings(switchName));
    }
    syncDormNetflowTextFieldStatus();
});

/* bind the switch of netflow detection to the text field input. */
let dormNetflowToggle = document.getElementById('dorm-netflow');
let dormNetflowTextField = document.getElementById('dorm-netflow-ipaddress');

/**
 * Sync dorm netflow text field status with its toggle.
 */
function syncDormNetflowTextFieldStatus() {
    let dormNetflowCheckbox = dormNetflowToggle.firstElementChild;
    dormNetflowTextField.disabled = !dormNetflowCheckbox.checked;
    console.log(dormNetflowCheckbox.checked);
}

dormNetflowToggle.addEventListener('click', syncDormNetflowTextFieldStatus);
