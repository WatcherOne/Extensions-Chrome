import { httpGetCurrency } from '../http/currency.js'
import './omnibox/index.js'

// 安装插件时就去获取汇率比率, 执行一次
httpGetCurrency().then(rateList => {
    chrome.storage.local.set({ rateList })
})
// Todo: 设置定时闹钟 alarms 去实时更新汇率

// 创建上下文菜单
const contextMenus = [
    {
        id: 'addLog',
        title: '添加日志'
    },
    {
        id: 'translate',
        title: '百度翻译',
        contexts: ['selection'],
        children: [
            { id: 'zh/en', title: '汉 -> 英', contexts: ['selection'] },
            { id: 'en/zh', title: '英 -> 汉', contexts: ['selection'] },
            { id: 'zh/jp', title: '中 -> 日', contexts: ['selection'] },
            { id: 'jp/zh', title: '日 -> 中', contexts: ['selection'] }
        ]
    },
    {
        id: 'play',
        title: '语音朗读'
    }
]

// 创建上下文时, 需要在 permissions 中配置权限: ["contextMenus"]
function createMenus (contextMenus, parentId = 0) {
    for (let menu of contextMenus) {
        const { id, title, contexts = ['page'], children = [] } = menu
        chrome.contextMenus.create(Object.assign({
            id,
            type: 'normal',
            title,
            contexts,   // 右键点击选中文字时显示;'selection': 表示选中才会有 'page': 表示页面右键就会有
            documentUrlPatterns: ['<all_urls>'] // 限制菜单选项仅应用于URL匹配给定模式之一的页面'
        }, parentId ? { parentId } : {}))
        children.length && createMenus(children, id)
    }
}

// V3 后只能用这种方式监听, 不能配置绑定onclick
// chrome.contextMenus.onClicked.addListener((info, tab) => {
//     const { parentMenuItemId, menuItemId, selectionText } = info
//     if (parentMenuItemId === 'translate' && selectionText) {
        // chrome.windows.create({
        //     url: `https://fanyi.baidu.com/#${menuItemId}/${selectionText}`,
        //     type: "popup",
        //     top: 10,
        //     left: 5,
        //     width: 1270,
        //     height: 500
        // })
        // chrome.notifications.create("haveRepeated", {
        //     type: "basic",
        //     iconUrl: "../images/icon-16.png",
        //     title: "提示",
        //     message: "该日志已经有记录了",
        // })
        
        // const str = menuItemId.split('/')
        // const from = str[0]
        // const to = str[1]
        // http.get({
        //     url: 'https://fanyi.baidu.com/v2transapi',
        //     param: { from, to },
        //     data: {
        //         from,
        //         to,
        //         query: selectionText,
        //         transtype: 'translang',
        //         domain: 'comman'
        //     }
        // }).then(res => {
        //     console.log(res)
        // })
//         chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//             chrome.tabs.sendMessage(tabs[0].id, {
//                 todo: 'closeModal'
//             })
//         })
        
//         // $(mask).appendTo(document.body);
//         // $(addLogModal).appendTo(document.body);
//         // $("#mask").click(closeAddLogModal);
//         // $("#save").click(onSave);
//     }
// })

// 创建上下文
// createMenus(contextMenus)

//**
// chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     // 向当前打开的标签页发送添加日志的消息
//     chrome.tabs.sendMessage(tabs[0].id, {
//         todo: "addLog",
//         data: info.selectionText,
//     });
// });


// 监听content_scripts页面发来的消息
chrome.runtime.onMessage.addListener((request) => {
    console.log("接收到content_scripts消息：", request);
    // if (request.todo === "saveLog") {
    //     saveLog(request.data);
    // }
    const from = 'zh'
    const to = 'en'
    const selectionText = '测试数据'
    fetch('https://fanyi-api.baidu.com/api/trans/vip/translate')
    // http.get({
    //     url: 'https://fanyi.baidu.com/v2transapi',
    //     param: { from, to },
    //     data: {
    //         from,
    //         to,
    //         query: selectionText,
    //         transtype: 'translang',
    //         domain: 'comman'
    //     }
    // }).then(res => {
    //     console.log(res)
    // })
})

// // 监听系统消息通知的按钮点击事件
// chrome.notifications.onButtonClicked.addListener((notificationId) => {
//     switch (notificationId) {
//         case "overTheLimit":
//             // 打开选项设置页
//             chrome.runtime.openOptionsPage();
//             break;
//         default:
//             break;
//     }
// });

// 保存日志
function saveLog(inputText) {
    if (inputText) {
        // 获取存储的数据
        chrome.storage.sync.get(["logs", "limitLogsNum"]).then((data) => {
            let newLogs = [];
            if (data?.logs) {
                const { logs, limitLogsNum = 3 } = data;
                if (logs.includes(inputText)) {
                    // 创建并发出一个系统消息通知
                    chrome.notifications.create("haveRepeated", {
                        type: "basic",
                        iconUrl: "../images/icon.png",
                        title: "提示",
                        message: "该日志已经有记录了",
                    });
                    return;
                } else {
                    if (logs.length >= limitLogsNum) {
                        chrome.notifications.create("overTheLimit", {
                            type: "basic",
                            iconUrl: "../images/icon.png",
                            title: "提示",
                            message: "超出了限制个数，您可以在选项设置页面修改限制个数",
                            buttons: [{ title: "打开选项设置" }],
                        });
                        return;
                    } else {
                        newLogs = [inputText, ...logs];
                    }
                }
            } else {
                newLogs = [inputText];
            }
            // 保存数据
            chrome.storage.sync.set({ logs: newLogs }).then(() => {
                // 查询当前打开的标签页
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    // 向当前打开的标签页发送关闭弹窗的消息
                    chrome.tabs.sendMessage(tabs[0].id, {
                        todo: "closeModal",
                    });
                });
                chrome.notifications.create("saveSuccess", {
                    type: "basic",
                    iconUrl: "../images/icon.png",
                    title: "提示",
                    message: "保存成功",
                });
                // 更改插件图标上徽标文字
                chrome.action.setBadgeText({ text: newLogs.length.toString() });
            });
        });
    }
}
