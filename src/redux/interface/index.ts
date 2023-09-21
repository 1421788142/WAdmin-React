import { userInterface } from '@api/user/index'
import type { SizeType } from "antd/lib/config-provider/SizeContext";
export type pageType = 1 | 2 | 3 | 4 | 5
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
        // 色弱模式(weak) || 灰色模式(gray)
        weakOrGray: 'weak' | 'gray' | ''
        // 默认 primary 主题颜色
        primary: string,
        // 深色模式
        isDark: boolean,
    },
    component: {
        borderRadius: number,
        size: SizeType
    }
}
