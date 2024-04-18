// 初始化获取数据
window.onload = async () => {
    const $showLowercase = document.getElementById('show-lowercase')
    const $colorFormat = document.getElementById('select-format')
    const $autoCopy = document.getElementById('auto-copy')
    const $isSync = document.getElementById('is-sync')
    const $save = document.getElementById('save')
    const $result = document.getElementById('tips')

    $save.addEventListener('click', saveOptions)

    const { isSync } = await chrome.storage.sync.get('isSync')
    const namspace = isSync ? 'sync' : 'local'
    $isSync.checked = isSync
    const { showLowercase, autoCopy, colorFormat } = await chrome.storage[namspace].get()
    $showLowercase.checked = showLowercase || false
    $autoCopy.checked = autoCopy || false
    $colorFormat.value = colorFormat || '#rrggbb'
    changeOptionsCase(showLowercase)

    function changeOptionsCase (checked) {
        document.getElementById('mark-option').innerText = checked ? '#rrggbb' : '#RRGGBB'
        document.getElementById('no-mark-option').innerText = checked ? 'rrggbb' : 'RRGGBB'
    }

    $showLowercase.addEventListener('change', (e) => {
        changeOptionsCase(e.target.checked)
    })

    // 保存设置
    async function saveOptions () {
        const showLowercase = $showLowercase.checked
        const autoCopy = $autoCopy.checked
        const isSync = $isSync.checked
        const colorFormat = $colorFormat.value
        const options = { showLowercase, autoCopy, colorFormat }
        await chrome.storage.sync.set({ isSync })
        const namspace = isSync ? 'sync' : 'local'
        await chrome.storage[namspace].set(options)
        $result.innerHTML = '保存成功'
        setTimeout(() => ($result.innerHTML = ''), 1500)
    }
}
