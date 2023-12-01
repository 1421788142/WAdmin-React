import * as types from "@/redux/actionTypes";
import { historyTagStoreType } from '@/redux/interface/index'

export const setTag = (historyTag: historyTagStoreType['historyTag']) => ({
    type: types.SET_TAG,
    historyTag
})

export const setCurrentTag = (currentTag: historyTagStoreType['currentTag']) => ({
    type: types.SET_CURRENT_TAG,
    currentTag
})