'use strict';

/**
 * Author: Sean Wu
 * NCU CSIE, Taiwan
 */

const TEST_IP = '140.115.201.18';

// Set default settings.
chrome.storage.sync.set({
    'portal': true,
    'lms': true,
    'score-inquiries': true,
    'graduate': true,
});

// Get and set the alarm to update the info of NCU dorm netflow usage per minute
chrome.alarms.create('dormNetflowUsage', {periodInMinutes: 1});
chrome.alarms.onAlarm.addListener(function(_alarm) {
    updateDormNetflowUsage(TEST_IP);
});

updateDormNetflowUsage(TEST_IP);

/**
 * Send post request to `uncia.cc.ncu.edu.tw/dormnet` and get the 24 hrs dorm
 * net flow usage statistics.
 * @param {*} ipAddress The target ip address.
 */
function updateDormNetflowUsage(ipAddress) {
    let url = 'https://uncia.cc.ncu.edu.tw/dormnet/index.php';
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
        function(html, status) {
            console.log('updateDormNetflow status: ' + status);
            let table = $(html, ownerDocument).find(
                'table[border="1"][cellspacing="0"][cellpadding="5"]');
            $.each(
                $(table).find('tr[bgcolor="#ffffee"], tr[bgcolor="#eeeeee"]'),
                function(_idx, tr) {
                    let data = {
                        time: undefined,
                        externalUl: undefined,
                        externalDl: undefined,
                        totalUl: undefined,
                        totalDl: undefined,
                    };
                    $.each($(tr).find('td'), function(idx, td) {
                        let content = $(td).text();
                        if (idx === 0) data.time = moment(content);
                        else if (idx === 1) data.externalUl = Number(content);
                        else if (idx === 2) data.externalDl = Number(content);
                        else if (idx === 3) data.totalUl = Number(content);
                        else data.totalDl = Number(content);
                    });
                    usageDataSet.push(data);
                });
            console.log(usageDataSet);
        });
};
