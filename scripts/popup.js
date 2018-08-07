// Add settings.html href to link.
document.getElementById('settings-link').setAttribute(
    'href', chrome.extension.getURL('html/settings.html'));

// create possible elements in #netflow-plot div
let plot = document.getElementById('netflow-plot');
let loading = document.createElement('div');
loading.setAttribute(
    'class', 'mdl-progress mdl-js-progress mdl-progress--indeterminate');
let netflowIframe = document.createElement('iframe');
netflowIframe.setAttribute('src', '../html/netflow.html');
netflowIframe.setAttribute('class', 'netflow');
let noDormNetflowSetInfo = document.createTextNode('尚未開啟宿網流量監控');

/* Check whether the switch of dorm netflow monitoring is on. */

chrome.storage.sync.get('dorm-netflow', (result) => {
    if (result['dorm-netflow']) requestDormNetflowUsage();
    else plot.appendChild(noDormNetflowSetInfo);
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
                if (!plot.firstElementChild) {
                    plot.appendChild(loading);
                    componentHandler.upgradeDom();
                }
                setTimeout(requestDormNetflowUsage, 1000); // resend request
            } else {
                $(loading).remove();
                if (!plot.firstElementChild) plot.appendChild(netflowIframe);
                // Wait until the netflow iframe has fully loaded; then post
                // the response as message.
                netflowIframe.addEventListener('load', () =>
                    netflowIframe.contentWindow.postMessage(
                        {
                            command: 'render',
                            context: response,
                        },
                        '*'
                    ));
            }
        }
    );
}
