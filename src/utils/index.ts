import i18n from "i18next";
const { t } = i18n

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

/**
 * 一维array to TreeArray (dataList, 'id', 'pId') 必须要有父子id对应关系
 * @param {Array} target 需要处理为TreeArray的源数据
 * @param {string} id 和子级数据关联的key 也是唯一值
 * @param {string} pId 和父级数据关联的key
 * @param {Map} map hash表 可不传 最后通过顶级ID get数据
 * @return Array
 * */
export function arrayToTree<T extends { [prop: string]: any }>(
    target: T[],
    id: string = "id",
    pId: string = "pId",
    map: Map<string, Array<T>> = new Map()
): T[] {
    if (!Array.isArray(target)) {
        console.warn("target is not array");
        return target
    }
    const idMap = new Map();
    target.map((item: T) => {
        const idKey = item[id];
        const pIdKey = item[pId];
        [idKey, pIdKey].forEach((idKey) => {
            return !map.has(idKey) && map.set(idKey, []);
        });
        const data = {
            ...item,
            children: map.get(idKey) as T[],
        };
        idMap.set(idKey, data); // 只保存id
        map.get(pIdKey)!.push(data);
    });

    let result: T[] = [];
    let keys = [...map.keys()]; // 保存key 直接循环会导致拿不到value值为空数组的key
    keys.forEach((key) => {
        if (!idMap.has(key)) return (result = [...result, ...map.get(key) as any[]]);
        !idMap.get(key).children.length && delete idMap.get(key).children; // children子元素为空则删除该属性
    });
    return result;
}

/**
 * @description 扁平化数组对象
 * @param {Array} arr 数组对象
 * @return array
 */
export function getFlatArr<T extends Array<any>>(arr: T) {
    return arr.reduce((pre: any, current: any) => {
        let flatArr = [...pre, current];
        if (current.children)
            flatArr = [...flatArr, ...getFlatArr(current.children)];
        return flatArr;
    }, []);
}

/**
 * @description ES6中的Set数组去重
 * @param {Array} target 数据源
 * @return Array
 * */
export const arrRemoval = (target: string[]) => {
    let set = [...new Set(target)];
    return set;
}


/**
 * @description 获取当前时间区间
 * @return string
 */
export function timeState() {
    let timeNow = new Date();
    let hours = timeNow.getHours();
    if (hours >= 6 && hours <= 10) return t('sys.timeTitle1');
    if (hours >= 10 && hours <= 14) return t('sys.timeTitle2');
    if (hours >= 14 && hours <= 18) return t('sys.timeTitle3');
    if (hours >= 18 && hours <= 24) return t('sys.timeTitle4');
    return t('sys.timeTitle5')
}

/**
 * @description 防抖函数
 * @return function
 */
export function debounce(fn: any, delay: number = 300) {
    let timerId: any;
    return function (...args: any) {
        timerId && clearTimeout(timerId)
        timerId = setTimeout(() => fn(...args), delay)
    }
}
