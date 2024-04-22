window.onload = () => {
    // 监听扩展程序发来的消息
    chrome.runtime.onMessage.addListener((message) => {
        const { action, msg } = message
        if (action === 'copy') {
            msg && sendNotification(`已复制颜色: ${msg}`)
        } else if (action === 'picker-web') {
            const colors = getWebColors()
            chrome.runtime.sendMessage({ action: 'picker-web', colors })
        } else if (action === 'translate') {
            showTranslate(message.msg)
        }
    })

    function getWebColors () {
        const allElements = document.getElementsByTagName('*')
        const colors = {}

        Array.from(allElements).forEach(element => {
            const style = window.getComputedStyle(element)
            const color = style.getPropertyValue('color')
            const backgroundColor = style.getPropertyValue('background-color')
            if (color !== 'rgba(0, 0, 0, 0)' && !colors[color]) {
                colors[color] = true
            }
            if (backgroundColor !== 'rgba(0, 0, 0, 0)' && !colors[backgroundColor]) {
                colors[backgroundColor] = true
            }
        })

        // 获取CSS变量值
        const root = document.documentElement
        const cssVariables = getAllCssVariables(root)
        Object.keys(cssVariables).forEach(variable => {
            colors[cssVariables[variable]] = true
        })
        return Object.keys(colors)
    }
       
    function getAllCssVariables (element) {
        const variables = {}
        const style = window.getComputedStyle(element)
       
        Array.from(style).forEach(prop => {
            if (prop.startsWith('--')) {
                variables[prop] = style.getPropertyValue(prop).trim()
            }
        })
        return variables
    }

    function sendNotification (msg) {
        const $div = document.createElement('div')
        $div.classList.add('watcher-notification-box')
        $div.innerHTML = msg
        document.body.appendChild($div)
        setTimeout(() => {
            $div.remove()
        }, 2000)
    }

    let mouseX = 0
    let mouseY = 0
    document.addEventListener('mousemove', (event) => {
        mouseX = event.pageX
        mouseY = event.pageY
    })

    function showTranslate (contentArr) {
        const $div = document.createElement('div')
        $div.classList.add('watcher-translate-box')
        $div.style.left = `${mouseX + 20}px`
        $div.style.top = `${mouseY + 20}px`
        let result = ''
        const length = contentArr.length
        contentArr.forEach((item, index) => {
            result += `${length > 1 ? `${index + 1}: ` : ''}${item.dst}<br/>`
        })
        $div.innerHTML = result
        document.body.appendChild($div)
        setTimeout(() => {
            $div.remove()
        }, 2000)
    }
}
