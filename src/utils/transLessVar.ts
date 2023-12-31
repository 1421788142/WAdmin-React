import { configStoreType } from '@/redux/interface/index'

// less变量
export const transLessVar = (config: configStoreType): string => {
    const { theme, component } = config
    const filterEnum = {
        gray: 'grayscale(100%)',
        weak: 'invert(80%)',
        "": ""
    }
    const token: {
        [key: string]: string
    } = {
        'primary-color': theme.primary,//主题色
        'border-radius': `${component.borderRadius}px`,//边框圆角
        'filter': filterEnum[theme.weakOrGray],//黑白
        'content-bg': theme.isDark ? '#141414' : '#fff',//盒子背景
        'container-bg': theme.isDark ? '#0D0D0D' : '#F0F2F5',//主体背景
        'message-bg': theme.isDark ? '#1F1F1F' : '#fff',//信息弹框背景
        'message-text': theme.isDark ? 'rgba(255, 255, 255, 0.85)' : '#000',//信息弹框文字
        'border-color': theme.isDark ? '#424242' : '#f0f0f0',//边框颜色
        'hover-bg': theme.isDark ? '#3A3A3A' : '#F0F0F0',
    }

    new Array(9).fill(0).forEach((x, i) => {
        token[`primary-color-${i + 1}`] = `${theme.primary}${(i + 1) * 10}`
    })

    let varStr = ''
    for (let key in token) {
        if (['filter'].includes(key)) {
            varStr += `${key}:${token[key]};`
        } else {
            varStr += `--wadmin-${key}:${token[key]};`
        }
    }
    return varStr
}