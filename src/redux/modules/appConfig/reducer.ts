import { AnyAction } from "redux";
import produce from "immer";
import type { appConfig } from '@/redux/interface/index'
import * as types from "@/redux/mutation-types";

const globalState: appConfig = {
    token: '',
    userInfo: null,
    language: 'zh'
}

const appConfig = (state: appConfig = globalState, action: AnyAction) =>
    produce(state, draftState => {
        switch (action.type) {
            case types.UPDATE_USERINFO:
                draftState.userInfo = action.userInfo;
                break;
            case types.SET_LANGUAGE:
                draftState.language = action.language;
                break;
            default:
                return draftState;
        }
    })

export default appConfig;