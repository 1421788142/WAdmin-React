import React, { memo, useMemo, useState, useEffect } from 'react'
import { StoreType } from '@/redux/interface/index'
import Menus from '../menu'
import { getFirstMenu, setBreadCrumbs } from '@/layout/utils'
import { useNavigate, useLocation } from 'react-router-dom'
import { menuItems } from '@/layout/utils/menuItems';
import { useMenu } from '@/hooks/useMenu';
import { Avatar } from 'antd'
import { getAssets } from '@/utils/index'
import config from '../../../../public/config'

const Columns = (props:StoreType) => {
    const { configStore, userStore } = props
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { VITE_PROJECT_NAME, VITE_PROJECT_LOGO } = import.meta.env

    const { menuFlipColor, isDark } = configStore.theme

    const firstMenuActive = useMemo(()=>{
        const crumbsList = setBreadCrumbs(pathname)
        return crumbsList[0]?.path || config.homePath
    },[pathname])

    const setRouter = (path:string)=>{
        let route = userStore.userRouterList.flatMap(x=>x.path === path ? x?.children || [] : [])
        setChildrenRoute(route)
    }


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
                { getFirstMenu(userStore.userRouterList).map(menu=>{
                    return (
                        <div key={`${menu.id}_${menu.path}`} className='px-1' onClick={()=>toPath(menu)}>
                            <div 
                                className={ 
                                    [
                                        'text-center cursor-pointer py-2 my-1',
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
    },[userStore.userRouterList,pathname])

    // 右侧子菜单
    const [childrenRoute,setChildrenRoute] = useState<menuListType[]>([])
    // 跳转页面
    const toPath = (menu:any)=>{
        if(menu.component !== 'Layout'){
            navigate(menu.path)
        }
        setRouter(menu.path)
    }

    const ChildrenMenuClass = useMemo(()=>{
        return [
            'h-full overflow-auto dark:border-[#424242] menu-box border-0 border-r-[1px] border-solid',
            ( menuFlipColor ? 'border-[#424242]' : 'border-[#e8e8e8]' )
        ].join(' ')
    },[childrenRoute,menuFlipColor,isDark])

    const menuConfig = useMenu({
        userStore,
        theme:configStore.theme,
        navigate,
        pathname
    })

    const ChildrenMenu = ()=>{
        return (
            <div className={ChildrenMenuClass}>
                <div className='font-bold flex h-[55px] items-center text-[24px] justify-center'>
                    <span>{ VITE_PROJECT_NAME }</span>
                </div>
                <Menus
                    items={menuItems(childrenRoute)}
                    {...menuConfig}
                />
            </div>
        )
    }

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
        <div className={['w-[0px] columns-sider',( !childrenRoute.length ? 'columns-no-sider' : '' )].join(' ')}>
            <ChildrenMenu />
        </div>
    </div>
}

export default memo(Columns)