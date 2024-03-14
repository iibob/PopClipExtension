"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;

// const apps = ["com.apple.dt.Xcode", "com.microsoft.VSCode", "com.apple.TextEdit", "com.apple.Notes", "com.sublimetext.4"];

const keyMap = {
    'camelCase': { title: '驼峰', icon: 'camelCase.svg' },
    'UpperCamelCase': { title: '大驼峰', icon: 'UpperCamelCase.svg' },
    'snake_case': { title: '蛇形', icon: 'snake_case.svg' },
    'CONSTANT_CASE': { title: '蛇形大写', icon: 'CONSTANT_CASE.svg' },
    'kebab-case': { title: '串式', icon: 'kebab-case.svg' },
};

const actions = (input, options) => {
    if (/\n/.test(input.text)) {
        return  // 判断是否包含换行符
    }
    const str = input.text.trim();

    if (isEnglishString(str)) {
        if (!isSpecialString(str)) {
            const namingStyle = getNamingStyle(str);
            const result = [];
            for (const key in options) {
                if (key === 'bundle_identifier') {
                    continue;   // 跳过当前循环
                }
                const str2 = spaceSeparated(namingStyle, str);
                const objectToAdd = {};
                if (options[key]) {
                    if (namingStyle !== key) {
                        objectToAdd.title = keyMap[key].title;
                        objectToAdd.icon = keyMap[key].icon;
                        objectToAdd.code = () => {
                            codes(key, str2.toLowerCase())
                        };

                        if (options.bundle_identifier.trim() !== '') {
                            const apps = options.bundle_identifier.trim().split(' ').filter(app => app.trim() !== '');
                            objectToAdd.requiredApps = apps;
                        }

                        result.push(objectToAdd);
                    }
                }
            }
            return result;
        }
    }
    return
};


// 将全小写字母，可能有数字的字符串替换成指定命名风格
function codes(key, str) {
    if (key === 'camelCase') {
        const camelCaseSentence = str.replace(/\b\w/g, function (word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
        popclip.pasteText(camelCaseSentence);
    } else if (key === 'UpperCamelCase') {
        const upperCamelCaseSentence = str.replace(/\b\w/g, function (word) {
            return word.toUpperCase();
        }).replace(/\s+/g, '');
        popclip.pasteText(upperCamelCaseSentence);
    } else if (key === 'snake_case') {
        popclip.pasteText(str.replace(/\s+/g, '_'));
    } else if (key === 'CONSTANT_CASE') {
        popclip.pasteText(str.replace(/\s+/g, '_').toUpperCase());
    } else if (key === 'kebab-case') {
        popclip.pasteText(str.replace(/\s+/g, '-'));
    }
}


// 将具有命名风格的字符串转换成空格连接的字符串
function spaceSeparated(namingStyle, str) {
    if (namingStyle === 'camelCase') {
        return str.replace(/([A-Z])([a-z])/g, ' $1$2').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/(\d+)/g, ' $1 ').replace(/\s+/g, ' ').trim();
    } else if (namingStyle === 'UpperCamelCase') {
        return str.replace(/([A-Z])([a-z])/g, ' $1$2').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/(\d+)/g, ' $1 ').replace(/\s+/g, ' ').trim();
    } else if (namingStyle === 'snake_case') {
        return str.replace(/_/g, ' ').replace(/(\d+)/g, ' $1 ').replace(/\s+/g, ' ').trim();
    } else if (namingStyle === 'CONSTANT_CASE') {
        return str.replace(/_/g, ' ').replace(/(\d+)/g, ' $1 ').replace(/\s+/g, ' ').trim();
    } else if (namingStyle === 'kebab-case') {
        return str.replace(/-/g, ' ').replace(/(\d+)/g, ' $1 ').replace(/\s+/g, ' ').trim();
    } else {
        return str.replace(/[^a-zA-Z0-9]/g, ' ').replace(/([A-Z])([a-z])/g, ' $1$2').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/(\d+)/g, ' $1 ').replace(/\s+/g, ' ').trim();
    }
}


// 字符串仅由英文、数字、符号和空格组成，不包含制表符和换行符
function isEnglishString(str) {
    const regex = /^[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~ ]+$/;
    return regex.test(str);
}


// 判断特殊字符串
function isSpecialString(str) {
    // 去除字符串头尾的所有标点符号
    const str2 = str.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, '');
    if (str2 === '') {
        return true
    }
    // 依次判断只有大写字母、只有小写字母、只有一个大写字母和一个或多个小写字母、只有数字(含小数负数)、不包含字母 组成
    return /^[A-Z]+$/.test(str2) || /^[a-z]+$/.test(str2) || /^[A-Z][a-z]+$/.test(str2) || /^-?\d*\.?\d+$/.test(str2) || /^[^a-zA-Z]*$/.test(str2);
}


// 判断字符串的命名风格
function getNamingStyle(str) {
    const str2 = str.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, '');
    if (/^[a-z][a-zA-Z0-9]*$/.test(str2)) {
        return 'camelCase';
    } else if (/^[A-Z][a-zA-Z0-9]*$/.test(str2)) {
        return 'UpperCamelCase';
    } else if (/^[a-z]+(_[a-z0-9]+)*$/.test(str2)) {
        return 'snake_case';
    } else if (/^[A-Z]+(_[A-Z0-9]+)*$/.test(str2)) {
        return 'CONSTANT_CASE';
    } else if (/^[a-z]+(-[a-z0-9]+)*$/.test(str2)) {
        return 'kebab-case';
    } else {
        return 'unknown';
    }
}


exports.actions = actions;
