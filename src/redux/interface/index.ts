import { userInterface } from '@api/user/index'
import type { SizeType } from "antd/lib/config-provider/SizeContext";
import { REDUX_USER_ENUM, REDUX_CONFIG_ENUM, REDUX_TAG_ENUM } from '@/enums/redux'
import { MENU_TYPE_ENUM } from '@/enums/sys'
export type pageType = 1 | 2 | 3 | 4 | 5
export type menuType = 'vertical' | 'classic' | 'transverse' | 'columns'
export type REDUX_KEYS = keyof typeof REDUX_USER_ENUM | keyof typeof REDUX_CONFIG_ENUM | keyof typeof REDUX_TAG_ENUM

// userStore
export type userStoreType = {
    token: string,
    requestRecord: { cancel: Function, url: string }[], //请求接口的记录
    userRouterList: MenuListType[],//用户路由
    verifyCode: string,//图像验证码
    userInfo: userInterface | null;//用户信息
    currentPage: pageType,//登录页面的当前登录页签
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
    isViewFull: boolean,
    collapsed: boolean,
    component: {
        borderRadius: number,//圆角
        size: SizeType,//尺寸
        sidebarWidth: number,//侧栏菜单宽度
    }
}
// 历史标签
export type historyTagStoreType = {
    historyTag: HistoryTagType[],//历史记录
    viewStatus: 'loading' | 'ok'
}

// 类型集合
export type StoreType = {
    configStore: configStoreType,
    userStore: userStoreType,
    historyTagStore: historyTagStoreType
}
