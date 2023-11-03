window.onload = function() {
    chrome.storage.local.get(['FeedDaily', 'RecordCount'], function(result) {
        document.getElementById('flexSwitchCheckChecked1').checked = result.FeedDaily;
        document.getElementById('flexSwitchCheckChecked2').checked = result.RecordCount;
    });
};

document.getElementById('flexSwitchCheckChecked1').addEventListener('change', function() {
    chrome.storage.local.set({ 'FeedDaily': this.checked });
});

document.getElementById('flexSwitchCheckChecked2').addEventListener('change', function() {
    chrome.storage.local.set({ 'RecordCount': this.checked });
});
// Set the component with ID doggos_fed to the number of dogs fed
chrome.storage.local.get(['FeedCount'], function(result) {
    if (result.FeedCount === undefined || result.FeedCount === 0) {
        chrome.storage.local.set({'FeedCount': 0});
    document.getElementById('doggos_fed').innerHTML = (`You haven't fed any dogs yet!`);
    return;
    }
    if (result.FeedCount === 1) {
        document.getElementById('doggos_fed').innerHTML = (`You've fed ${result.FeedCount} dog!`);
        return;
    }
    document.getElementById('doggos_fed').innerHTML = (`You've fed ${result.FeedCount} dogs!`);
});

document.getElementById('feed_doggos').addEventListener('click', function() {
    // Run attempt click from background.js
    chrome.runtime.sendMessage({greeting: "attempt_click"});
});