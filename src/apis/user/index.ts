import { Http } from "@/plugins/axios";
import { tableResultData } from '@/apis/interface'

export interface loginInterface {
    userName: string,
    password: string,
    code: string
}

export interface userInterface {
    userName: string,
    email: string,
    nickName: string,
    userId: number,
    gender: number,
    avatar: string,
    createdTime: string,
    updateTime: string,
}

export const login = (data: loginInterface) => {
    return Http.post<{
        access_token: string
    }>({ url: `auth/login`, data })
}
//获取用户信息
export const userInfo = () => {
    return Http.get<userInterface>({ url: `auth/user/info` })
}
//获取用户可用菜单
export const getRouter = () => {
    return Http.get<tableResultData<MenuListType>>({ url: `auth/user/menu` })
}

export const loginOut = () => {
    return Http.post({ url: `auth/login/out` })
}

