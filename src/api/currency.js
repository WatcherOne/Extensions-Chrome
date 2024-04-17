import { http } from './index.js'

// 汇率换算API地址: https://app.exchangerate-api.com/dashboard
// 获得汇率比值
export const httpGetCurrency = async () => {
    return new Promise(resolve => {
        http.get({
            url: 'https://v6.exchangerate-api.com/v6/7632f2913050abb48a895553/latest/USD'
        }).then(res => res.json()).then(res => {
            const { result, conversion_rates } = res
            if (result === 'success') {
                resolve(conversion_rates)
            } else {
                resolve({})
            }
        }).catch(() => {
            resolve({})
        })
    })
}
