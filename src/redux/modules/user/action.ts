import { REDUX_USER_ENUM } from '@/enums/redux'
import { userStoreType } from '@/redux/interface/index'

export const updateUserInfo = (userInfo: userStoreType['userInfo']) => ({
    type: REDUX_USER_ENUM.UPDATE_USER_INFO,
    userInfo
})

export const setToken = (token: userStoreType['token']) => ({
    type: REDUX_USER_ENUM.SET_TOKEN,
    token
})

export const setVerifyCode = (verifyCode: userStoreType['verifyCode']) => ({
    type: REDUX_USER_ENUM.SET_VERIFY_CODE,
    verifyCode
})

export const setCurrentPage = (currentPage: userStoreType['currentPage']) => ({
    type: REDUX_USER_ENUM.SET_CURRENT_PAGE,
    currentPage
})

export const setupRequestRecord = (record: userStoreType['requestRecord']) => ({
    type: REDUX_USER_ENUM.SET_REQUEST_RECORD,
    record
})

export const setupUserRouter = (routerList: userStoreType['userRouterList']) => ({
    type: REDUX_USER_ENUM.SET_USER_ROUTER,
    routerList
})

export const loginOut = () => ({
    type: REDUX_USER_ENUM.LOGIN_OUT
})