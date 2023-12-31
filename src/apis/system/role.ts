import { Http } from "@/plugins/axios";
import { tableResultData, tableParamsType } from '@/apis/interface'

export interface queryInterface extends Partial<tableParamsType> {
    status?: number
    roleName?:string
}

export interface roleListType {
    id: number,
    roleName: string,
    roleId: string,
    status: number,
    orderNum: number
    remark: string
    menuId: string
    cUserName:string
    createTime:string
}

export interface setupRoleType extends Omit<roleListType, 'id'| 'cUserName' | 'createTime'> {
    id?: number,
}

// 列表
export const roleList = (data: queryInterface) => {
    return Http.get<tableResultData<roleListType>>({ url: `role/listByPage`, data })
}
// 用户权限菜单列表
export const menuList = () => {
    return Http.get<tableResultData<MenuListType>>({ url: `role/menus` })
}
// 新增
export const addRole = (data: setupRoleType) => {
    return Http.post({ url: `role/create`, data })
}
// 编辑
export const updateRole = (data: setupRoleType) => {
    return Http.post({ url: `role/update`, data })
}
// 删除
export const delRole = (id: number) => {
    return Http.delete({ url: `role/delete/${id}` })
}