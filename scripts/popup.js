// Add settings.html href to link.
document.getElementById('settings-link').setAttribute(
    'href', chrome.extension.getURL('html/settings.html'));

let plot = document.getElementById('netflow-plot');
let loading = document.createElement('div');
loading.setAttribute(
    'class', 'mdl-progress mdl-js-progress mdl-progress--indeterminate');
let netflowIframe = document.createElement('iframe');
netflowIframe.setAttribute('src', '../html/netflow.html');
netflowIframe.setAttribute('class', 'netflow');

/**
 * Get the dorm netflow info from background.js
 */
(function requestDormNetflowUsage() {
    chrome.runtime.sendMessage(
        {name: 'dormNetflowUsage'},
        (response) => {
            console.log('get response of dormNetflowUsage');
            if (response.length === 0) {
                if (!plot.firstElementChild) {
                    plot.appendChild(loading);
                    componentHandler.upgradeDom();
                }
                setTimeout(requestDormNetflowUsage, 1000);
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
})();
