// This is the service worker script, which executes in its own context
// when the extension is installed or refreshed (or when you access its console).
// It would correspond to the background script in chrome extensions v2.

console.log("This prints to the console of the service worker (background script)")

// Importing and using functionality from external files is also possible.
importScripts('service-worker-utils.js')

// If you want to import a file that is deeper in the file hierarchy of your
// extension, simply do `importScripts('path/to/file.js')`.
// The path should be relative to the file `manifest.json`.

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.action === "multi-post") {
      chrome.tabs.create({url: 'http://localhost/wp-admin/post-new.php?post_type=product', active: false}, function (tab) {
        console.log('tab.id', tab.id);
        setTimeout(() => {
          chrome.tabs.sendMessage(tab.id, {action: "new-post", formData: request.formData}, (response) => {
            console.log('received user data', response);
          });
        }, 8000);
      });

      sendResponse({farewell: "goodbye"});

    }

  }
)
