document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('edit_profile').onclick = function() {
        chrome.runtime.openOptionsPage();
    };
    document.getElementById('autofill').onclick = async function() {
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      chrome.tabs.sendMessage(tab.id, {message: "hello"});
  }
    // Optional: Add review link handler if element exists
    var supportPage = document.getElementById("support_page");
    if (supportPage) {
        supportPage.addEventListener("click", openIndex);
    }
});

function openIndex() {
    chrome.tabs.create({
        active: true, 
        url: "https://chrome.google.com/webstore/detail/jobfill-pro/majkimankkfhefaabddppkhbobffaadp"
    });
}

var _gaq = _gaq || [];
// _gaq.push(['_setAccount', 'UA-188515357-1']);
// _gaq.push(['_trackPageview']);

(function() {
  // var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  // ga.src = 'https://ssl.google-analytics.com/ga.js';
  // var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();