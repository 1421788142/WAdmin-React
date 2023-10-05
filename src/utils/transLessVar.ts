import { configStoreType } from '@/redux/interface/index'

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
        'primary-color': theme.primary,
        'border-radius': `${component.borderRadius}px`,
        'filter': filterEnum[theme.weakOrGray],
        'content-bg': theme.isDark ? '#141414' : '#fff',
        'container-bg': theme.isDark ? '#0D0D0D' : '#F0F2F5',
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