import { AnyAction } from "redux";
import produce from "immer";
import type { configStoreType } from '@/redux/interface/index'
import * as types from "@/redux/actionTypes";
import { menuTypeEnum } from "@/enums/sys";

const configState: configStoreType = {
    language: 'zh',
    theme: {
        weakOrGray: '',
        primary: "",
        isDark: false,
        isHappy: false,
        menuType: menuTypeEnum.vertical,
        menuFlipColor: false,
        headerFlipColor: false,
    },
    collapsed: false,
    component: {
        borderRadius: 10,
        size: 'middle',
        sidebarWidth: 250
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
            case types.SET_COLLAPSED:
                draftState.collapsed = action.collapsed;
                break;
            case types.SET_COMPONENT:
                draftState.component = action.component;
                break;
            case types.RESET_CONFIG:
                draftState.component = {
                    borderRadius: 10,
                    size: 'middle',
                    sidebarWidth: 250
                };
                draftState.theme = {
                    weakOrGray: '',
                    primary: "#1890FF",
                    isDark: false,
                    isHappy: false,
                    menuType: menuTypeEnum.vertical,
                    menuFlipColor: false,
                    headerFlipColor: false,
                }
                draftState.collapsed = false
                draftState.language = 'zh'
                break;
            default:
                return draftState;
        }
    })

export default appConfig;