import * as types from "@/redux/actionTypes";
import { configStoreType } from '@/redux/interface/index'

export const setLanguage = (language: configStoreType['language']) => ({
    type: types.SET_LANGUAGE,
    language
})

export const setTheme = (theme: configStoreType['theme']) => ({
    type: types.SET_THEME,
    theme
})

export const setComponent = (component: configStoreType['component']) => ({
    type: types.SET_COMPONENT,
    component
})