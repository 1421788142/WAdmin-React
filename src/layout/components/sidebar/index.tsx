import React, { memo, useMemo } from 'react'
import Menus from '../menu'
import { useMenu } from '@/hooks/useMenu';
import { useNavigate, useLocation } from 'react-router-dom'
import { StoreType } from '@/redux/interface/index'
import Logo from '../logo'
import { menuItems } from '@/layout/utils/menuItems';

const Sidebar = (props:StoreType) => {
    const { configStore, userStore } = props

    const { component, theme } = configStore

    const wrapStyle = useMemo<React.CSSProperties>(()=>{
        return {
            width: `${component.sidebarWidth}px`,
            backgroundColor:(theme.menuFlipColor && !theme.isDark) ? '#001529' : theme.isDark ? '#141414' : '#fff',
        }
    },[
        component.sidebarWidth,
        theme.menuFlipColor,
        theme.isDark
    ])

    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <div style={wrapStyle} className='flex flex-col border-0 border-r-[1px] border-[#e8e8e8] dark:border-[#424242] border-solid'>
            { configStore.theme.menuType === 'vertical' && <Logo configStore={configStore} /> } 
            <div className='flex-1 overflow-auto menu-box'>
                <Menus 
                    items={menuItems(userStore.userRouterList)}
                    {...useMenu({
                        userStore,
                        theme:configStore.theme,
                        navigate,
                        pathname
                    })}
                />
            </div>
        </div>
    )
}

export default memo(Sidebar);