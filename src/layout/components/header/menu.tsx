import Menus from '../menu'
import { menuItems } from '@/layout/utils/menuItems';
import { StoreType, configStoreType, userStoreType } from '@/redux/interface/index'
import { useNavigate, useLocation } from 'react-router-dom'
import { connect } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { MenuProps } from 'antd';
import config from '../../../../public/config';

type ThemeType = configStoreType['theme']

const HeaderMenu:React.FC<Partial<{
    menuList:userStoreType['userRouterList']
    headerFlipColor:ThemeType['headerFlipColor'],
    isDark:ThemeType['isDark'],
}>> = (props) => {
    const {
        menuList,
        headerFlipColor,
        isDark,
    } = props
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [ openKeys, setOpenKeys ] = useState<Array<string>>([])
    const [ selectedKeys, setSelectedKeys ] = useState<Array<string>>([])

    // 菜单主题
    const menuTheme = useMemo(()=>{
        return isDark || headerFlipColor ? 'dark' : 'light'
    },[headerFlipColor, isDark])


    // 菜单点击
    const onClick = (data:any)=>{
        if(pathname === data.key) return
        navigate(data.key, { replace: true })
    }

    // 默认只展开一个父级菜单 保存一级目录layouy
    const rootSubmenuKeys = useMemo(()=>{
        return (menuList as userStoreType['userRouterList']).map(x => x.component === 'Layout' && x.path)
    },[menuList]) 

    useEffect(()=>{
        setSelectedKeys([pathname === '/' ? config.homePath : pathname])
    },[pathname])

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
            mode:'horizontal',
            theme:menuTheme,
            selectedKeys,
            openKeys,
            onClick,
            onOpenChange,
        } as MenuProps
    },[openKeys,menuTheme,selectedKeys,openKeys])

    return <>
        <div className='flex-1 w-[10px] bg-slate-300'>
            <Menus
                style={{ justifyContent:'center', background:isDark ? '#141414' : '' }}
                items={menuItems(menuList as userStoreType['userRouterList'])}
                {...menuConfig}
            />
        </div>
    </>
}

const mapStateToProps = (state: StoreType) => ({
    menuList:state.userStore.userRouterList,
    isDark:state.configStore.theme.isDark,
    headerFlipColor:state.configStore.theme.headerFlipColor,
})

export default connect(mapStateToProps)(HeaderMenu)