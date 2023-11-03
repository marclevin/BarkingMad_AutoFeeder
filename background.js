chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      // Set up default things here
      chrome.storage.local.set({ 'FeedDaily': true, 'RecordCount': true, 'FedToday': false, 'FeedCount': 0});
    }

  });

chrome.storage.local.get (['FeedDaily', 'RecordCount', 'FedToday'], function(result) {
    // if they aren't defined, set Daily to true and record to true
    if (result.FeedDaily === undefined) {
        chrome.storage.local.set({ 'FeedDaily': true });

    }
    if (result.RecordCount === undefined) {
        chrome.storage.local.set({ 'RecordCount': true });
        chrome.storage.local.set({'FeedCount': 0});
    }
    if (result.FedToday === undefined) {
        chrome.storage.local.set({ 'FedToday': false });
    }
});
// Set up an alarm to run the script every 24 hours
chrome.alarms.create('feedAlarm', { periodInMinutes: 24 * 60 });

// Add a listener for the alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'feedAlarm') {
    attempt_click();
  }
});

function attempt_click() {
  let tab = chrome.tabs.create({
    url: "https://www.barkingmad.co.za/click-to-feed-2019-2/",
  });
  // Wait till the tab is loaded using the tab's promise.
  tab.then((tab) => {
    execute_click_script(tab.id).then(() => {
        chrome.tabs.remove(tab.id);
        });
  });

}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.greeting === "attempt_click") {
        attempt_click();
      }
    }
  );

function execute_click_script(tabId) {
    return chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: () => {
            const link = document.getElementById("clicktofeedlink");
            if (link) {
                // check if the class is set to "nomoreclick", if it is, close the tab
                while (!link.classList.contains("nomoreclick")) {
                    link.click();
                }
                if (link.classList.contains("nomoreclick") && !chrome.storage.local.get(['FedToday'], function(result) {return result.FedToday})) {
                    chrome.storage.local.set({'FedToday': true});
                    chrome.storage.local.get(['FeedCount'], function(result) {
                        var newCount = (result.FeedCount || 0) + 1;
                        chrome.storage.local.set({'FeedCount': newCount});
                    });
                }
            } else {
                console.log("Link not found");
            }
        },
    });
}