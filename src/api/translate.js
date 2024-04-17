import { http } from './index.js'
import { MD5 } from '../../public/js/md5.js'

export const httpTranslateText = async (query) => {
    return new Promise(resolve => {
        const url = 'http://api.fanyi.baidu.com/api/trans/vip/translate'
        const salt = getRandom10()
        const appid = '20230410001636166'
        const sign = MD5(`${appid}${query}${salt}TrDSFSkhp4_M2yGw3GE5`)
        const params = `${url}?q=${query}&from=en&to=zh&appid=${appid}&salt=${salt}&sign=${sign}`
        console.log(params)
        http.get({
            url: params,
        }).then(res => res.json()).then(res => {
            resolve(res)
        }).catch(() => {
            resolve({})
        })
    })
}

function getRandom10 () {
    return Math.floor(Math.random() * 9000000000) + 1000000000
}
