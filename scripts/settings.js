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
    let checkbox = document.getElementById(
        switchName).querySelector('input[type="checkbox"]');
    chrome.storage.sync.set({[switchName]: checkbox.checked});
}

chrome.storage.sync.get(null, (result) => {
    for (let switchName of SWITCH_NAMES) {
        // Load settings.
        let toggle = document.getElementById(switchName);
        let checkbox = toggle.querySelector('input[type="checkbox"]');
        checkbox.checked = result[switchName];
        toggle.MaterialSwitch.checkToggleState();

        // Add update to event listener.
        toggle.addEventListener(
            'click', () => updateSettings(switchName));
    }
    syncDormNetflowTextFieldStatus();
});

/* bind the switch of netflow detection to the set-ip-address button. */
let dormNetflowToggle = document.getElementById('dorm-netflow');
let dormNetflowSetBtn = document.getElementById('dorm-netflow-btn');
let dormNetflowDialog = document.getElementById('dorm-netflow-dialog');

/**
 * Sync dorm netflow set-ip-address button status with its toggle.
 */
function syncDormNetflowTextFieldStatus() {
    let dormNetflowCheckbox = dormNetflowToggle.querySelector(
        '#dorm-netflow-checkbox');
    dormNetflowSetBtn.disabled = !dormNetflowCheckbox.checked;
}

dormNetflowToggle.addEventListener('click', syncDormNetflowTextFieldStatus);
dormNetflowSetBtn.addEventListener(
    'click', () => dormNetflowDialog.showModal());
let allDialogBtns = dormNetflowDialog.querySelectorAll('button');
Array.from(allDialogBtns).forEach((btn) => {
    btn.addEventListener('click', () => dormNetflowDialog.close());
});
