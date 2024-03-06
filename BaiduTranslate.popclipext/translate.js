"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const axios_1 = require("axios");


// 气泡展示译文
const display_translate = async (input, options) => {
    const appid = options.appid;
    const key = options.key;
    const str1 = convertString(input.text);
    const to = options.translate_target_language;

    try {
        const result = await translate(appid, key, str1, to);
        if (result.status === "success") {
            popclip.showText(result.result.data.trans_result[0].dst);
        } else if (result.status === "fail") {
            popclip.showText(result.errorCode);
        } else {
            popclip.showText(result.error);
        }
    } catch (error) {
        popclip.showFailure();
    }
};

// 译文替换原文
const translate_and_replace = async (input, options) => {
    const appid = options.appid;
    const key = options.key;
    const str1 = convertString(input.text);
    const to = options.translate_target_language;

    try {
        const result = await translate(appid, key, str1, to);
        if (result.status === "success") {
            const translatedText = result.result.data.trans_result[0].dst;
            if (result.result.data.to === "en") {
                if (options.replacement_method === "1") {
                    popclip.pasteText(translatedText);
                } else if (options.replacement_method === "2") {
                    popclip.pasteText(toSnakeCase(translatedText));
                } else if (options.replacement_method === "3") {
                    popclip.pasteText(toCamelCase(translatedText));
                }
            } else {
                popclip.pasteText(translatedText);
            }
        } else if (result.status === "fail") {
            popclip.showText(result.errorCode);
        } else {
            popclip.showText(result.error);
        }
    } catch (error) {
        popclip.showFailure();
    }
};

// 翻译字符串
const translate = async (appid, key, str1, to) => {
    const salt = (new Date).getTime();
    const str2 = appid + str1 + salt + key;
    const sign = MD5(str2);

    // 构建请求参数
    const params = {
        q: str1,
        appid: appid,
        salt: salt,
        from: 'auto',
        to: to,
        sign: sign
    };

    try {
        const response = await axios_1.default.get('https://fanyi-api.baidu.com/api/trans/vip/translate', { params, timeout: 10000 });

        if (response.data.trans_result) {
            return { status: "success", result: response };
            // popclip.showText(response.data.trans_result[0].dst);
        } else {
            const errorCode = response.data.error_code;
            const errorMsg = response.data.error_msg;
            return { status: "fail", errorCode: `翻译失败，错误码: ${errorCode}, 错误信息: ${errorMsg}` };
            // popclip.showText(`翻译出错，错误码: ${errorCode}, 错误信息: ${errorMsg}`);
        }
    } catch (error) {
        return { status: "fault", error: `故障: ${error.message || '发生了错误'}` };
        // popclip.showText(`故障: ${error.message || '发生了一些错误'}`);
    }
};


const apps = ["com.apple.Safari"]

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
    // requiredApps: apps,
    icon: "coding_cases.svg"
}];


// 若字符串为蛇形或驼峰格式则会去除相应格式，无格式字符串则不受影响。
function convertString(str) {
    // 检查字符串是否只由大写字母和小写字母组成，或者由大写字母、小写字母和数字组成
    const validChars = /^[A-Za-z]+$|^[A-Za-z0-9]+$/;

    // 检查字符串前方大写字母数量是否至少为两个
    const uppercaseCount = str.match(/^[A-Z]{2,}/)?.[0].length || 0;

    // 检查字符串是否包含至少一个小写字母
    const hasLowercase = /[a-z]/.test(str);

    if (validChars.test(str) && uppercaseCount >= 2 && hasLowercase) {
        // 使用正则匹配字符串，并替换：在大写字母后方有小写字母的组合的前方加空格、在一个或多个数字前后加空格、在至少两个连续的大写字母前后加空格、去除字符串首尾的空格、连续两个或更多空格替换为一个空格。
        // 如：MKCoordinateRegion => MK Coordinate Region，避免无空格导致翻译出错。
        return str.replace(/([A-Z][a-z])/g, ' $1').replace(/([0-9]+)/g, ' $1 ').replace(/([A-Z]{2,})/g, ' $1 ').trim().replace(/\s{2,}/g, ' ');
    } else {
        // 替换蛇形、驼峰、短横线连接为无格式；无格式字符未变更。
        return str.replace(/[_-]|([A-Z]+)/g, (match, group1) => group1 ? ' ' + group1.toLowerCase() : ' ').replace(/([0-9]+)/g, ' $1 ').trim().replace(/\s{2,}/g, ' ');
    }
}

// 去除字符串中的标点符号
function removePunctuation(str) {
    return str.replace(/[^\w\s]/g, "");
}

// 将英文字符串转换为蛇形格式
function toSnakeCase(str) {
    const cleanedStr = removePunctuation(str);
    const singleSpaceStr = cleanedStr.replace(/\s+/g, ' ');
    return singleSpaceStr.split(" ").join("_").toLowerCase();
}

// 将英文字符串转换为驼峰格式
function toCamelCase(str) {
    const cleanedStr = removePunctuation(str);
    const words = cleanedStr.split(" ");
    const camelCase = words.map((word, index) => {
        return index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join("");
    return camelCase;
}

// 执行 MD5 哈希算法 (百度翻译官方代码)
const MD5 = function (string) {

    function RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    function AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }

    function F(x, y, z) { return (x & y) | ((~x) & z); }
    function G(x, y, z) { return (x & z) | (y & (~z)); }
    function H(x, y, z) { return (x ^ y ^ z); }
    function I(x, y, z) { return (y ^ (x | (~z))); }

    function FF(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function GG(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function HH(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function II(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    function WordToHex(lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    };

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };

    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

    string = Utf8Encode(string);

    x = ConvertToWordArray(string);

    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

    for (k = 0; k < x.length; k += 16) {
        AA = a; BB = b; CC = c; DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = AddUnsigned(a, AA);
        b = AddUnsigned(b, BB);
        c = AddUnsigned(c, CC);
        d = AddUnsigned(d, DD);
    }

    var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

    return temp.toLowerCase();
}