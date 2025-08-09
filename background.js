function genericOnClick(info, tab) {

  
  chrome.storage.local.get(['resume'], function(result) {
        if (typeof result === "undefined" || typeof result.resume === "undefined")
        {
            createTab();
        }
        else
        {
        }
    });
}

function createTab() {
  chrome.windows.getCurrent(function call(window) {
      
      var url = chrome.extension.getURL("index.html");
      var args = {
    'index': 0,
    'windowId': window.id,
    'url': url,
    'selected': true
  }
  try {
    chrome.tabs.create(args);
  } catch (e) {
    alert(e);
  }});
}

function sendResume() {
    var applyUserId = "";
    chrome.storage.local.get(['applyUserId'], function(result) {
         applyUserId = result.applyUserId;
     });
      
    chrome.storage.local.get(['resume'], function(result) {
        var resumeObj = {"userId" : applyUserId, "resume" : result.resume};
        sendData(JSON.stringify(resumeObj));
    });
}

function sendApplication() {
}


chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({"title": "Kumquat", "id": "parent"});
  chrome.contextMenus.create(
      {"title": "Profile", "parentId": "parent", "id": "Profile", });
//   chrome.contextMenus.create({"title": "Autofill", "parentId": "parent", "id": "Autofill"});
  
// chrome.contextMenus.onClicked.addListener(function(info, tab) {
//     if (info.menuItemID == "Autofill") {
//       chrome.tabs.sendMessage({message: 'autofill'});
//     }
// });
  
  
  generateUserId();
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.MESSEGE_TYPE === RESUME_MES) {
        sendResume();
    }
    
    else if (request.MESSEGE_TYPE === JOB_URL_MES) {
        sendData(sender.tab.url);
    }
  
    else if (request.MESSEGE_TYPE === APPLICATION_MES) {
        sendApplication();
    }  
  });
});

function randomstring(L) {
  var s = '';
  var randomchar = function() {
    var n = Math.floor(Math.random() * 62);
    if (n < 10) return n; //1-10
    if (n < 36) return String.fromCharCode(n + 55); //A-Z
    return String.fromCharCode(n + 61); //a-z
  }
  while (s.length < L) s += randomchar();
  return s;
}

function generateUserId() {
    var userId = randomstring(16);
    
    var obj= {};

    obj[USER_ID] = userId;
    chrome.storage.sync.set(obj, function() {
    });
        
  
    var data = {[USER_ID] : userId};
    
    sendData(USER_ID, data);
}


function sendData(method, data) {
    // var x = new XMLHttpRequest();
    // var url = WEBURL+ "/" + method;
    
    // x.open('POST', url, true);
    // x.onload = function() {
    //    // alert(x.responseText);
    // };
        
    // x.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    
    // var jsonStr = JSON.stringify(data);
    // x.send(jsonStr);
}



function sendUrl(url) {
     var applyUserId = "";
     
     chrome.storage.sync.get(USER_ID, function(result) {
            applyUserId = result[USER_ID];
            var data = {[USER_ID] : applyUserId, [JOB_URL_MES] : url};
            sendData(JOB_URL_MES, data);
     });
}



chrome.runtime.onInstalled.addListener(function() {
 
  chrome.contextMenus.onClicked.addListener(genericOnClick);
  
     chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status === 'complete' && tab.url !== "undefined" &&
                        tab.url !== "chrome://newtab/")
        {
            var flag = tab.url.includes("lever.co") || tab.url.includes("taleo") || tab.url.includes("myworkdayjobs") || tab.url.includes("greenhouse");
            if (flag)
            {
                sendUrl(tab.url);
            }
        }
    });
    
  generateUserId();
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.MESSEGE_TYPE === RESUME_MES) {
        sendResume();
    }
    
    else if (request.MESSEGE_TYPE === JOB_URL_MES) {
        sendData(sender.tab.url);
    }
  
    else if (request.MESSEGE_TYPE === APPLICATION_MES) {
        sendApplication();
    }  
  });
});


chrome.runtime.onMessage.addListener(data => {
    if (data.type === 'notification') {
          chrome.notifications.create('', data.options);  
    }
});