globalThis.WEBURL = "";
globalThis.MESSEGE_TYPE = "MESSEGE_TYPE";
globalThis.RESUME_MES = "Resume";
globalThis.JOB_URL_MES = "JobUrl";
globalThis.APPLICATION_MES = "Apply";
globalThis.USER_ID = "User";
globalThis.APPLY_COUNT = "ApplyCount";
globalThis.DATA_RESUME = "DATA_RESUME";
globalThis.DATA_FIRST_NAME = "DATA_FIRST_NAME";
globalThis.DATA_LAST_NAME = "DATA_LAST_NAME";
globalThis.DATA_PHONE = "DATA_PHONE";
globalThis.DATA_EMAIL = "DATA_EMAIL";
globalThis.DATA_ADDRESS = "DATA_ADDRESS";
globalThis.DATA_COLLEGE = "DATA_COLLEGE";
globalThis.DATA_MAJOR = "DATA_MAJOR";
globalThis.DATA_GRADUATE_DATE = "DATA_GRADUATE_DATE";

globalThis.RESUME_DATA_FIELDS = [
  DATA_FIRST_NAME,
  DATA_LAST_NAME,
  DATA_PHONE,
  DATA_EMAIL,
  DATA_ADDRESS,
  DATA_COLLEGE,
  DATA_MAJOR,
  DATA_GRADUATE_DATE
];

// Constants are used by other scripts
globalThis.WEBURL = "";
globalThis.MESSEGE_TYPE = "MESSEGE_TYPE";
globalThis.RESUME_MES = "Resume";
globalThis.JOB_URL_MES = "JobUrl";
globalThis.APPLICATION_MES = "Apply";
globalThis.USER_ID = "User";
globalThis.APPLY_COUNT = "ApplyCount";
globalThis.DATA_RESUME = "DATA_RESUME";
globalThis.DATA_FIRST_NAME = "DATA_FIRST_NAME";
globalThis.DATA_LAST_NAME = "DATA_LAST_NAME";
globalThis.DATA_PHONE = "DATA_PHONE";
globalThis.DATA_EMAIL = "DATA_EMAIL";
globalThis.DATA_ADDRESS = "DATA_ADDRESS";
globalThis.DATA_COLLEGE = "DATA_COLLEGE";
globalThis.DATA_MAJOR = "DATA_MAJOR";
globalThis.DATA_GRADUATE_DATE = "DATA_GRADUATE_DATE";

globalThis.RESUME_DATA_FIELDS = [
  DATA_FIRST_NAME,
  DATA_LAST_NAME,
  DATA_PHONE,
  DATA_EMAIL,
  DATA_ADDRESS,
  DATA_COLLEGE,
  DATA_MAJOR,
  DATA_GRADUATE_DATE
];

// Constants are used by other scripts
globalThis.WEBURL = "";
globalThis.MESSEGE_TYPE = "MESSEGE_TYPE";
globalThis.RESUME_MES = "Resume";
globalThis.JOB_URL_MES = "JobUrl";
globalThis.APPLICATION_MES = "Apply";
globalThis.USER_ID = "User";
globalThis.APPLY_COUNT = "ApplyCount";
globalThis.DATA_RESUME = "DATA_RESUME";
globalThis.DATA_FIRST_NAME = "DATA_FIRST_NAME";
globalThis.DATA_LAST_NAME = "DATA_LAST_NAME";
globalThis.DATA_PHONE = "DATA_PHONE";
globalThis.DATA_EMAIL = "DATA_EMAIL";
globalThis.DATA_ADDRESS = "DATA_ADDRESS";
globalThis.DATA_COLLEGE = "DATA_COLLEGE";
globalThis.DATA_MAJOR = "DATA_MAJOR";
globalThis.DATA_GRADUATE_DATE = "DATA_GRADUATE_DATE";

globalThis.RESUME_DATA_FIELDS = [
  DATA_FIRST_NAME,
  DATA_LAST_NAME,
  DATA_PHONE,
  DATA_EMAIL,
  DATA_ADDRESS,
  DATA_COLLEGE,
  DATA_MAJOR,
  DATA_GRADUATE_DATE
];

// Now load the background script
importScripts('background.js');
// Constants are defined in config.js which is loaded firstasync function executeContentScript(a,b){await chrome.scripting.executeScript({target:{tabId:a},files:[b]})}async function genericOnClick(a,b){a=await chrome.storage.local.get(["resume"]);typeof a!=="undefined"&&typeof a.resume!=="undefined"||createTab()}
async function createTab(){var a=await chrome.windows.getCurrent();const b=(new URL(chrome.runtime.getURL("index.html"))).toString();a={index:0,windowId:a.id,url:b,active:!0};try{await chrome.tabs.create(a)}catch(c){console.error(c)}}async function sendResume(){const a=(await chrome.storage.local.get(["applyUserId"])).applyUserId,b=await chrome.storage.local.get(["resume"]);sendData(JSON.stringify({userId:a,resume:b.resume}))}function sendApplication(){}
function randomstring(a){let b="";for(let c=0;c<a;c++)b+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random()*62));return b}async function generateUserId(){const a=randomstring(16);await chrome.storage.sync.set({[USER_ID]:a});sendData(USER_ID,{[USER_ID]:a})}function sendData(a,b={}){console.log("Sending data:",a,b)}async function sendUrl(a){const b=(await chrome.storage.sync.get(USER_ID))[USER_ID];sendData(JOB_URL_MES,{[USER_ID]:b,[JOB_URL_MES]:a})}
chrome.runtime.onInstalled.addListener(async()=>{await chrome.contextMenus.create({title:"JobFill Pro",id:"parent"});await chrome.contextMenus.create({title:"Profile",parentId:"parent",id:"Profile"});chrome.contextMenus.onClicked.addListener(genericOnClick);chrome.tabs.onUpdated.addListener((a,b,c)=>{b.status==="complete"&&c.url!=="undefined"&&c.url!=="chrome://newtab/"&&(c.url.includes("lever.co")||c.url.includes("taleo")||c.url.includes("myworkdayjobs")||c.url.includes("greenhouse"))&&sendUrl(c.url)});
await generateUserId()});chrome.runtime.onMessage.addListener((a,b,c)=>{a[MESSEGE_TYPE]===RESUME_MES?sendResume():a[MESSEGE_TYPE]===JOB_URL_MES&&b.tab?sendData(b.tab.url):a[MESSEGE_TYPE]===APPLICATION_MES?sendApplication():a.type==="notification"&&chrome.notifications.create("",a.options);return!0});



