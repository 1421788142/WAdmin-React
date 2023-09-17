import * as types from "@/redux/mutation-types";
import { appConfigType } from '@/redux/interface/index'

export const updateUserInfo = (userInfo: appConfigType['userInfo']) => ({
    type: types.UPDATE_USER_INFO,
    userInfo
})

export const setLanguage = (language: appConfigType['language']) => ({
    type: types.SET_LANGUAGE,
    language
})

export const setToken = (token: appConfigType['token']) => ({
    type: types.SET_LANGUAGE,
    token
})

export const setVerifyCode = (verifyCode: appConfigType['verifyCode']) => ({
    type: types.SET_VERIFY_CODE,
    verifyCode
})