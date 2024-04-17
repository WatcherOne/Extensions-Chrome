import { NATION_LIST, NATION_OBJ } from '../constant/index.js'
import { isNumbericCurrency, getExchangeValue } from '../utils/index.js'

// 汇算计算格式: 金额 ?+ 国家
export const handleInputCurrency = async (text, suggest) => {
    const { isCurrency, value: baseValue, nation } = checkInputCurrency(text)
    if (!isCurrency) return false
    const result = await getExchangeValue(baseValue, nation)
    if (!result.length) return false
    const content = `${chrome.i18n.getMessage(nation)} ${baseValue}`
    const suggestList = result.map(item => {
        const { key, value } = item
        const unit = key.slice(0, 1).toLocaleLowerCase()
        const description = `${chrome.i18n.getMessage(key)} -${unit} ${value}`
        return { content: `${content} To ${chrome.i18n.getMessage(key)}`, description }
    })
    const params = [{ content, description: '汇率换算结果如下' }, ...suggestList]
    suggest(params)
    return true
}

function checkInputCurrency (text) {
    text = text.toLocaleLowerCase()
    const nationIndex = NATION_LIST.findLastIndex(na => text.includes(na))
    if (nationIndex === -1) {
        if (isNumbericCurrency(text)) {
            return { isCurrency: true, value: text, nation: 'CNY' }
        } else {
            return { isCurrency: false }
        }
    }
    const nationKey = NATION_LIST[nationIndex]
    const regex = new RegExp(nationKey, 'g')
    let value = text.replace(regex, '')
    value = value.trim()
    if (isNumbericCurrency(value)) {
        return { isCurrency: true, value, nation: NATION_OBJ[nationKey] }
    } else {
        return { isCurrency: false }
    }
}
