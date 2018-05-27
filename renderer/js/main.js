onload = function () {
    const {shell} = require('electron');
    const webview = document.querySelector('webview');
    const loading = document.querySelector('#loader');

    function onStopLoad() {
        fade(loader);
    }

    webview.addEventListener('new-window', e => {
        const protocol = require('url').parse(e.url).protocol;
        if (protocol === 'http:' || protocol === 'https:') {
            shell.openExternal(e.url);
        }
    });

    function onStartLoad() {
        loading.classList.remove('hide');
    }

    webview.addEventListener('did-stop-loading', onStopLoad);
    webview.addEventListener('did-start-loading', onStartLoad);

    function fade(element, callback) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
        }, 50);
    }
};