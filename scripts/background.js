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
chrome.alarms.onAlarm.addListener(function(alarm) {
    updateDormNetflowUsage(TEST_IP);
});

updateDormNetflowUsage(TEST_IP);

/**
 * Send post request to `uncia.cc.ncu.edu.tw/dormnet` and get the 24 hrs dorm
 * net flow usage statistics.
 * @param {*} ip The target ip address.
 */
function updateDormNetflowUsage(ip) {
    let url = 'https://uncia.cc.ncu.edu.tw/dormnet/index.php';
    let proxy = 'https://cors-anywhere.herokuapp.com/';
    // Create a virtual document so that the browser does not automatically load
    // the images present in the supplied HTML.
    // More info: https://stackoverflow.com/questions/15113910/jquery-parse-html-without-loading-images/33825198#33825198
    let ownerDocument = document.implementation.createHTMLDocument('virtual');
    $.post(proxy + url,
        {
            section: 'netflow',
            ip: ip,
        },
        function(html, status) {
            console.log('updateDormNetflow status: ' + status);
            try {
            let table = $(html, ownerDocument).find(
                'table[border="1"][cellspacing="0"][cellpadding="5"]');
            $.each($(table).find(
                'tr[bgcolor="#ffffee"], tr[bgcolor="#eeeeee"]'),
                function(index, tr) {
                    $.each($(tr).find('td'), function(index, td) {
                        console.log($(td).text());
                    });
                });
            } catch (err) {
                console.log('catch error');
            }
        });
};
