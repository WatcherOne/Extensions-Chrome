// 初始化获取数据
window.onload = async () => {
    const $showLowercase = document.getElementById('show-lowercase')
    const $autoCopy = document.getElementById('auto-copy')
    const $isSync = document.getElementById('is-sync')
    const $save = document.getElementById('save')
    const $result = document.getElementById('tips')

    $save.addEventListener('click', saveOptions)

    const { isSync } = await chrome.storage.sync.get('isSync')
    const namspace = isSync ? 'sync' : 'local'
    $isSync.checked = isSync
    const { showLowercase, autoCopy } = await chrome.storage[namspace].get()
    $showLowercase.checked = showLowercase || false
    $autoCopy.checked = autoCopy || false

    // 保存设置
    async function saveOptions () {
        const showLowercase = $showLowercase.checked
        const autoCopy = $autoCopy.checked
        const isSync = $isSync.checked
        const options = { showLowercase, autoCopy }
        await chrome.storage.sync.set({ isSync })
        const namspace = isSync ? 'sync' : 'local'
        await chrome.storage[namspace].set(options)
        $result.innerHTML = '保存成功'
        setTimeout(() => ($result.innerHTML = ''), 1500)
    }
}


