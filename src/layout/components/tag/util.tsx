import { store } from '@/redux';
import { historyTagStoreType } from '@/redux/interface';
import { useTranslation } from 'react-i18next';
import { App } from 'antd'
import { useNavigate } from 'react-router-dom';
import config from '../../../../public/config'
import _ from 'loadsh'

export const useTag = ({
    tagList,
    pathname,
    navigate
}: {
    tagList: historyTagStoreType['historyTag'],
    pathname: string,
    navigate: ReturnType<typeof useNavigate>
}) => {
    const { t } = useTranslation();
    const app = App.useApp()

    const setStoreTag = (lsit: historyTagStoreType['historyTag']) => {
        store.dispatch({
            type: 'SET_TAG',
            historyTag: lsit
        })
    }

    // 关闭当前
    const onClose = (path: string) => {
        let length = tagList.length
        if (length <= 1) return app.message.error(t('layouts.noCloseAllTabs'))
        let current = tagList.findIndex(x => x.path === path)

        const newList = tagList.filter(x => x.path !== tagList[current].path)
        setStoreTag(newList)
        
        if (current === newList.length && path === pathname) {
            navigate((newList.at(-1) as historyTagType).path)
        } else if (path === pathname) {
            navigate((newList.at(current-1) as historyTagType).path)
        }
    }

    // 关闭左侧
    const closeLeft = (path: string) => {
        let index = tagList.findIndex(x => path == x.path)
        let newList = _.cloneDeep(tagList)
        newList.splice(0, index)
        setStoreTag(newList)
    }
    // 关闭右侧
    const closeRight = (path: string) => {
        let index = tagList.findIndex(x => path == x.path)
        let newList = _.cloneDeep(tagList)
        newList.splice(index + 1,tagList.length)
        setStoreTag(newList)
    }
    // 关闭全部
    const closeAll = () => {
        setStoreTag([])
        navigate(config.homePath || '/')
    }
    // 关闭其他
    const closeOther = (path: string) => {
        setStoreTag(tagList.filter(x => path == x.path))
    }

    return {
        onClose,
        setStoreTag,
        closeLeft,
        closeRight,
        closeAll,
        closeOther
    }
}