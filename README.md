### chrome 插件（Manifest V3）

#### 功能说明

1. 网页颜色提取器, 可以选择提取网页颜色并自动复制
2. 在地址栏输入 w. + 空格 进入多功能框, 输入纯数字可以进行汇率的换算
3. 可以提取网页所有颜色的分析并复制
4. 可以展示所有提取过的颜色
5. 可以将选择的文本直接进行翻译

#### 文件结构

| manifest.json
|-_locales
|  |-en
|      messages.json
|  |-zh_CN
|      messages.json
|-public
|  |-images                   // 存放一些静态Images文件
|      icon-16.png
|      icon-32.png
|      icon-48.png
|      icon-128.png
|  |-js                       // 存放一些静态JS文件
|      jquery-3.6.0.min.js
|      md5.js
|-src
|  |-api         // 访问外网API接口
|  |-backgroud   // service_worker
|  |-constant    // 静态变量
|  |-content     // 内容脚本JS/CSS文件
|  |-omnibox     // 多功能框
|  |-options     // 选项配置HTML/JS/CSS文件
|  |-popup       // 弹窗配置HTML/JS/CSS文件
|  |-styles      // 共通CSS
|  |-utils       // 共通方法

#### 参考文档

[官方chrome查询API](https://developer.chrome.com/docs/extensions/reference/api?hl=zh-cn)

#### 参考文章

[清单<manifest.json>详细说明](https://juejin.cn/post/7357917500962848778)
[omnibox使用说明](https://juejin.cn/post/7358083295240798258)
[常用Chrome-API](https://juejin.cn/post/7358458856039989275)

#### 报错问题

> Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.

- 大概意思就是接收端没有链接上, 可能接收端已关闭
- 但主要还是tab标签对应的内容脚本端, 不太可能说已关闭啊
- 经过不断改动, 发现本地开发刷新扩展程序时需要`重新加载测试页面`

#### Todo

- chrome.alarms   // 设置定时闹钟 alarms 去实时更新汇率
- notifications   // 增加系统的通知
