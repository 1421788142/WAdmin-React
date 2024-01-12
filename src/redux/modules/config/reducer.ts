import { AnyAction } from "redux";
import produce from "immer";
import type { configStoreType } from '@/redux/interface/index'
import { REDUX_CONFIG_ENUM } from '@/enums/redux'
import { MENU_TYPE_ENUM } from "@/enums/sys";

const stateMeta = {
    language: 'zh',
    theme: {
        weakOrGray: '',
        primary: "#1890FF",
        isDark: false,
        isHappy: false,
        menuType: MENU_TYPE_ENUM.VERTICAL,
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
            case REDUX_CONFIG_ENUM.SET_LANGUAGE:
                draftState.language = action.language;
                break;
            case REDUX_CONFIG_ENUM.SET_THEME:
                draftState.theme = action.theme;
                break;
            case REDUX_CONFIG_ENUM.SET_COLLAPSED:
                draftState.collapsed = action.collapsed;
                break;
            case REDUX_CONFIG_ENUM.SET_COMPONENT:
                draftState.component = action.component;
                break;
            case REDUX_CONFIG_ENUM.SET_VIEW_FULL:
                draftState.isViewFull = action.isViewFull;
                break;
            case REDUX_CONFIG_ENUM.RESET_CONFIG:
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