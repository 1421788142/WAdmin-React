import { Http } from "@/plugins/axios";
import { tableResultData } from '@/apis/interface'

export interface queryInterface {
    title?: string,
    status?: number
}

// 列表
export const menuList = (data?: queryInterface) => {
    return Http.get<tableResultData<MenuListType>>({ url: `menu/listByPage`, data })
}
// 新增
export const addMenu = (data: MenuListType) => {
    return Http.post({ url: `menu/create`, data })
}
// 编辑
export const updateMenu = (data: MenuListType) => {
    delete data['children']
    return Http.post({ url: `menu/update`, data })
}
// 删除
export const delMenu = (id: number) => {
    return Http.delete({ url: `menu/delete/${id}` })
}