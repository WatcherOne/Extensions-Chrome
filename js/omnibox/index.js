/***********************
 * 配置 ominbox
 * 参考文档: https://developer.chrome.com/docs/extensions/reference/api/omnibox?hl=zh-cn
 * 需要在清单中配置 { "ominbox": { "keyword": "xxxx" } }
************************/
import { handleInputCurrency } from './currency.js'

// 设置首行建议
chrome.omnibox.setDefaultSuggestion({
    description: chrome.i18n.getMessage('welcomeOmnibox')
})

// 监听输入
chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
    text = text.trim()
    if (!text) return ''
    if (handleInputCurrency(text, suggest)) return
    if (text === '学科') {
        suggest([
            { content: '语言', description: '你要学习中文吗？', deletable: true },
            { content: '数学', description: '1 + 1 = ?' },
            { content: '体育', description: '走, 我们一起去泡澡' },
            { content: '电脑', description: '让我们写一个bug吧!1' }
        ])
    }
})
