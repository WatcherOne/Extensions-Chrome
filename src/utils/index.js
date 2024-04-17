import { CHECK_LIST } from '../constant/index.js'

// 判断是否是金额类数据, 小数点4位
export const isNumbericCurrency = (value) => {
    return /^\d+(\.\d{1,4})?$/.test(value)
}

// 根据汇率比与金额换算出结果值
export const getExchangeValue = async (value, baseNation = 'CNY') => {
    const { rateList = {} } = await chrome.storage.local.get('rateList')
    const baseRate = rateList[baseNation]
    if (!baseRate) return []
    return CHECK_LIST.map(key => {
        const currRate = rateList[key] || 1
        const newValue = parseFloat((currRate / baseRate) * value).toFixed(2)
        return { key, value: newValue }
    })
}

// 获得当前页面
export const getCurrentTab = async () => {
    // 使用 lastFocusedWindow 还找不到当前标签页
    const queryOptions = { active: true, currentWindow: true }
    const [tab] = await chrome.tabs.query(queryOptions)
    return tab
}
