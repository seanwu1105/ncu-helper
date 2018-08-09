'use strict';

/**
 * Author: Sean Wu
 * NCU CSIE, Taiwan
 */

let dormNetflowTargetIp = undefined;

// Set default settings.
chrome.runtime.onInstalled.addListener((details) => {
    chrome.storage.sync.get(null, (result) => {
        if (result['portal'] === undefined) {
            chrome.storage.sync.set({'portal': true});
        }
        if (result['lms'] === undefined) {
            chrome.storage.sync.set({'lms': true});
        }
        if (result['score-inquiries'] === undefined) {
            chrome.storage.sync.set({'score-inquiries': true});
        }
        if (result['gpa'] === undefined) {
            chrome.storage.sync.set({'gpa': true});
        }
        if (result['graduate'] === undefined) {
            chrome.storage.sync.set({'graduate': true});
        }
        if (result['dorm-netflow'] === undefined) {
            chrome.storage.sync.set({'dorm-netflow': false});
        }
        dormNetflowTargetIp = result['dormIpAddress'];
        updateDormNetflowUsage(dormNetflowTargetIp);
    });
});

// Get and set the alarm to update the info of NCU dorm netflow usage per minute
let dormNetflowUsageSet = [];

updateDormNetflowUsage(dormNetflowTargetIp);

chrome.alarms.create('dormNetflowUsage', {periodInMinutes: 3});
chrome.alarms.onAlarm.addListener((_alarm) => {
    updateDormNetflowUsage(dormNetflowTargetIp);
});

// Deal with the request from popup.js
chrome.runtime.onMessage.addListener(
    (request, _sender, sendResponse) => {
        if (request.name === 'dormNetflowUsage') {
            sendResponse(dormNetflowUsageSet);
        }
        if (request.name === 'updateDormNetflowIp') {
            dormNetflowTargetIp = request.dormNetflowIp;
            updateDormNetflowUsage(dormNetflowTargetIp);
            sendResponse(true);
        }
    }
);

/**
 * The netflow usage for a certain time.
 */
class NetflowUsage {
    /**
     * Construct a netflow usage data.
     * @param {string} time A moment.js parsable string.
     * @param {string|number} externalUpload The off compus upload netflow.
     * @param {string|number} externalDownload The off compus download netflow.
     * @param {string|number} totalUpload The total upload netflow.
     * @param {string|number} totalDownload The total download netflow.
     */
    constructor(time, externalUpload, externalDownload,
        totalUpload, totalDownload) {
        this.time = time;
        this.externalUpload = externalUpload;
        this.externalDownload = externalDownload;
        this.totalUpload = totalUpload;
        this.totalDownload = totalDownload;
    }

    /**
     * Get the internal upload netflow usage.
     */
    get internalUpload() {
        return this.totalUpload - this.externalUpload;
    }

    /**
     * Get the internal download netflow usage.
     */
    get internalDownload() {
        return this.totalDownload - this.externalDownload;
    }
}

/**
 * Send post request to `uncia.cc.ncu.edu.tw/dormnet` and get the 24 hrs dorm
 * net flow usage statistics. And save the result in netflowUsage.
 * @param {string} ipAddress The target ip address.
 */
function updateDormNetflowUsage(ipAddress) {
    let url = 'http://uncia.cc.ncu.edu.tw/dormnet/index.php';
    let proxy = 'https://cors-anywhere.herokuapp.com/';
    // Create a virtual document so that the browser does not automatically load
    // the images present in the supplied HTML.
    // More info: https://stackoverflow.com/questions/15113910/jquery-parse-html-without-loading-images/33825198#33825198
    let ownerDocument = document.implementation.createHTMLDocument('virtual');
    let usageDataSet = [];
    $.post(proxy + url,
        {
            section: 'netflow',
            ip: ipAddress,
        },
        (html, _status) => {
            console.log('Dorm netflow info updated.');
            let table = $(html, ownerDocument).find(
                'table[border="1"][cellspacing="0"][cellpadding="5"]');
            $.each($('tr[bgcolor="#ffffee"], tr[bgcolor="#eeeeee"]', table),
                (_idx, tr) => {
                    let data = [];
                    $.each($('td', tr), (idx, td) => data[idx] = $(td).text());
                    usageDataSet.push(new NetflowUsage(
                        moment(data[0]), Number(data[1]), Number(data[2]),
                        Number(data[3]), Number(data[4])
                    ));
                });
            usageDataSet.reverse();
            dormNetflowUsageSet = usageDataSet;
        });
};
