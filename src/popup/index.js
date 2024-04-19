$(async function () {

    /*** 
    *  popup 弹窗页面
    *  1. 点击图标就会打开, 失去焦点就会关闭
    *  2. 强制关闭可以调用 window.close()
    */

    chrome.runtime.onMessage.addListener(async (message) => {
        if (message.action === 'popup-close') {
            window.close()
        } else if (message.action === 'picker-web') {
            setWebColors(message.colors || [])
        }
        return true
    })

    // 监听快捷键
    chrome.commands.onCommand.addListener(command => {
        console.log(command)
    })

    const { isSync } = await chrome.storage.sync.get('isSync')
    const namspace = isSync ? 'sync' : 'local'
    const { showLowercase, autoCopy, colorFormat } = await chrome.storage[namspace].get()
    $('#hex').val(showLowercase ? 'ffffff' : 'FFFFFF')
    
    // 颜色拾取触发内容脚本事件
    // 应向background通知总事件, 事件回调等逻辑应该在background中执行操作
    // popup进程是跟弹窗出现有关的, 生命周期很短

    const $panel = $('.js-main-wrapper')
    const $pickerPanel = $('#color-picker-panel')
    const $historyPanel = $('#color-records-panel')
    const $webPanel = $('#color-web-panel')

    $('#openPicker').on('click', openPicker)
    $('#openRecord').on('click', openRecord)
    $('#setting').on('click', openSetting)

    function openSetting () {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage()
        } else {
            window.open(chrome.runtime.getURL('src/options/index.html'))
        }
    }

    /******************************************************************************
     *  颜色识别提取器
    *******************************************************************************/
    async function openPicker () {
        if (!window.EyeDropper) {
            alert('你的浏览器不支持 EyeDropper API')
            return
        }
        new EyeDropper().open().then(async ({ sRGBHex }) => {
            await savePickerColor(sRGBHex)
            autoCopy && copyContent(sRGBHex)
            window.close()
        }).catch(e => {
            console.log(e)
        })
    }

    async function savePickerColor (value) {
        let { pickerColorList } = await chrome.storage.local.get('pickerColorList')
        pickerColorList = pickerColorList ? [...pickerColorList, value] : [value]
        await chrome.storage.local.set({ pickerColorList })
    }

    /******************************************************************************
     *  颜色历史模块
    *******************************************************************************/
    const $recordBox = $('#color-records-box')
    const $selectedColor = $('#selected-color')
    // 先增加历史box
    let contentBox = ''
    const total = 60
    for (let i = 0; i < total; i++) {
        contentBox += `<div class="color-item"></div>`
    }
    $recordBox.append($(contentBox))

    async function openRecord () {
        const { pickerColorList = [] } = await chrome.storage.local.get('pickerColorList')
        showPanel($historyPanel)
        $.each($recordBox.children(), (index, el) => {
            const color = pickerColorList[index]
            if (!color) {
                return false
            }
            $(el).data('color', color)
            $(el).css({
                'background-color': color,
                'cursor': 'pointer'
            })
        })
        $recordBox.on('click', e => {
            const target = e.target
            const color = $(target).data('color')
            color && handleSelectColor(color)
        })
        $('#confirm').on('click', confirmColor)
        $('#cancel').on('click', () => showPanel($pickerPanel))
        $('#clear').on('click', clearColor)
    }

    function confirmColor () {
        const color = $selectedColor.data('color')
        color && copyContent(color)
        window.close()
    }

    async function clearColor () {
        await chrome.storage.local.set({ pickerColorList: [] })
        // 清除每一个模块的颜色
        $.each($recordBox.children(), (_, el) => {
            if ($(el).data('color')) {
                $(el).data('color', '')
                $(el).css({
                    'background-color': '',
                    'cursor': 'not-allowed'
                })
            } else {
                return false
            }
        })
        clearSelectColor()
    }

    function handleSelectColor (color) {
        $selectedColor.data('color', color)
        $selectedColor.css('background-color', color)
        const { r, g, b } = convertToRgb(color)
        const { h, s, l } = convertToHsl(r, g, b)
        $('#hsl').val(`${h}, ${s}%, ${l}%`)
        $('#rgb').val(`${r}, ${g}, ${b}`)
        color = color.replace(/#/g, '')
        $('#hex').val(showLowercase ? color.toLocaleLowerCase() : color.toLocaleUpperCase())
    }

    function clearSelectColor () {
        $selectedColor.data('color', '')
        $selectedColor.css('background-color', 'transparent')
        $('#hsl').val(`0, 0%, 100%`)
        $('#rgb').val(`255, 255, 255`)
        $('#hex').val(showLowercase ? 'ffffff' : 'FFFFFF')
    }

    /******************************************************************************
     *  网页颜色分析器
    *******************************************************************************/
    $('#webPicker').on('click', openWebPanel)
    
    const $webBox = $('#web-colors-box')
    const $webSelectedColor = $('#web-select-color')

    async function openWebPanel () {
        showPanel($webPanel)
        $webSelectedColor.html('')
        const queryOptions = { active: true, currentWindow: true }
        const [tab] = await chrome.tabs.query(queryOptions)
        chrome.tabs.sendMessage(tab.id, { action: 'picker-web' })
    }

    function setWebColors (colors) {
        let contentBox = ''
        colors.forEach(color => {
            contentBox += `<div class="web-color-item" data-color="${color}" style="background-color:${color}"></div>`
        })
        $webBox.html('')
        $webBox.append($(contentBox))
        $webBox.on('click', e => {
            const target = e.target
            const color = $(target).data('color')
            color && $webSelectedColor.html(color)
        })
        $('#web-confirm').on('click', () => {
            const color = $webSelectedColor.html()
            color && copyContent(color, true)
            window.close()
        })
        $('#web-cancel').on('click', () => showPanel($pickerPanel))
    }

    /**********
     * 方法
     */
    function convertToRgb (color) {
        // 带有 ‘#’ 的 hex
        let r = 0, g = 0, b = 0
        if (color.length === 4) {
            r = parseInt(color.slice(1, 2), 16)
            g = parseInt(color.slice(2, 3), 16)
            b = parseInt(color.slice(3, 4), 16)
            r = r + r * 16 / 256
            g = g + g * 16 / 256
            b = b + b * 16 / 256
        } else if (color.length === 7) {
            r = parseInt(color.slice(1, 3), 16)
            g = parseInt(color.slice(3, 5), 16)
            b = parseInt(color.slice(5, 7), 16)
        }
        return { r, g, b }
    }

    function convertToHsl (r, g, b) {
        r /= 255, g /= 255, b /= 255
        const max = Math.max(r, g, b), min = Math.min(r, g, b)
        let h = 0, s = 0, l = (max + min) / 2
       
        if (max == min) {
            h = s = 0
        } else {
            const d = max - min
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6
        }
        return { h: Math.floor(h * 360), s: Math.floor(s * 100), l: Math.floor(l * 100) }
    }

    function showPanel ($curr) {
        $panel.each((_, $el) => $el.classList.add('hide'))
        $curr.removeClass('hide')
    }

    function handleColorText (text) {
        text = showLowercase ? text.toLocaleLowerCase() : text.toLocaleUpperCase()
        if (colorFormat === 'rrggbb') {
            text = replace(/#/g, '')
        } else if (colorFormat === 'rgb') {
            const { r, g, b } = convertToRgb(text)
            text = `rgb(${r}, ${g}, ${b})`
        } else if (colorFormat === 'hsl') {
            const { r, g, b } = convertToRgb(text)
            const { h, s, l } = convertToHsl(r, g, b)
            text = `hsl(${h}, ${s}%, ${l}%)`
        }
        return text
    }

    async function copyContent (text, direction = false) {
        text = direction ? text : handleColorText(text)
        const $div = document.createElement('input')
        $div.style.cssText = 'position:absolute;top:-1000px;left:-1000px;'
        $div.value = text
        $div.setAttribute('readonly', 'readonly')
        document.querySelector('body').appendChild($div)
        $div.select()
        document.execCommand('copy')
        $div.remove()
        // copy 完数据后进行消息通知
        chrome.runtime.sendMessage({ action: 'copy', msg: text })
    }
})
