import React, { useMemo, useState, useEffect } from 'react'
import { StoreType, configStoreType, userStoreType } from '@/redux/interface/index'
import Menus from '../menu'
import { getFirstMenu, setBreadCrumbs } from '@/layout/utils'
import { useNavigate, useLocation } from 'react-router-dom'
import { menuItems } from '@/layout/utils/menuItems';
import { Avatar, MenuProps } from 'antd'
import { getAssets } from '@/utils/index'
import config from '../../../../public/config'
import { openKey } from '@/layout/utils/index'
import { connect } from 'react-redux'

type ThemeType = configStoreType['theme']

const Columns:React.FC<{
    menuList:userStoreType['userRouterList']
    collapsed:configStoreType['collapsed'],
    menuFlipColor:ThemeType['menuFlipColor'],
    isDark:ThemeType['isDark'],
    sidebarWidth:configStoreType['component']['sidebarWidth'],
}> = (props) => {
    const { VITE_PROJECT_NAME, VITE_PROJECT_LOGO } = import.meta.env
    const {
        menuList,
        collapsed,
        menuFlipColor,
        isDark,
        sidebarWidth
    } = props
    const navigate = useNavigate();
    const { pathname } = useLocation();
    // 打开
    const [ openKeys, setOpenKeys ] = useState<Array<string>>([])
    // 展开
    const [ selectedKeys, setSelectedKeys ] = useState<Array<string>>([])
    // 右侧子菜单
    const [childrenRoute,setChildrenRoute] = useState<MenuListType[]>([])

    // 左侧目录菜单高亮
    const firstMenuActive = useMemo(()=>{
        const crumbsList = setBreadCrumbs(pathname)
        return crumbsList[0]?.path || config.homePath
    },[pathname])

    // 设置子级菜单
    const setRouter = (path:string)=>{
        let route = menuList.flatMap(x=>x.path === path ? x?.children || [] : [])
        setChildrenRoute(route)
    }

    useEffect(()=>{
        setSelectedKeys([pathname === '/' ? config.homePath : pathname])
        if(collapsed) return
        setOpenKeys(openKey(pathname))
    },[pathname,collapsed])

    // 左侧菜单类名
    const firstMenuClass = useMemo(()=>{
        return [
            'h-full overflow-auto menu-box dark:border-[#424242] border-0 border-r-[1px] border-solid',
            ( menuFlipColor ? '!border-[#424242]' : 'border-[#e8e8e8]' )
        ].join(' ')
    },[menuFlipColor,isDark])

    useEffect(()=>{
        setRouter(firstMenuActive)
    },[firstMenuActive])

    // 左侧第一层菜单
    const firstMenuCont = useMemo(()=>{
        return (
            <div className='flex flex-col'>
                { getFirstMenu(menuList).map(menu=>{
                    return (
                        <div key={`${menu.id}_${menu.path}`} className='px-1' onClick={()=>toPath(menu)}>
                            <div 
                                className={ 
                                    [
                                        'text-center cursor-pointer py-2 my-1 wadmin-radius',
                                        firstMenuActive === menu.path ? 'columns-active' : ''
                                    ].join(' ') 
                                }
                            >
                                <div>
                                    { menu?.icon || '' }
                                </div>
                                <div className='w-[70px]'>
                                    { menu.title }
                                </div>
                            </div>
                        </div>
                    )
                }) }
            </div>
        )
    },[menuList,pathname])

    // 跳转页面
    const toPath = (menu:any)=>{
        if(menu.component !== 'Layout') {
            pathname !== menu.path && navigate(menu.path)
        } else {
            setRouter(menu.path)
        }
    }

    // 子级菜单类名
    const ChildrenMenuClass = useMemo(()=>{
        return [
            'h-full overflow-auto dark:border-[#424242] menu-box border-0 border-r-[1px] border-solid',
            ( menuFlipColor ? 'border-[#424242]' : 'border-[#e8e8e8]' )
        ].join(' ')
    },[childrenRoute,menuFlipColor,isDark])

    // 菜单主题
    const menuTheme = useMemo(()=> menuFlipColor || isDark ? 'dark' : 'light',[menuFlipColor, isDark])
    
    // 菜单点击
    const onClick = (data:any)=>{
        if(pathname === data.key) return
        navigate(data.key, { replace: true })
    }

    // 默认只展开一个父级菜单 保存一级目录layouy
    const rootSubmenuKeys = useMemo(()=>{
        return menuList.map(x => x.component === 'Layout' && x.path)
    },[menuList]) 

    // 菜单点击
    const onOpenChange = (openKey: string[])=>{
        const latestOpenKey = openKey.find(key => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
            setOpenKeys(openKey)
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
        }
    }

    // 子级菜单配置
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

    // 外部盒子类名
    const wrapClass = useMemo(()=>{
        return ['flex h-screen ',( menuFlipColor && !isDark ? '!bg-[#001529] text-white' : 'content-bg' )].join(' ')
    },[menuFlipColor,isDark])

    return <div className={wrapClass}>
        <div className={firstMenuClass}>
            <div className='flex justify-center h-[55px]'>
                <Avatar size={50} src={getAssets(VITE_PROJECT_LOGO)} />
            </div>
            { firstMenuCont }
        </div>
        <div className={[
                'columns-sider',( !childrenRoute.length ? 'columns-no-sider' : '' ),
                ((collapsed && childrenRoute.length) ? '!w-[70px]' : ''),
            ].join(' ')}
            style={{ width: `${sidebarWidth - 78}px` }}
            >
            <div className={ChildrenMenuClass}>
                { !collapsed && 
                    <div className='font-bold flex h-[55px] items-center text-[24px] justify-center'>
                        <span>{ VITE_PROJECT_NAME }</span>
                    </div>
                }
                <Menus
                    style={{ background: isDark ? '#141414' : '' }}
                    items={menuItems(childrenRoute)}
                    {...menuConfig}
                />
            </div>
        </div>
    </div>
}

const mapStateToProps = (state: StoreType) => ({
    menuList:state.userStore.userRouterList,
    collapsed:state.configStore.collapsed,
    menuType:state.configStore.theme.menuType,
    isDark:state.configStore.theme.isDark,
    menuFlipColor:state.configStore.theme.menuFlipColor,
    sidebarWidth:state.configStore.component.sidebarWidth,
});

export default connect(mapStateToProps)(Columns);