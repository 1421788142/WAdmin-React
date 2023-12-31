import * as types from "@/redux/actionTypes";
import { historyTagStoreType } from '@/redux/interface/index'

export const setTag = (historyTag: historyTagStoreType['historyTag']) => ({
    type: types.SET_TAG,
    historyTag
})

export const seViewStatus = (viewStatus: historyTagStoreType['viewStatus']) => ({
    type: types.SET_VIEW_STATUS,
    viewStatus
})