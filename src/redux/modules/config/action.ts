import { REDUX_CONFIG_ENUM } from '@/enums/redux'
import { configStoreType } from '@/redux/interface/index'

export const setLanguage = (language: configStoreType['language']) => ({
    type: REDUX_CONFIG_ENUM.SET_LANGUAGE,
    language
})

export const setTheme = (theme: configStoreType['theme']) => ({
    type: REDUX_CONFIG_ENUM.SET_THEME,
    theme
})

export const setComponent = (component: configStoreType['component']) => ({
    type: REDUX_CONFIG_ENUM.SET_COMPONENT,
    component
})

export const setCollapsed = (collapsed: configStoreType['collapsed']) => ({
    type: REDUX_CONFIG_ENUM.SET_COLLAPSED,
    collapsed
})

export const setViewFull = (isViewFull: configStoreType['isViewFull']) => ({
    type: REDUX_CONFIG_ENUM.SET_VIEW_FULL,
    isViewFull
})

export const resetConfig = () => ({
    type: REDUX_CONFIG_ENUM.RESET_CONFIG
})