import { menuItems } from '@/layout/utils/menuItems';
import { StoreType, configStoreType, userStoreType } from '@/redux/interface';
import { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux';
import Menus from '@/layout/components/menu/index'
import { MenuProps } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom'
import config from '../../../../public/config';
import { openKey } from '@/layout/utils/index'

type ThemeType = configStoreType['theme']

const MenuRender:React.FC<{
    menuList:userStoreType['userRouterList']
    collapsed:configStoreType['collapsed'],
    menuType:ThemeType['menuType'],
    headerFlipColor:ThemeType['headerFlipColor'],
    menuFlipColor:ThemeType['menuFlipColor'],
    isDark:ThemeType['isDark'],
}> = (props)=>{
    const {
        menuList,
        collapsed,
        menuType,
        headerFlipColor,
        menuFlipColor,
        isDark,
    } = props

    const { pathname } = useLocation()
    const navigate = useNavigate();
    const [ openKeys, setOpenKeys ] = useState<Array<string>>([])
    const [ selectedKeys, setSelectedKeys ] = useState<Array<string>>([])

    // 菜单主题
    const menuTheme = useMemo(()=>{
        return menuType === 'transverse' && headerFlipColor ? 'dark' :
        (isDark || menuType === 'transverse') ?
        'light' : menuFlipColor ? 'dark' :  'light'
    },[headerFlipColor,menuFlipColor, menuType, isDark])

    // 默认只展开一个父级菜单 保存一级目录layouy
    const rootSubmenuKeys = useMemo(()=>{
        return menuList.map(x => x.component === 'Layout' && x.path)
    },[menuList]) 

    useEffect(()=>{
        setSelectedKeys([pathname === '/' ? config.homePath : pathname])
        if(collapsed) return
        setOpenKeys(openKey(pathname))
    },[pathname,collapsed])

    // 菜单点击
    const onClick = (data:any)=>{
        if(pathname === data.key) return
        navigate(data.key, { replace: true })
    }

    // 菜单点击
    const onOpenChange = (openKey: string[])=>{
        const latestOpenKey = openKey.find(key => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
            setOpenKeys(openKey)
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
        }
    }

    // 菜单配置
    const menuConfig = useMemo(()=>{
        return {
            mode:'inline',
            theme:menuTheme,
            selectedKeys,
            openKeys,
            onClick,
            onOpenChange,
            inlineCollapsed:collapsed
        } as MenuProps
    },[openKeys,menuTheme,selectedKeys,openKeys,collapsed])

    return (<>
        <Menus
            items={menuItems(menuList)}
            {...menuConfig}
        />
    </>)
}

const mapStateToProps = (state: StoreType) => ({
    menuList:state.userStore.userRouterList,
    collapsed:state.configStore.collapsed,
    menuType:state.configStore.theme.menuType,
    isDark:state.configStore.theme.isDark,
    menuFlipColor:state.configStore.theme.menuFlipColor,
    headerFlipColor:state.configStore.theme.headerFlipColor,
});

export default connect(mapStateToProps)(MenuRender);