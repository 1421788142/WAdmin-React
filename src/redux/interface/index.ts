import { userInterface } from '@api/user/index'
import type { SizeType } from "antd/lib/config-provider/SizeContext";

export type pageType = 1 | 2 | 3 | 4 | 5
export type menuType = 'vertical' | 'classic' | 'transverse' | 'columns'

// userStore
export type userStoreType = {
    token: string,
    requestRecord: { cancel: Function, url: string }[],
    userRouterList: menuListType[],
    verifyCode: string,
    userInfo: userInterface | null;
    currentPage: pageType
}

// configStore
export type configStoreType = {
    language: 'zh' | 'en';
    theme: {
        weakOrGray: 'weak' | 'gray' | ''// 色弱模式(weak) || 灰色模式(gray)
        primary: string,// 默认 primary 主题颜色
        isDark: boolean,// 深色模式
        isHappy: boolean, //按钮特效
        menuType: menuType,//导航模式
        menuFlipColor: boolean,//菜单主题反转
        headerFlipColor: boolean,//头部主题反转
    },
    component: {
        borderRadius: number,//圆角
        size: SizeType,//尺寸
        sidebarWidth: number,//侧栏菜单宽度
    }
}

export type StoreType = {
    configStore: configStoreType,
    userStore: userStoreType,
}
