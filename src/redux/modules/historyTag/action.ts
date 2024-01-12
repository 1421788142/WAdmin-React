import { REDUX_TAG_ENUM } from '@/enums/redux'
import { historyTagStoreType } from '@/redux/interface/index'

export const setTag = (historyTag: historyTagStoreType['historyTag']) => ({
    type: REDUX_TAG_ENUM.SET_TAG,
    historyTag
})

export const seViewStatus = (viewStatus: historyTagStoreType['viewStatus']) => ({
    type: REDUX_TAG_ENUM.SET_VIEW_STATUS,
    viewStatus
})