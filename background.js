chrome.storage.local.get(["lastRun"], (result) => {
  let lastRun = result.lastRun ? new Date(result.lastRun) : new Date(0);
  const currentTime = new Date();

  // Check if it's been 24 hours since the last run
  if (!(currentTime - lastRun >= 24 * 60 * 60 * 1000)) {
    return;
  }
  // Set the last run time to now
  chrome.storage.local.set({ lastRun: currentTime.toString() });
  attempt_click();
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
            } else {
                console.log("Link not found");
            }
        },
    });
}

function clear_lastRun() {
    chrome.storage.local.set({ lastRun: new Date(0).toString() });
}