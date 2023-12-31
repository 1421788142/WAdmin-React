import { Http } from "@/plugins/axios";
import { tableResultData, tableParamsType } from '@/apis/interface'

export interface queryInterface extends Partial<tableParamsType> {
    userName?: string,
    nickName?: string,
    status?: number
}

export interface userListType {
    id: number,
    role:string,
    email: string,
    userName: string,
    roleName:string
    cUserName:string
    createTime:string
    avatar: string,
    gender: number,
    age: number,
    address:string,
    createdTime: string,
    updateTime: string,
    nickName: string,
    userId: string,
    status: number,
    remark: string
}

export interface setupUserType extends Omit<userListType, 'id' | 'createdTime' | 'updateTime'> {
    id?: number,
    password: string,
    passwordConfirm: string
}

// 列表
export const userList = (data?: queryInterface) => {
    return Http.get<tableResultData<userListType>>({ url: `user/listByPage`, data })
}
// 新增
export const addUser = (data: setupUserType) => {
    return Http.post({ url: `user/create`, data })
}
// 编辑
export const updateUser = (data: setupUserType) => {
    return Http.post({ url: `user/update`, data })
}
// 删除
export const delUser = (id: number) => {
    return Http.delete({ url: `user/delete/${id}` })
}