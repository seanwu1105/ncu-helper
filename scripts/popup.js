// Add settings.html href to link.
document.getElementById('settings-link').setAttribute(
    'href', chrome.extension.getURL('settings.html'));

// Get the dorm netflow info from background.js
chrome.runtime.sendMessage(
    {name: 'dormNetflowUsage'},
    (response) => console.log(response)
);
