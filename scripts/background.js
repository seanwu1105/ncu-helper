'use strict';

/**
 * Author: Sean Wu
 * NCU CSIE, Taiwan
 */

const TEST_IP = '140.115.221.88';

// Set default settings.
chrome.storage.sync.set({
    'portal': true,
    'lms': true,
    'score-inquiries': true,
    'graduate': true,
});

// Get and set the alarm to update the info of NCU dorm netflow usage per minute
let dormNetflowUsageSet = [];

updateDormNetflowUsage(TEST_IP, dormNetflowUsageSet);

chrome.alarms.create('dormNetflowUsage', {periodInMinutes: 1});
chrome.alarms.onAlarm.addListener((_alarm) => {
    dormNetflowUsageSet = [];
    updateDormNetflowUsage(TEST_IP, dormNetflowUsageSet);
});

// Deal with the request from popup.js
chrome.runtime.onMessage.addListener(
    (request, _sender, sendResponse) => {
        if (request.name === 'dormNetflowUsage') {
            sendResponse(dormNetflowUsageSet);
        }
    }
);

/**
 * The netflow usage for a certain time.
 */
class NetflowUsage {
    /**
     * Construct a netflow usage data.
     * @param {str} time A moment.js parsable string.
     * @param {str|num} externalUpload The off compus upload netflow.
     * @param {str|num} externalDownload The off compus download netflow.
     * @param {str|num} totalUpload The total upload netflow.
     * @param {str|num} totalDownload The total download netflow.
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
 * @param {str} ipAddress The target ip address.
 * @param {[]} usageDataSet The return value of the callback of $.post,
 *                          containing all netflow usage data in an array.
 */
function updateDormNetflowUsage(ipAddress, usageDataSet) {
    let url = 'https://uncia.cc.ncu.edu.tw/dormnet/index.php';
    let proxy = 'https://cors-anywhere.herokuapp.com/';
    // Create a virtual document so that the browser does not automatically load
    // the images present in the supplied HTML.
    // More info: https://stackoverflow.com/questions/15113910/jquery-parse-html-without-loading-images/33825198#33825198
    let ownerDocument = document.implementation.createHTMLDocument('virtual');
    $.post(proxy + url,
        {
            section: 'netflow',
            ip: ipAddress,
        },
        (html, status) => {
            console.log('updateDormNetflow status: ' + status);
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
        });
};
