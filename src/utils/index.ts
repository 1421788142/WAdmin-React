import { DeepMerge } from "@/typings/utils";
import i18n from "i18next";
import { isObject } from "./is";
const { t } = i18n


/**
 * 选择某个对象中一个或多个key的value
 *```
 * const obj = {a:1}
 * pick(obj,'a') | pick(obj,['a'])=>{a:obj.a}
 * ```
 * @param {object} target 需要获取对应key-value的源数据 可以是一个JSON对象
 * @param {string | string[]} keys 字符串或数组 值为需要获取的key
 * @param {boolean} [clearNull=false] 是否需要过滤值为空的数据 默认为false
 * @return {object} object
 **/

export const pick = <T extends Record<string, any>, K extends keyof T>(
    target: (object | string) & T,
    keys: K[],
    clearNull: boolean = false
): Pick<T, K> => {
    const newVlaue = typeof target === 'string' && target.startsWith('{') ? JSON.parse(target) : ({} as T)
    if (!Array.isArray(keys)) keys = [keys]
    for (let key of new Set(keys)) {
        let value = target[key]
        if (!value && clearNull) continue
        newVlaue[key] = value
    }
    return newVlaue
}


/**
 * 过滤某个对象中一个或多个key的value
 *```
 * const obj = {a:1,b:1,c:2}
 * pick(obj,'a') | pick(obj,['a'])=>{b:obj.b,c:obj.c}
 * ```
 * @param {object} target 需要获取对应key-value的源数据 可以是一个JSON对象
 * @param {string | string[]} keys 字符串或数组 值为需要获取的key
 * @return {object} object
 **/

export const filterPick = <T extends Record<string, any>, K extends keyof T>(
    target: (object | string) & T,
    keys: K[]
): Pick<T, K> => {
    let objKeys = (Object.keys(target) as K[]).filter((f) => !keys.includes(f)) as (string & K)[]
    return pick<T, K>(target, objKeys)
}

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
export const arrRemoval = (target: any[]) => {
    let set = [...new Set(target)];
    return set;
}

/**
 * @description 清除所有localStorage
 * @return void
 */
export function localClear() {
    window.localStorage.clear();
}

/**
 * 对传入数据的深克隆
 * @param {object} target 需要克隆的对象(不可为map、set... 未做适配)
 * @param {WeakMap} map WeakMap对象
 * @return {object} 被克隆的target
 **/
export const deepClone = function <T extends object>(
    target: T,
    map: WeakMap<T, T> = new WeakMap(),
): T {
    if (!(target instanceof Object)) return target;
    if (map.has(target)) return map.get(target) as T;
    const tempObject: T = Array.isArray(target)
        ? []
        : Object.create(Object.getPrototypeOf(target));
    // 对象保存 为了防止引用自身导致的内存溢出
    map.set(target, tempObject);
    Object.keys(target).forEach(key => {
        const newKey = key as keyof T
        // 对于函数的单独处理
        if (target[newKey] instanceof Function)
            return (tempObject[newKey] = (target[newKey] as Function).bind(tempObject));
        // @ts-ignore
        tempObject[newKey] = deepClone(target[newKey], map);
    });
    return tempObject;
};

/**
 * 对象深合并
 * @param target 相同属性都会被`合并`到此对象
 * @param sources 如果多个对象的属性`相同`则会被后面的`覆盖`
 * @example deepMerge({ a: 1, c: { c: 1, a: [1, 2, 3] } }, { b: 2, c: { a: [2] } })
 *  // => {a:1,b:2,c:{c:1,a:[2,2,3]}}
 * @returns 被修改之后的对象
 */
export const deepMerge = <T extends object, U extends object>(
    target: T,
    ...sources: U[]
): DeepMerge<T, U> => {
    if (!isObject(target)) throw new Error("Target it should be an object");
    sources.forEach(source => {
        if (!isObject(source)) return;
        Object.keys(source).forEach(key => {
            const newTKey = key as keyof T
            const newUKey = key as keyof U
            const $value = source[newUKey],
                _value = target[newTKey];
            // 源对象的属性值不为对象 ===> 直接覆盖
            // @ts-ignore
            if (!isObject(_value)) return (target[newTKey] = $value);
            // 合并值为不为undefined ===> 直接覆盖
            // @ts-ignore
            if ($value !== undefined) return (target[newTKey] = $value);
            // 源对象属性值为对象 要合并进来的属性值不是对象 ===> 以原属性值为准
            if (!isObject($value)) return;
            // 函数 ===> 覆盖
            // @ts-ignore
            if (isType(_value) === isType($value) && isType($value) === "function")
                // @ts-ignore
                return (target[newTKey] = $value);
            // 都是对象 ===> 深合并
            deepMerge(_value, $value);
        });
    });
    return target as any;
};


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


/**
 * 请求并发
 * @param {Array<()=>Promise<Result<any>>>} tasks 请求函数array 没有入参
 * @param {number} max 并发最大请求数量
 * @param {(result:Result<any>,i:number)=>void} callback
 * @returns {Promise<Array<Result<any>>>}
 */
export const useLimitedRequest = (tasks: Array<() => Promise<Result<any>>>, max: number = 2, callback?: (v: Result<any>, i: number) => void) => {
    const length = tasks.length;
    const results: Array<any> = [];

    let index = 0;// 请求的索引
    let count = 0; // 已经完成的数量
    return new Promise(resolve => {
        // 发送请求
        async function request() {
            if (index >= length) return;
            const i = index;

            const task = tasks[index++]

            try {
                results[i] = await task();
            } catch (err) {
                results[i] = err;
            } finally {
                callback instanceof Function && callback(results[i], i);
                if (++count >= length) {
                    return resolve(results);
                }
                request();
            }
        }

        const taskNun = Math.min(max, tasks.length);

        //开启对应的分支
        for (let i = 0; i < taskNun; i++) {
            request();
        }
    });
};
