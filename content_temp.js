var isWorkdayload = false, taleoflag = false;
var PROFILE;

function createPopup(type) {
    let overlay = document.createElement("DIV");
    overlay.id = "jobfillOverlay";
    document.body.insertBefore(overlay, document.body.firstChild);

    let tree = document.createElement("IMG");
    tree.id = "jobfillTree";
    tree.src = chrome.runtime.getURL("jobfill_tree.png");

    let text = document.createElement("DIV");
    text.id = "popupText";
    text.innerHTML = "JobFill Pro Compatible!";

    let button = document.createElement("BUTTON");
    button.id = "jobfillButton";
    button.innerHTML = "Autofill Application";

    let close = document.createElement("DIV");
    close.id = "popupClose";
    close.innerHTML = "Try Later";

    overlay.appendChild(tree);
    overlay.appendChild(text);
    overlay.appendChild(button);
    overlay.appendChild(close);

    close.onclick = function() {
        overlay.remove();
    };

    button.onclick = function() {
        overlay.remove();
        chrome.storage.sync.get("profile", function(syncData) {
            if (typeof syncData.profile !== "undefined") {
                PROFILE = JSON.parse(syncData.profile);
                handleProfile(type);
            } else {
                chrome.storage.local.get("profile", function(localData) {
                    if (typeof localData.profile === "undefined") {
                        alert("You must save your JobFill Pro profile before autofilling.");
                    } else {
                        PROFILE = JSON.parse(localData.profile);
                        handleProfile(type);
                    }
                });
            }
        });
    };
}

function handleProfile(action) {
    switch(action) {
        case "workday":
            return workday();
        case "taleo":
            return taleo();
        case "greenhouse":
            return greenhouse();
        case "lever":
            return lever();
    }
}

function selectItem(xpath, text) {
    var mousedown = new Event("mousedown");
    document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).dispatchEvent(mousedown);
    let input = document.querySelector("#select2-drop > div > input");
    input.value = text;
    let keyupChange = new Event("keyup-change");
    input.dispatchEvent(keyupChange);
    setTimeout(function() {
        let item = document.evaluate("//*[contains(text(), '" + text + "')]/ancestor::li", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
        let mousedownBubble = new Event("mousedown", {bubbles: true, cancelable: true});
        let mouseupBubble = new Event("mouseup", {bubbles: true, cancelable: true});
        item.dispatchEvent(mousedownBubble);
        item.dispatchEvent(mouseupBubble);
    }, 1500);
}

function simplexpathtrytype(xpath, value) {
    if (existsxpath(xpath)) {
        document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).value = value;
    }
}

function greenhouse() {
    setTimeout(function() {
        trytype("input[id='first_name']", PROFILE.first_name);
        trytype("input[id='last_name']", PROFILE.last_name);
        trytype("input[id='email']", PROFILE.email);
        trytype("input[id='phone']", PROFILE.phone);
        trytype("input[aria-label='Education Start Month']", PROFILE.uni_start_month);
        trytype("input[aria-label='Education Start Year']", PROFILE.uni_start_year);
        trytype("input[aria-label='Education End Month']", PROFILE.grad_month);
        trytype("input[aria-label='Education End Year']", PROFILE.grad_year);
        
        simplexpathtrytype('//*[contains(text(), "LinkedIn Profile")]//input[@type="text"]', PROFILE.linkedin);
        simplexpathtrytype('//*[contains(text(), "Github")]//input[@type="text"]', PROFILE.github);
        simplexpathtrytype('//*[contains(text(), "Website")]//input[@type="text"]', PROFILE.website);
        
        selectItem("//*[@id='s2id_education_degree_0']//a", PROFILE.degree);
        setTimeout(function() {
            selectItem("//*[@id='s2id_education_discipline_0']//a", PROFILE.major);
            setTimeout(function() {
                completeNotification();
            }, 1200);
        }, 3000);
    }, 1000);
}

function lever() {
    document.getElementsByName("name")[0].value = PROFILE.first_name;
    document.getElementsByName("email")[0].value = PROFILE.email;
    document.getElementsByName("phone")[0].value = PROFILE.phone;
    
    if (PROFILE.current_job1 == 1) {
        document.getElementsByName("org")[0].value = PROFILE.employer1;
    } else if (PROFILE.current_job2 == 1) {
        document.getElementsByName("org")[0].value = PROFILE.employer2;
    } else if (PROFILE.current_job3 == 1) {
        document.getElementsByName("org")[0].value = PROFILE.employer3;
    }
    
    document.getElementsByName("urls[LinkedIn]")[0].value = PROFILE.linkedin;
    document.getElementsByName("urls[GitHub]")[0].value = PROFILE.github;
    document.getElementsByName("urls[Portfolio]")[0].value = PROFILE.website;
    
    setTimeout(function() {
        completeNotification();
    }, 800);
}

function completeNotification() {
    chrome.runtime.sendMessage("", {
        type: "notification",
        options: {
            title: "Autofill Complete!",
            message: "Thanks for using JobFill Pro",
            iconUrl: "/jobfill48.png",
            type: "basic"
        }
    });
}

function existsquery(selector) {
    return document.querySelector(selector) ? true : false;
}

function existsxpath(xpath) {
    if (document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength > 0) {
        return true;
    }
}

function trytype(selector, value) {
    if (existsquery(selector)) {
        document.querySelector(selector).value = value;
    }
}

// Initialize extension when DOM is ready
window.addEventListener('load', function() {
    let url = window.location.toString();

    isWorkdayload = false;
    if (existsquery("input[id='first_name']")) {
        createPopup("greenhouse");
    }
    if (url.includes("myworkdayjobs")) {
        createPopup("workday");
    }
    if (url.includes("taleo") && taleoflag == 0) {
        createPopup("taleo");
    }
    if (url.includes("lever.co") && url.includes("/apply")) {
        createPopup("lever");
    }
});

// Listen for messages from the extension
chrome.runtime.onMessage.addListener(function(message, sender) {
    isWorkdayload = false;
    let url = window.location.toString();
    
    chrome.storage.sync.get("profile", function(data) {
        if (typeof data.profile === "undefined") {
            alert("You must save your JobFill Pro profile before autofilling.");
        } else {
            PROFILE = JSON.parse(data.profile);
            if (existsquery("input[id='first_name']")) {
                greenhouse();
            }
            if (url.includes("myworkdayjobs")) {
                workday();
            }
            if (url.includes("taleo") && taleoflag == 0) {
                taleo();
            }
            if (url.includes("lever.co") && url.includes("/apply")) {
                lever();
            }
        }
    });
});
