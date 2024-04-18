window.onload = () => {
    // 监听扩展程序发来的消息
    chrome.runtime.onMessage.addListener((message) => {
        const { action, msg } = message
        if (action === 'copy') {
            msg && sendNotification(`已复制颜色: ${msg}`)
        }
    })

    function sendNotification (msg) {
        const $div = document.createElement('div')
        $div.classList.add('watcher-notification-box')
        $div.innerHTML = msg
        document.body.appendChild($div)
        setTimeout(() => {
            $div.remove()
        }, 2000)
    }
}
