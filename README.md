### chrome 插件（Manifest V3）

- 文件结构

| manifest.json
|-html
|   index.html
|-images
|   icon-16.png
|   icon-32.png
|   icon-48.png
|   icon-128.png
|-scripts
|   background.js
|-styles
|   main.css
|-_locales
   |-en
   |   messages.json
   |-zh_CN
       messages.json

<table>
    <thead>
        <tr>
            <td :colspan="2">manifest.json 属性说明</td>
        </tr>
    <thead>
    <tbody>
        <tr>
            <td><span style="color:red">*</span>manifest_version</td>
            <td>标明当前插件对应 Manifest V3 版本, 支持值为3</td>
        </tr>
        <tr>
            <td><span style="color:red">*</span>name</td>
            <td>插件名称</td>
        </tr>
        <tr>
            <td><span style="color:red">*</span>version</td>
            <td>版本, 如：1.0.0</td>
        </tr>
        <tr>
            <td>description</td>
            <td>描述扩展</td>
        </tr>
        <tr>
            <td>description</td>
            <td>描述扩展</td>
        </tr>
        <tr>
            <td>default_locale</td>
            <td>默认语言环境, 当配置时, 对应目录 _locales 是必需的</td>
        </tr>
        <tr>
            <td>icons</td>
            <td>
                {
                    "16": "images/icon-16.png",
                    "32": "images/icon-23.png",
                    "48": "images/icon-48.png",
                    "128": "images/icon-128.png"
                }
                代表扩展或主题的一个或多个图标. 应该始终提供 128*128 的图标, 还应提供 48*48 用于扩展程序管理页面
                图标一般应该是PNG格式, 因为PNG对透明度的支持最好（不支持 WebP 和 SVG 文件）
            </td>
        </tr>
        <tr>
            <td>author</td>
            <td>
                "watcher" / { "email": "286154864@qq.com" }
            </td>
        </tr>
        <tr>
            <td>content_scripts</td>
            <td>
                [
                    {
                        "matches": ["https://"],   // 必需的, 指定此内容脚本将被注入到哪些页面, "<all_urls>": 表示匹配所有地址
                        "js": ["background.js"],   // 注入匹配页面的 JavaScript 文件, 按此顺序注入
                        "css": ["main.css"],       // 注入匹配页面的 CSS 文件, 按此顺序注入
                        "run_at":                  // 指定何时应将脚本注入页面, 默认 "document_idle" / document_start / document_end
                    }
                ]
            </td>
        </tr>
        <tr>
            <td>action</td>
            <td>
                {
                    "default_title": "all in plugin"
                    "default_popup": "popup.html"
                }
                chrome.actionAPI 控制 Google Chrome 工具栏中的扩展程序图标
            </td>
        </tr>
        <tr>
            <td>background</td>
            <td>
                {
                    "service_worker": "background.js",
                    "type": "module"  // 将服务工作者作为 ES 模块
                }
                它随着浏览器的打开而打开，随着浏览器的关闭而关闭，所以通常把需要一直运行的、启动就运行的、全局的代码放在background里面
                background的权限非常高，几乎可以调用所有的Chrome扩展API
                扩展在字段下的清单中注册他们的服务工作者, 指定单个JS文件的键
            </td>
        </tr>
        <tr>
            <td>commands</td>
            <td>{} 使用命令 API 添加触发扩展中操作的键盘快捷键</td>
        </tr>
    </tbody>
</table>

- 参考文档
[https://blog.csdn.net/Primary_wind/article/details/128053613]
