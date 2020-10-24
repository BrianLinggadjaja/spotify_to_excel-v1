function checkForError() {
  let error = sessionStorage.getItem('error')
  if (error == null || error === 'undefined') {
    window.location.href = '/'
  } else {
    returnError(error)
  }
}

function returnError(error) {
  document.getElementById('header').innerHTML = 'You have encountered an error!'
  document.getElementById('error').innerHTML = error
}
