import { AnyAction } from "redux";
import produce from "immer";
import type { configStoreType } from '@/redux/interface/index'
import * as types from "@/redux/actionTypes";

const configState: configStoreType = {
    language: 'zh',
    theme: {
        weakOrGray: '',
        primary: "#00B96B",
        isDark: false,
        isHappy: false,
        menuType: 'vertical',
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
            case types.SET_COMPONENT:
                draftState.component = action.component;
                break;
            default:
                return draftState;
        }
    })

export default appConfig;