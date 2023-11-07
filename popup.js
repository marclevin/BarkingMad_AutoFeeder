// Function to convert number to half and format it
function convertHalfFormatted(number) {
    return (number / 2).toFixed(1);
  }
  
  // Function to handle window load
  window.onload = function () {
    chrome.storage.local.get(["FeedDaily", "sendNotifications", "FedToday"], function (result) {
      document.getElementById("flexSwitchCheckChecked1").checked = result.FeedDaily;
      document.getElementById("flexSwitchCheckChecked2").checked = result.sendNotifications;
  
      if (result.FedToday) {
        document.getElementById("fed_today").innerHTML = "You've already contributed today!";
      }
    });
  };
  
  // Event listeners for switches
  document.getElementById("flexSwitchCheckChecked1").addEventListener("change", function () {
    chrome.storage.local.set({ FeedDaily: this.checked });
  });
  
  document.getElementById("flexSwitchCheckChecked2").addEventListener("change", function () {
    chrome.storage.local.set({ sendNotifications: this.checked });
  });
  
  // Fetch and display the feed count
  chrome.storage.local.get(["FeedCount"], function (result) {
    let feedCountMessage = "You haven't contributed any bowls yet!";
    let halfBowls = convertHalfFormatted(result.FeedCount);
    if (result.FeedCount === 0)
    {
      feedCountMessage = "You haven't contributed any bowls yet!";
      document.getElementById("doggos_fed").innerHTML = feedCountMessage;
      return
    }
    if (result.FeedCount === 1) {
      feedCountMessage = "You've contributed half a bowl of food so far!";
    } else if (result.FeedCount === 2) {
      feedCountMessage = "You've contributed 1 bowl of food so far!";
    } else if (halfBowls % 1 === 0.5) {
      let intBowls = Math.floor(halfBowls);
      feedCountMessage = `You've contributed ${intBowls} and a half bowls of food so far!`;
    } else {
      feedCountMessage = `You've contributed ${halfBowls} bowls of food so far!`;
    }
  
    document.getElementById("doggos_fed").innerHTML = feedCountMessage;
  });
  
  // Event listener for feed button
  document.getElementById("feed_doggos").addEventListener("click", function () {
    chrome.runtime.sendMessage({ greeting: "attempt_click" });
  });