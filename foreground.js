// console.log('$("#post").serialize()', $("#post").serialize())
// $('#save-post').click()

function setupPostMutiButton() {
  $('#save-post').after('<button id="multi-post">Multi Post</button>')
  setTimeout(() => {
    $('#multi-post').click(() => {
      $('#content-html').click()
      setTimeout(() => {
        chrome.runtime.sendMessage({action: "multi-post", formData: $("#post").serializeArray()}, (response) => {
          // 3. Got an asynchronous response with the data from the service worker
          console.log('received user data', response);
        });
      }, 100);

      return false
    })
  }, 1);
}
setupPostMutiButton()

function createHiddenField(field) {
  const html = '<input type="hidden" name="' + field.name + '" value="' + field.value + '">'
  $('#post').append(html)
}

function populateForm(formData) {
  const justSetValueFields = ['post_title', 'content', '_thumbnail_id']
  for (let i = 0; i < formData.length; i++) {
    let field = formData[i]
    if (justSetValueFields.includes(field.name)) {
      let element = $(`[name=${field.name}]`)
      element.val(field.value)
      if ('post_title' === field.name) {
        setTimeout(() => {
          console.log('focus')
          element.focus()
          $('#titlewrap label').click()
          setTimeout(() => {
            element.blur()
            console.log('blur')
          }, 1000);
        }, 1000);
      }
    } else if (field.name == 'tax_input[product_category][]') {
      $('#in-product_category-' + field.value).prop('checked', true)
    } else if (field.name.indexOf('acf[field_') != -1) {
      createHiddenField(field)
    }
  }
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    sendResponse({farewell: "goodbye"});

    if (request.action === "new-post") {
      console.log('new-post with form data', request.formData)
      populateForm(request.formData)
      console.log('$("#post").serializeArray()', $("#post").serializeArray())

      // save draft
      $('#save-post').click()
    }
  }
)

