import UserContainer from "./user"
import Breadcrumb from './breadcrumb'
import HeaderMenu from './menu'
import { StoreType, configStoreType } from '@/redux/interface/index'
import Logo from '../logo'
import { useMemo } from 'react'
import { connect } from "react-redux"

type ThemeType = configStoreType['theme']

const Header:React.FC<Partial<{
    sidebarWidth:configStoreType['component']['sidebarWidth'],
    collapsed:configStoreType['collapsed'],
    menuType:ThemeType['menuType'],
    headerFlipColor:ThemeType['headerFlipColor'],
    menuFlipColor:ThemeType['menuFlipColor'],
    isDark:ThemeType['isDark'],
}>> = (props) => {
    const { sidebarWidth, menuType, headerFlipColor, menuFlipColor, isDark, collapsed } = props

    const logoStyle = useMemo<React.CSSProperties>(()=>{
        return {
            width: `${collapsed && menuType !== 'transverse' ? 70 : sidebarWidth}px`,
            height: '50px',
        }
    },[
        sidebarWidth,
        collapsed,
        menuType
    ])

    const classNames = useMemo(()=>{
        const name = [
            'flex content-bg border-0 border-b-[1px] border-[#e8e8e8] dark:border-[#424242] border-solid',
            (!isDark && headerFlipColor && '!bg-[#001529] text-white border-[#424242]'),
            ( (menuFlipColor && headerFlipColor) && '!border-[#424242]'),
        ]
        return name.join(' ')
    },[headerFlipColor,isDark,menuFlipColor])

    return (
        <div className={classNames}>
            { 
                ['classic','transverse'].includes(menuType as ThemeType['menuType']) && 
                <div style={logoStyle}>
                    <Logo /> 
                </div>
            } 
            <div className="flex-1">
                <div className="h-[50px] flex-1 flex justify-between items-center">
                    {
                        menuType === 'transverse' ? 
                        <HeaderMenu /> : <Breadcrumb />
                    }
                    <UserContainer></UserContainer>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state: StoreType) => ({
    sidebarWidth:state.configStore.component.sidebarWidth,
    collapsed:state.configStore.collapsed,
    menuType:state.configStore.theme.menuType,
    headerFlipColor:state.configStore.theme.headerFlipColor,
    menuFlipColor:state.configStore.theme.menuFlipColor,
    isDark:state.configStore.theme.isDark,
})

export default connect(mapStateToProps)(Header)