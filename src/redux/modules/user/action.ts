import * as types from "@/redux/actionTypes";
import { userStoreType } from '@/redux/interface/index'

export const updateUserInfo = (userInfo: userStoreType['userInfo']) => ({
    type: types.UPDATE_USER_INFO,
    userInfo
})

export const setToken = (token: userStoreType['token']) => ({
    type: types.SET_LANGUAGE,
    token
})

export const setVerifyCode = (verifyCode: userStoreType['verifyCode']) => ({
    type: types.SET_VERIFY_CODE,
    verifyCode
})

export const setCurrentPage = (currentPage: userStoreType['currentPage']) => ({
    type: types.SET_CURRENT_PAGE,
    currentPage
})

export const setupRequestRecord = (record: userStoreType['requestRecord']) => ({
    type: types.SET_REQUEST_RECORD,
    record
})

export const setupUserRouter = (routerList: userStoreType['userRouterList']) => ({
    type: types.SET_USER_ROUTER,
    routerList
})

export const loginOut = () => ({
    type: types.LOGIN_OUT
})