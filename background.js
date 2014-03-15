var gaanaTabId = null;
var gaanaWindowId = null;
var DEBUG = false;
var state_play = false;

function getGaanaUrl() {
  return "http://www.gaana.com/";
}

function getHomeStationUrl() {
  return getGaanaUrl() + "radio/meethi-mirchi/";
}

function isGaanaUrl(url) {
  // Return whether the URL starts with the Gaana prefix.
  return url.indexOf(getGaanaUrl()) == 0;
}

function onInit() {
  if (gaanaTabId != null) {
    chrome.tabs.executeScript(gaanaTabId, {
      code: 'if ($(".spritePlayer.playPause").hasClass("play")) { "playing"; } \
             else { "paused"; }'
    }, function (callback) {
      if (callback == "playing") {
        chrome.browserAction.setIcon({path:"state-play.png"});
        state_play = true;
      } else if (callback == "paused") {
        chrome.browserAction.setIcon({path:"state-pause.png"});
        state_play = false;
      }
    });
  }
}

function checkIfGaanaHasScripts() {
  chrome.tabs.sendMessage(gaanaTabId, {greeting: "hello"}, function(response) {
    if (response) {
        if (DEBUG)
        {
          console.log("Already there");
        }
    }
    else {
        if (DEBUG)
        {
          console.log("Content scripts not there, injecting content scripts");
        }
        chrome.tabs.executeScript(gaanaTabId, {file: "jquery.min.js"});
        chrome.tabs.executeScript(gaanaTabId, {file: "gaana.js"});
        // chrome.tabs.executeScript(gaanaTabId, {code: "getSongInfo();"});
    }
  });
}

function gaanaTabRemoved(tabId, oRemoveInfo) {
  if (DEBUG)
  {
    console.log(tabId + " " + gaanaTabId);
  }
  if (tabId == gaanaTabId) {
    if (DEBUG)
    {
      console.log("Gaana tab closed! Nooooooooooooooo!");
    }
    chrome.browserAction.setIcon({path:"state-pause.png"});
    state_play = false;
    gaanaTabId = null;
  }
}

function getAllWindows() {
  chrome.windows.getAll({populate:true},function (windows) {
    for (var i = 0; i < windows.length; i++) {
      getGaanaTabId(windows[i].id);
    };
  });
}

function getGaanaTabId(windowId) {
  chrome.tabs.getAllInWindow(windowId, function(tabs) {
    for (var i = 0, tab; tab = tabs[i]; i++) {
      if (tab.url && isGaanaUrl(tab.url)) {
        if (DEBUG)
        {
          console.log("Found tab id: " + tab.id + " in window: " + windowId);
        }
        gaanaTabId = tab.id;
        gaanaWindowId = window.id;
        checkIfGaanaHasScripts();
      }
    }
  });
}

function goToGaana() {
  if (gaanaTabId != null) {   // Gaana tab is already open
    
    if (state_play) {
      chrome.browserAction.setIcon({path:"state-pause.png"});
      state_play = false;
    }
    else {
      chrome.browserAction.setIcon({path:"state-play.png"});
      state_play = true;
    }

    chrome.tabs.executeScript(gaanaTabId, {
      code: "$('.spritePlayer.playPause').click();"
    });

    return;
  }
  else  // no Gaana tab is open
  {
    chrome.tabs.create({url: getHomeStationUrl(), pinned: true});
    chrome.browserAction.setIcon({path:"state-play.png"});
    state_play = true;
    getAllWindows();
  }
}

function onMessage(request, sender, sendResponse) {
  switch (request.message) {
    case "paused":
      chrome.browserAction.setIcon({path:"state-pause.png"});
      state_play = false;
      break;
    case "playing":
      chrome.browserAction.setIcon({path:"state-play.png"});
      state_play = true;
      break;
    // case "songChanged":
    //   chrome.browserAction.setTitle({ title: "Song: " + request.songTitle + "\nArtist: " + request.songArtist + "\nAlbum: " + request.songAlbum });
    //   if (parseBool(localStorage["showNotifications"])) {
    //     var options = {
    //       type: "list",
    //       title: request.songTitle,
    //       message: "",
    //       iconUrl: request.songArt,
    //       items: [
    //         { title: "Artist", message: request.songArtist},
    //         { title: "Album", message: request.songAlbum}
    //       ]
    //     };
    //     chrome.notifications.create(options.title, options, function () {});
    //     setTimeout(function() { chrome.notifications.clear(options.title, function() {}); }, 5000);
    //   }
    //   break;
  }
}

function onCreated(tab) {
  if (DEBUG)
  {
    console.log("Tab Created", tab);
  }
  if (isGaanaUrl(tab.url)) {
    chrome.browserAction.setIcon({path:"state-pause.png"});
    state_play = false;
    gaanaTabId = tab.id;
  }
}

function onUpdated(tabId, oChangeInfo, tab) {
  if (DEBUG)
  {
    console.log("Tab Updated", tab);
  }
  if (tab.status == "complete" && isGaanaUrl(tab.url)) {  // New Gaana tab was created
    chrome.browserAction.setIcon({ path:"state-pause.png" });
    state_play = false;
    gaanaTabId = tab.id;
  }
  else if (tab.id == gaanaTabId && !isGaanaUrl(tab.url)) {  // Gaana tab was closed
    chrome.browserAction.setIcon({ path:"state-pause.png" });
    state_play = false;
    gaanaTabId = null;
  }
}

chrome.browserAction.setIcon({path:"state-pause.png"});
getAllWindows();
chrome.browserAction.onClicked.addListener(goToGaana);
chrome.tabs.onRemoved.addListener(gaanaTabRemoved);
chrome.runtime.onMessage.addListener(onMessage);
chrome.runtime.onInstalled.addListener(onInit);
chrome.tabs.onCreated.addListener(onCreated);
chrome.tabs.onUpdated.addListener(onUpdated);