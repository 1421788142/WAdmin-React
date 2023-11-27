import type { configStoreType, userStoreType } from '@/redux/interface/index'
import type { MenuProps } from 'antd';
import { NavigateFunction } from 'react-router-dom'
import { openKey } from '@/layout/utils/index'
import { useState, useEffect, useMemo } from 'react';
import config from '../../public/config';

export type UseMenuReturnType = {
    mode:MenuProps['mode'],
    theme:MenuProps['theme'],
    onClick:(data:any)=>void
    selectedKeys:Array<string>,
    openKeys?:Array<string>,
    onOpenChange:(openKeys: string[]) => void;
} & MenuProps

export const useMenu = (option: {
    userStore:userStoreType,
    theme:configStoreType['theme'],
    collapsed?:configStoreType['collapsed'],
    navigate: NavigateFunction,
    pathname:string,
    hasOpenKey?:boolean
}): UseMenuReturnType => {
    const { userStore, theme, pathname, hasOpenKey = true, collapsed = true } = option

    const onClick = (data:any) => {
        if(pathname === data.key) return
        option.navigate(data.key, { replace: true })
    }

    const [ openKeys, setOpenKeys ] = useState<Array<string>>([])
    const [ selectedKeys, setSelectedKeys ] = useState<Array<string>>([])

    useEffect(()=>{
        setSelectedKeys([pathname === '/' ? config.homePath : pathname])
        if(collapsed) return
        setOpenKeys(openKey(pathname))
    },[pathname,collapsed])

    // 默认只展开一个父级菜单 保存一级目录layouy
    const rootSubmenuKeys = useMemo(()=>{
        return userStore.userRouterList.map(x => x.component === 'Layout' && x.path)
    },[userStore.userRouterList]) 
    // // 当前选中的菜单项 key 数组
    // 当前展开的 SubMenu 菜单项 key 数组

    const onOpenChange = (openKey: string[]) => {
        const latestOpenKey = openKey.find(key => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
            setOpenKeys(openKey)
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
        }
    }

    // 菜单主题
    const menuTheme = 
        theme.menuType === 'transverse' && theme.headerFlipColor ? 'dark' :
        (theme.isDark || theme.menuType === 'transverse') ?
        undefined : theme.menuFlipColor ? 'dark' :  'light'

    const returnData:UseMenuReturnType = {
        mode:'inline',
        theme: menuTheme,
        selectedKeys,
        openKeys,
        onClick,
        onOpenChange,
    }

    // 删除没有用的openKeys(原因头部模式菜单鼠标移入事件触发时机不对)
    !hasOpenKey && delete returnData['openKeys']

    return useMemo(()=>returnData,[option])
}