local_storage_keys = {
  FeedDaily: true,
  fedLast: new Date().toISOString(),
  FedToday: false,
  FeedCount: 0,
  sendNotifications: true,
};

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // Set up default things here
    chrome.storage.local.set(local_storage_keys);
    attempt_click();
  }
});

// When the browser starts, check if we've fed today, if not, we need to feed
chrome.storage.local.get(["FeedDaily"], function (result) {
  if (!result.FeedDaily) {
    return;
  } else {
    chrome.runtime.onStartup.addListener(() => {
      chrome.storage.local.get(["FedToday", "fedLast"], function (result) {
        if (!result.FedToday) {
          attempt_click();
        }
        // check if it's been 24 hours since we last fed
        var fedLast = new Date(result.fedLast);
        var now = new Date();
        var diff = now - fedLast;
        var diffHours = Math.floor(diff / 1000 / 60 / 60);
        if (diffHours >= 24) {
          chrome.storage.local.set({ FedToday: false });
          attempt_click();
        }
      });
    });
  }
});

// Set up an alarm to run the script every 24 hours
chrome.alarms.create("feedAlarm", { periodInMinutes: 24 * 60 });

// Add a listener for the alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "feedAlarm") {
    // Set FedToday to false.
    chrome.storage.local.set({ FedToday: false });
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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.greeting === "attempt_click") {
    attempt_click();
  }
});

function send_fed_success() {
  var notifications_enabled = false;
  chrome.storage.local.get(["sendNotifications"]).then((result) => {
    if (result.sendNotifications)
    {
      chrome.notifications.create(
        "BMAutoFeeder",
        {
          type: "basic",
          message: "You contributed another half bowl!",
          title: "BarkingMad AutoFeeder",
          iconUrl: "./images/dog128.png",
        },
        function (notificationId) {
          console.log(chrome.runtime.lastError);
        }
      );
    } else
    {
      console.log("Not Enabled")
    }
  });
}
function execute_click_script(tabId) {
  return chrome.scripting
    .executeScript({
      target: { tabId: tabId },
      function: feed_function,
    })
    .then((result) => {
      if (result[0].result === -1) {
        console.log("Already fed today");
      } else if (result[0].result === -2) {
        console.log("Couldn't find the link");
      } else {
        send_fed_success();
        handle_update_locals();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function handle_update_locals() {
  if (
    !chrome.storage.local.get(["FedToday"], function (result) {
      return result.FedToday;
    })
  ) {
    chrome.storage.local.set({ FedToday: true });
    chrome.storage.local.get(["FeedCount"], function (result) {
      var newCount = (result.FeedCount || 0) + 1;
      chrome.storage.local.set({ FeedCount: newCount });
    });
    chrome.storage.local.set({ fedLast: new Date().toISOString() });
  }
}

function feed_function() {
  const ALREADY_FED = -1;
  const NOT_FOUND = -2;
  const link = document.getElementById("clicktofeedlink");
  if (link) {
    if (link.classList.contains("nomoreclick")) {
      return ALREADY_FED;
    }
    // check if the class is set to "nomoreclick", if it is, close the tab
    while (!link.classList.contains("nomoreclick")) {
      link.click();
    }
  } else {
    return NOT_FOUND;
  }
}
