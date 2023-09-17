import { AnyAction } from "redux";
import produce from "immer";
import type { appConfigType } from '@/redux/interface/index'
import * as types from "@/redux/mutation-types";

const appConfigState: appConfigType = {
    token: '',
    userInfo: null,
    verifyCode: "",// 前端生成的验证码（按实际需求替换）
    language: 'zh'
}

const appConfig = (state: appConfigType = appConfigState, action: AnyAction) =>
    produce(state, draftState => {
        switch (action.type) {
            case types.UPDATE_USER_INFO:
                draftState.userInfo = action.userInfo;
                break;
            case types.SET_LANGUAGE:
                draftState.language = action.language;
                break;
            case types.SET_TOKEN:
                draftState.token = action.token;
                break;
            case types.SET_VERIFY_CODE:
                draftState.verifyCode = action.verifyCode;
                break;
            default:
                return draftState;
        }
    })

export default appConfig;