本仓库包含两款 PopClip 插件：[🚀 百度翻译](#百度翻译-popclip-插件) &emsp;[🚀 命名风格转换](#命名风格转换-popclip-插件)

<br>

# 百度翻译 (PopClip 插件)

![pop3](https://github.com/iibob/PopClipExtension/assets/10295975/44efa236-896d-4160-9751-19fa8beaae92)

<br>

## 功能：
|气泡展示译文|译文替换原文|
|---|---|
|![pop1](https://github.com/iibob/PopClipExtension/assets/10295975/1c1cc389-c287-4297-82e7-4e5496abdec7)|![pop2](https://github.com/iibob/PopClipExtension/assets/10295975/3bd54f6e-1857-4db1-9820-8a2f40bb4776)|
|自动中英互译|自动中英互译，并替换掉原文|
|支持识别命名风格：驼峰、大驼峰、蛇形、蛇形大写、串式|支持替换为默认、蛇形、驼峰命名风格|
<br>

## 选项：
![image](https://github.com/iibob/PopClipExtension/assets/10295975/408280aa-81bf-4195-9236-9fb97178d77d)
- APP ID 和密钥请前往 [百度翻译开放平台](https://api.fanyi.baidu.com/doc/21) 获取。
- 译文语言设置为 `自动检测` 时支持自动中英互译，设置为其他语言时不支持自动互译。
- 译文显示方式设置为 `全都要` 时支持显示两个图标，分别对应“展示译文”和“替换原文”的功能。
  - 选中的文本不可编辑时，会自动隐藏“替换原文”的图标。（此规则不适用于 Chrome ）
- 替换原文方式支持 `默认` `蛇形` `驼峰` 命名风格。
  - “蛇形”和“驼峰”选项仅支持**原文不包含换行**且**译文为英文**时，否则直接使用默认译文替换，无命名风格。
  - 该选项不影响“气泡展示译文”的显示方式。

|替换原文方式|说明|修饰键|
|:---:|---|---|
|默认|使用译文替换原文|`Command (⌘)` 临时启用 **蛇形** 替换；<br>`Option (⌥)`&emsp;临时启用 **驼峰** 替换。|
|蛇形|使用蛇形命名风格的译文替换原文|`Command (⌘)` 临时启用 **默认** 替换；<br>`Option (⌥)`&emsp;临时启用 **驼峰** 替换。|
|驼峰|使用驼峰命名风格的译文替换原文|`Command (⌘)` 临时启用 **默认** 替换；<br>`Option (⌥)`&emsp;临时启用 **蛇形** 替换。|
<br>

**设置指定应用程序禁用/使用：**
1. 鼠标右键点击 `BaiduTranslate.popclipext`，选择 `显示包内容`
2. 打开 `translate.js`
3. [获取程序的 BundleIdentifier](#user-content-获取-bundleidentifier) 填入 `apps` 数组中
4. 取消注释 `excludedApps: apps,`（表示在指定应用程序中禁用某一功能）或者 `requiredApps: apps,`（表示仅在指定应用程序中启用某一功能）
5. 保存代码后安装插件

```JavaScript
const apps = ["com.apple.dt.Xcode", "com.microsoft.VSCode"];

// 导出操作
exports.actions = [{
    title: "翻译",
    requirements: ["option-display_method=1"],
    code: display_translate,
    icon: "translate.svg"
}, {
    title: "翻译并替换",
    requirements: ["option-display_method=2", "paste"],
    code: translate_and_replace,
    // excludedApps: apps,
    // requiredApps: apps,
    icon: "coding_cases.svg"
}, {
    title: "翻译",
    requirements: ["option-display_method=3"],
    code: display_translate,
    icon: "translate.svg"
}, {
    title: "翻译并替换",
    requirements: ["option-display_method=3", "paste"],
    code: translate_and_replace,
    // excludedApps: apps,
    // requiredApps: apps,
    icon: "coding_cases.svg"
}];
```
<br>

## 安装：
1. 确保已安装 [PopClip](https://www.popclip.app/)
2. 下载 `BaiduTranslate.popclipext` 后，鼠标双击安装
3. 在弹出的窗口中选择 `安装“百度翻译”`
4. 前往 [百度翻译开放平台](https://api.fanyi.baidu.com/doc/21) 获取 APP ID 和密钥
5. 在插件选项中填入 APP ID 和密钥，以及配置译文显示方式和替换方式
6. 开始愉快的使用吧
<br>

## 更新日志：
<details><summary>点击打开</summary>

**2024年3月13日**
- 优化具有命名风格文本的识别和转换逻辑

**2024年3月8日**
- 初代版本发布
</details>
<br>

# 命名风格转换 (PopClip 插件)

|命名风格转换|文本转换|
|---|---|
|![gif01](https://github.com/iibob/PopClipExtension/assets/10295975/099f1577-3196-4ac2-9643-14576aa3b8af)|![gif02](https://github.com/iibob/PopClipExtension/assets/10295975/a1202b04-0631-4384-a74a-f3d3642cc0c1)
|支持驼峰、大驼峰、蛇形、蛇形大写、串式命名风格相互转换<br><br>自动隐藏原有命名风格的图标|兼容其他类型的文本|
<br>

|以下情况会自动隐藏插件图标|
|---|
|文本包含换行|
|单个字母、单词的文本|
|仅由数字（含小数 负数）、标点符号、空格组成的文本，以及仅由它们所有组合方式组成的文本|
|不是仅由`英文`、`数字`、`英文标点符号`、`空格`的所有组合方式组成的文本（上一行情况除外）|
<br>

## 选项：
![image](https://github.com/iibob/PopClipExtension/assets/10295975/63bdac58-48af-43b8-a2c2-a126cbaf48f9)
- 勾选风格名称表示启用，即在 PopClip 上展示对应的图标
- 若仅在指定应用程序中使用插件，可在 `生效的应用` 栏填写应用程序的 BundleIdentifier
  - [获取 BundleIdentifier](#user-content-获取-bundleidentifier)
  - 填写多个使用空格隔开
  - 此项留空代表插件对所有应用程序生效
<br>

## 安装：
1. 确保已安装 [PopClip](https://www.popclip.app/)
2. 下载 `CodingCases.popclipext` 后，鼠标双击安装
3. 在弹出的窗口中选择 `安装“Coding Cases”`
5. 配置插件选项
6. 开始愉快的使用吧
<br>

## 更新日志：
<details><summary>点击打开</summary>

**2024年3月13日**
- 初代版本发布
</details>
<br>

## 获取 BundleIdentifier：
**方法1：**
1. 打开访达，进入 `应用程序` 文件夹
2. 找到你想要查找的应用程序，鼠标右键点击应用程序图标，选择 `显示包内容`
3. 进入 `Contents` 目录，使用 `文本编辑` 打开 `Info.plist` 文件
4. 搜索 `CFBundleIdentifier`，其下一行即为 BundleIdentifier
   >例如下一行内容为 `<string>com.google.Chrome</string>`，去掉一对尖括号即为结果。
<br>

**方法2：**
1. 打开 `终端`，输入以下命令（注意 -raw 后面有个空格）
   ```
   mdls -name kMDItemCFBundleIdentifier -raw 
   ```
3. 在访达的 `应用程序` 文件夹找到你想要查找的应用程序
4. 将应用程序图标拖入终端，然后按下 enter 键，即可得到 BundleIdentifier
   >例如终端返回了 `com.google.Chrome%`，去掉百分号即为结果。


