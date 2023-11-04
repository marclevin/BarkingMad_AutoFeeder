window.onload = function() {
    chrome.storage.local.get(['FeedDaily', 'sendNotifications', 'FedToday'], function(result) {
        document.getElementById('flexSwitchCheckChecked1').checked = result.FeedDaily;
        document.getElementById('flexSwitchCheckChecked2').checked = result.sendNotifications;
        if (result.FedToday) {
            document.getElementById('fed_today').innerHTML = "You've already contributed today!";
        }
    });
};

document.getElementById('flexSwitchCheckChecked1').addEventListener('change', function() {
    chrome.storage.local.set({ 'FeedDaily': this.checked });
});

document.getElementById('flexSwitchCheckChecked2').addEventListener('change', function() {
    chrome.storage.local.set({ 'sendNotifications': this.checked });
});
// Set the component with ID doggos_fed to the number of dogs fed
chrome.storage.local.get(['FeedCount'], function(result) {
    if (result.FeedCount === 0) {
    document.getElementById('doggos_fed').innerHTML = (`You haven't contributed any bowls yet!`);
    return;
    }
    let half_bowls = convert_half_formatted(result.FeedCount);
    if (result.FeedCount === 1) {
        document.getElementById('doggos_fed').innerHTML = (`You've contributed half a bowl of food so far!`);
        return;
    }
    if (result.FeedCount === 2) {
        document.getElementById('doggos_fed').innerHTML = (`You've contributed 1 bowl of food so far!`);
        return;
    }
    // if we have a bowl and a half, let's display it as N and a half bowls
    if (half_bowls % 1 === 0.5) {
        let int_bowls = Math.floor(half_bowls);
        document.getElementById('doggos_fed').innerHTML = (`You've contributed ${int_bowls} and a half bowls of food so far!`);
        return;
    }
    document.getElementById('doggos_fed').innerHTML = (`You've contributed ${half_bowls} bowls of food so far!`);
});

document.getElementById('feed_doggos').addEventListener('click', function() {
    // Run attempt click from background.js
    chrome.runtime.sendMessage({greeting: "attempt_click"});
});

function convert_half_formatted(number)
{
    return (number / 2).toFixed(1);
}

