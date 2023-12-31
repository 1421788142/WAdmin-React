import { AnyAction } from "redux";
import produce from "immer";
import type { historyTagStoreType } from '@/redux/interface/index'
import * as types from "@/redux/actionTypes";

const historyTagState: historyTagStoreType = {
    historyTag: [],
    viewStatus: 'ok'
}

const historyTagStore = (state: historyTagStoreType = historyTagState, action: AnyAction) =>
    produce(state, draftState => {
        switch (action.type) {
            case types.SET_TAG:
                draftState.historyTag = action.historyTag
                break;
            case types.SET_VIEW_STATUS:
                draftState.viewStatus = action.viewStatus
                break;
            default:
                return draftState;
        }
    })
export default historyTagStore