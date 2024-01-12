import { AnyAction } from "redux";
import produce from "immer";
import type { historyTagStoreType } from '@/redux/interface/index'
import { REDUX_TAG_ENUM } from '@/enums/redux'

const historyTagState: historyTagStoreType = {
    historyTag: [],
    viewStatus: 'ok'
}

const historyTagStore = (state: historyTagStoreType = historyTagState, action: AnyAction) =>
    produce(state, draftState => {
        switch (action.type) {
            case REDUX_TAG_ENUM.SET_TAG:
                draftState.historyTag = action.historyTag
                break;
            case REDUX_TAG_ENUM.SET_VIEW_STATUS:
                draftState.viewStatus = action.viewStatus
                break;
            default:
                return draftState;
        }
    })
export default historyTagStore