// 监听扩展程序发来的消息
chrome.runtime.onMessage.addListener((message) => {
    const { action } = message
    if (action === 'picker') {
        pickerColor()
    }
})

function pickerColor () {
    if (!window.EyeDropper) {
        alert('你的浏览器不支持 EyeDropper API')
        return
    }
    // Todo: 解决有时候 open 不出来！
    window.focus()
    setTimeout(() => {
        new EyeDropper().open().then(({ sRGBHex }) => {
            copyContent(sRGBHex)
            // Todo: 提示复制成功
            sendMessage({ action: 'pickerEnd', sRGBHex })
        }).catch((e) => {
            console.log(e)
        })
    }, 0)
}

function sendMessage (message) {
    chrome.runtime.sendMessage(message)
}

function copyContent (text) {
    const $div = document.createElement('input')
    $div.style.cssText = 'position:absolute;top:-1000px;left:-1000px;'
    $div.value = text
    $div.setAttribute('readonly', 'readonly')
    document.querySelector('body').appendChild($div)
    $div.select()
    document.execCommand('copy')
    $div.remove()
}
