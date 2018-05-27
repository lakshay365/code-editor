onload = function() {
  const { shell } = require('electron')
  const webview = document.querySelector('webview')
  const loading = document.querySelector('#loader')

  function onStopLoad() {
    loading.style.opacity = 0

    setTimeout(function() {
      loading.style.display = 'none'
    }, 2000)
  }

  webview.addEventListener('new-window', e => {
    const protocol = require('url').parse(e.url).protocol
    if (protocol === 'http:' || protocol === 'https:') {
      shell.openExternal(e.url)
    }
  })

  function onStartLoad() {
    loading.classList.remove('hide')
  }

  webview.addEventListener('did-stop-loading', onStopLoad)
  webview.addEventListener('did-start-loading', onStartLoad)
}
