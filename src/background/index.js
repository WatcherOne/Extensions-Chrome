import { httpGetCurrency } from '../api/currency.js'
import { httpTranslateText } from '../api/translate.js'
import { getCurrentTab } from '../utils/index.js'
import '../omnibox/index.js'

// 安装插件时就去获取汇率比率, 执行一次
httpGetCurrency().then(rateList => {
    chrome.storage.local.set({ rateList })
})

// 监听消息事件
chrome.runtime.onMessage.addListener(message => {
    switch (message.action) {
        case 'copy': sendToContent(message); break;
    }
})

function sendToContent (message) {
    getCurrentTab().then(tab => {
        tab && chrome.tabs.sendMessage(tab.id, message)
    })
}

// 创建上下文菜单
const contextMenus = [
    {
        id: 'translate',
        title: '翻译一下',
        contexts: ['selection'],
        children: [
            { id: 'en/zh', title: '英 -> 汉', contexts: ['selection'] },
            { id: 'zh/en', title: '汉 -> 英', contexts: ['selection'] },
            { id: 'jp/zh', title: '日 -> 中', contexts: ['selection'] },
            { id: 'zh/jp', title: '中 -> 日', contexts: ['selection'] }
        ]
    }
]

createMenus(contextMenus)

function createMenus (contextMenus, parentId = 0) {
    for (let menu of contextMenus) {
        const { id, title, contexts = ['page'], children = [] } = menu
        chrome.contextMenus.create(Object.assign({
            id,
            type: 'normal',
            title,
            contexts,
            documentUrlPatterns: ['<all_urls>']
        }, parentId ? { parentId } : {}))
        children.length && createMenus(children, id)
    }
}

// 监听上下文菜单项
chrome.contextMenus.onClicked.addListener((info, tab) => {
    const { parentMenuItemId, menuItemId, selectionText } = info
    if (parentMenuItemId === 'translate' && selectionText) {
        useTranslate(menuItemId, selectionText, tab)
    }
})

async function useTranslate (menuItemId, selectionText, tab) {
    // 打开弹窗的百度翻译
    // chrome.windows.create({
    //     url: `https://fanyi.baidu.com/#${menuItemId}/${selectionText}`,
    //     type: 'popup',
    //     top: 10,
    //     left: 5,
    //     width: 1270,
    //     height: 500
    // })
    const str = menuItemId.split('/')
    const result = await httpTranslateText(str[0] || 'en', str[1] || 'zh', selectionText)
    const { trans_result } = result
    chrome.tabs.sendMessage(tab.id, {
        action: 'translate',
        msg: trans_result || []
    })
    return true
}

// chrome.notifications.create('test', {
//     type: 'basic',
//     iconUrl: '../../public/images/icon-16.png',
//     title: '提示',
//     message: '该日志已经有记录了'
// })
