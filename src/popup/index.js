$(function () {

    // popup 弹窗页面
    // 1. 点击图标就会打开, 失去焦点就会关闭
    // 2. 强制关闭可以调用 window.close()

    chrome.runtime.onMessage.addListener(async (message) => {
        if (message.action === 'popup-close') {
            window.close()
        }
        return true
    })

    $('#openPicker').on('click', openPicker)
    $('#setting').on('click', openSetting)
    
    // 颜色拾取触发内容脚本事件
    // 应向background通知总事件, 事件回调等逻辑应该在background中执行操作
    // popup进程是跟弹窗出现有关的, 生命周期很短
    async function openPicker () {
        chrome.runtime.sendMessage({ action: 'picker' })
    }

    function openSetting () {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage()
        } else {
            window.open(chrome.runtime.getURL('src/options/index.html'))
        }
    }
})
