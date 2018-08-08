const DORM_NETFLOW_LIMIT = 3 * 1024 * 1024 * 1024;

// Add settings.html href to link.
document.getElementById('settings-link').setAttribute(
    'href', chrome.extension.getURL('html/settings.html'));

// create possible elements in #netflow-plot div
let plot = document.getElementById('netflow-plot');
let netflowPanel = plot.querySelector('div[style="display: none"]');
let usageBar = plot.querySelector('div.mdl-progress');
let usageDigit = plot.querySelector('p#netflow-usage-digit > span');
let netflowIframe = plot.querySelector('iframe.netflow');
let noDormNetflowSetInfo = plot.querySelector('p#no-info');

/* Check whether the switch of dorm netflow monitoring is on. */

chrome.storage.sync.get('dorm-netflow', (result) => {
    if (result['dorm-netflow']) {
        netflowPanel.style.display = 'block';
        componentHandler.upgradeDom();
        requestDormNetflowUsage();
    } else noDormNetflowSetInfo.style.display = 'block';
});

/**
 * Get the dorm netflow info from background.js
 */
function requestDormNetflowUsage() {
    chrome.runtime.sendMessage(
        {name: 'dormNetflowUsage'},
        (response) => {
            console.log('get response of dormNetflowUsage', response);
            if (response.length === 0) { // failed to get the netflow data
                setTimeout(requestDormNetflowUsage, 1000); // resend request
            } else {
                netflowIframe.src = '../html/netflow.html';
                usageBar.classList.remove('mdl-progress--indeterminate');
                // Calculate the total usage (in Bytes).
                let totalUsage = response.reduce((prev, cur) => {
                    return prev + cur.externalUpload;
                }, 0);
                // Update the usage digit display.
                usageDigit.innerHTML = Number.parseFloat(
                    totalUsage / Math.pow(1024, 3)).toFixed(2) + '/3.00';
                // Calculate the total usage ratio and update the progress bar.
                usageBar.MaterialProgress.setProgress(
                    Math.min(totalUsage / DORM_NETFLOW_LIMIT, 1) * 100
                );
                // Wait until the netflow iframe has fully loaded; then post
                // the response as message to netflow.html (as iframe).
                netflowIframe.addEventListener('load', () => {
                    netflowIframe.contentWindow.postMessage(
                        {
                            command: 'render',
                            context: response,
                        },
                        '*'
                    );
                });
            }
        }
    );
}
