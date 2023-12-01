import { AnyAction } from "redux";
import produce from "immer";
import type { historyTagStoreType } from '@/redux/interface/index'
import * as types from "@/redux/actionTypes";

const historyTagState: historyTagStoreType = {
    historyTag: [],
    currentTag: {} as menuListType
}

const historyTagStore = (state: historyTagStoreType = historyTagState, action: AnyAction) =>
    produce(state, draftState => {
        switch (action.type) {
            case types.SET_TAG:
                draftState.historyTag = action.historyTag
            case types.SET_CURRENT_TAG:
                draftState.currentTag = action.currentTag
            default:
                return draftState;
        }
    })
export default historyTagStore