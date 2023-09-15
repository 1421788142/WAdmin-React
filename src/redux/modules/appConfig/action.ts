import * as types from "@/redux/mutation-types";
import { appConfig } from '@/redux/interface/index'

export const setUserInfo = (userInfo: any) => ({
    type: types.UPDATE_USERINFO,
    userInfo
})

export const setLanguage = (language: appConfig['language']) => ({
    type: types.SET_LANGUAGE,
    language
})