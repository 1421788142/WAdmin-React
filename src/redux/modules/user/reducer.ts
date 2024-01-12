import { AnyAction } from "redux";
import produce from "immer";
import type { userStoreType } from '@/redux/interface/index'
import { REDUX_USER_ENUM } from '@/enums/redux'

const userState: userStoreType = {
    token: '', //项目暂时没有启用token模式 可以按需使用
    requestRecord: [],//保存请求的接口
    userRouterList: [],
    userInfo: null,
    verifyCode: "",// 前端生成的验证码（按实际需求替换）
    // 判断登录页面显示哪个组件（1登录（默认）、2手机登录、3二维码登录、4注册、5忘记密码）
    currentPage: 1
}

const userStore = (state: userStoreType = userState, action: AnyAction) =>
    produce(state, draftState => {
        switch (action.type) {
            case REDUX_USER_ENUM.UPDATE_USER_INFO:
                draftState.userInfo = action.userInfo;
                break;
            case REDUX_USER_ENUM.SET_TOKEN:
                draftState.token = action.token;
                break;
            case REDUX_USER_ENUM.SET_VERIFY_CODE:
                draftState.verifyCode = action.verifyCode;
                break;
            case REDUX_USER_ENUM.SET_CURRENT_PAGE:
                draftState.currentPage = action.currentPage;
                break;
            case REDUX_USER_ENUM.SET_REQUEST_RECORD:
                // 缓存请求记录
                const { type, url, cancel } = action.record
                if (type === 'add') {
                    draftState.requestRecord.unshift({ url, cancel })
                    if (draftState.requestRecord.length > 15) draftState.requestRecord.pop()
                } else if (type === 'cancel') {
                    draftState.requestRecord.forEach((item) => {
                        item.cancel && item.cancel()
                    })
                    draftState.requestRecord = []
                } else {
                    draftState.requestRecord = draftState.requestRecord.filter(x => x.url !== url)
                }
                break;
            case REDUX_USER_ENUM.SET_USER_ROUTER:
                draftState.userRouterList = action.routerList;
                break;
            case REDUX_USER_ENUM.LOGIN_OUT:
                draftState.token = '';
                draftState.userInfo = null;
                break;
            default:
                return draftState;
        }
    })
export default userStore;