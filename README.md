# 百度翻译 (PopClip 插件)

![pop3](https://github.com/iibob/PopClipExtension/assets/10295975/44efa236-896d-4160-9751-19fa8beaae92)

<br>

### 功能：
|气泡展示译文|译文替换原文|
|---|---|
|![pop1](https://github.com/iibob/PopClipExtension/assets/10295975/1c1cc389-c287-4297-82e7-4e5496abdec7)|![pop2](https://github.com/iibob/PopClipExtension/assets/10295975/3bd54f6e-1857-4db1-9820-8a2f40bb4776)|
|自动中英互译|自动中英互译，并替换掉原文|
|支持识别命名风格：驼峰、大驼峰、蛇形、蛇形大写、串式|支持替换为默认、蛇形、驼峰命名风格|
<br>

### 选项：
![image](https://github.com/iibob/PopClipExtension/assets/10295975/408280aa-81bf-4195-9236-9fb97178d77d)
- APP ID 和密钥请前往 [百度翻译开放平台](https://api.fanyi.baidu.com/doc/21) 获取。
- 译文语言设置为 `自动检测` 时支持自动中英互译，设置为其他语言时不支持自动互译。
- 译文显示方式设置为 `全都要` 时支持显示两个图标，分别对应“展示译文”和“替换原文”的功能。
  - 选中的文本不可编辑时，会自动隐藏“替换原文”的图标。（此规则不适用于 Chrome ）
- 替换原文方式支持 `默认` `蛇形` `驼峰` 命名风格。
  - “蛇形”和“驼峰”选项仅支持英文的译文，否则直接替换，无命名风格。
  - 该选项不影响“气泡展示译文”的显示方式。

|替换原文方式|说明|修饰键|
|:---:|---|---|
|默认|使用译文替换原文|`Command (⌘)` 临时启用 **蛇形** 替换；<br/>`Option (⌥)`&emsp;临时启用 **驼峰** 替换。|
|蛇形|使用蛇形命名风格的译文替换原文|`Command (⌘)` 临时启用 **默认** 替换；<br/>`Option (⌥)`&emsp;临时启用 **驼峰** 替换。|
|驼峰|使用驼峰命名风格的译文替换原文|`Command (⌘)` 临时启用 **默认** 替换；<br/>`Option (⌥)`&emsp;临时启用 **蛇形** 替换。|
<br>

## 安装：
1. 确保已安装 [PopClip](https://www.popclip.app/)
2. 下载 `BaiduTranslate.popclipext` 后，鼠标双击安装
3. 在弹出的窗口中选择 `安装“百度翻译”`
4. 前往 [百度翻译开放平台](https://api.fanyi.baidu.com/doc/21) 获取 APP ID 和密钥
5. 在插件选项中填入 APP ID 和密钥，以及配置译文显示方式和替换方式
6. 开始愉快的使用吧
<br>

----
<details> <summary>更新日志</summary>

**2024年3月8日**
- 初代版本发布
</details>
<br>

# 命名风格转换 (PopClip 插件)
