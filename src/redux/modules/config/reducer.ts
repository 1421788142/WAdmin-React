import { AnyAction } from "redux";
import produce from "immer";
import type { configStoreType } from '@/redux/interface/index'
import * as types from "@/redux/actionTypes";

const configState: configStoreType = {
    language: 'zh',
    theme: {
        // 色弱模式(weak) || 灰色模式(gray)
        weakOrGray: '',
        // 默认 primary 主题颜色
        primary: "#1890ff",
        // 深色模式
        isDark: false,
    },
    component: {
        borderRadius: 10,
        size: 'large'
    }
}

const appConfig = (state: configStoreType = configState, action: AnyAction) =>
    produce(state, draftState => {
        switch (action.type) {
            case types.SET_LANGUAGE:
                draftState.language = action.language;
                break;
            case types.SET_THEME:
                draftState.theme = action.theme;
                break;
            default:
                return draftState;
        }
    })

export default appConfig;