import { AnyAction } from "redux";
import produce from "immer";
import type { configStoreType } from '@/redux/interface/index'
import * as types from "@/redux/actionTypes";
import { menuTypeEnum } from "@/enums/sys";

const stateMeta = {
    language: 'zh',
    theme: {
        weakOrGray: '',
        primary: "#1890FF",
        isDark: false,
        isHappy: false,
        menuType: menuTypeEnum.vertical,
        menuFlipColor: false,
        headerFlipColor: false,
    },
    collapsed: false,
    isViewFull: false,
    component: {
        borderRadius: 10,
        size: 'middle',
        sidebarWidth: 250
    }
} as configStoreType

const configState: configStoreType = Object.assign({}, stateMeta)

const configStore = (state: configStoreType = configState, action: AnyAction) =>
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
            case types.SET_VIEW_FULL:
                draftState.isViewFull = action.isViewFull;
                break;
            case types.RESET_CONFIG:
                draftState.language = stateMeta.language
                draftState.theme = stateMeta.theme
                draftState.collapsed = stateMeta.collapsed
                draftState.component = stateMeta.component
                draftState.isViewFull = stateMeta.isViewFull
                break;
            default:
                return draftState;
        }
    })

export default configStore;