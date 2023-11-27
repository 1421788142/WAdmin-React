import { Http } from "@/plugins/axios";
import { tableResultData, queryTableInterface } from '@/apis/interface'

export interface loginInterface {
    userName: string,
    password: string,
    code: string
}

export interface userInterface {
    userName: string,
    email: string,
    nickname: string,
    userId: number,
    avatar: string,
    createdTime: string,
    updateTime: string,
}

export interface roleInterafce {
    id: number,
    roleName: string,
    memo: string,
    createdTime: string,
    status: number,
    order: number,
    menuId: string,
}

export const login = (data: loginInterface) => {
    return Http.post<{
        access_token: string
    }>({ url: `auth/login`, data })
}

export const userInfo = () => {
    return Http.get<userInterface>({ url: `auth/user/info` })
}


export const getRouter = () => {
    return Http.get<tableResultData<menuListType>>({ url: `auth/user/menu` })
}

export const getRole = (data: queryTableInterface) => {
    // return Http.get<tableResultData<roleInterafce>>({ url: `user/role`, data })
}

export const loginExpired = () => {
    // return Http.get({ url: `loginExpired` })
}

export const loginOut = () => {
    // return Http.post({ url: `login/out` })
}

