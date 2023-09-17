/**
 * @description 获取浏览器默认语言
 * @return string
 */
export const getBrowserLang = () => {
    let browserLang = navigator.language ? navigator.language : navigator.browserLanguage;
    let defaultBrowserLang = "";
    if (browserLang.toLowerCase() === "cn" || browserLang.toLowerCase() === "zh" || browserLang.toLowerCase() === "zh-cn") {
        defaultBrowserLang = "zh";
    } else {
        defaultBrowserLang = "en";
    }
    return defaultBrowserLang;
};


/**
 * @param {string} name 文件名称：test.png
 * @param {boolean} hasLocal 是否为本地文件 否则直接返回路径
 * @returns {*|string}
 */
export const getAssets = (name: string, hasLocal: boolean = false): any | string => {
    if (hasLocal) return name
    if (!name) return Error('name is null')
    const first = name.split('')[0]
    if (first === '/') name = name.slice(1) //去掉前缀 携带/打包后会出现问题
    return new URL(`/src/assets/${name}`, import.meta.url).href;
}


/**
 * @description 预加载函数
 * @param {number} number
 */
export const preload = (number: number = 500) => {
    return new Promise((reslove) => {
        setTimeout(() => {
            reslove(null)
        }, number)
    })
}