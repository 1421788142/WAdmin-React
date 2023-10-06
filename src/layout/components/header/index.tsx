import UserContainer from "./user"
import HistoryTag from '../tag/index'
import Breadcrumb from './breadcrumb'
import HeaderMenu from './menu'
import { StoreType } from '@/redux/interface/index'
import Logo from '../logo'
import { useMemo } from 'react'


const Header = (props:StoreType) => {
    const { configStore, userStore } = props

    const { component, theme } = configStore

    const logoStyle = useMemo<React.CSSProperties>(()=>{
        return {
            width: `${component.sidebarWidth}px`,
            height: '50px',
        }
    },[
        component.sidebarWidth,
    ])

    const classNames = useMemo(()=>{
        const name = [
            'flex content-bg border-0 border-b-[1px] border-[#e8e8e8] dark:border-[#424242] border-solid',
            (!theme.isDark && theme.headerFlipColor && '!bg-[#001529] text-white border-[#424242]'),
        ]
        return name.join(' ')
    },[theme.headerFlipColor,theme.isDark])

    return (
        <div className={classNames}>
            { 
                ['classic','transverse'].includes(configStore.theme.menuType) && 
                <div style={logoStyle}>
                    <Logo configStore={configStore} /> 
                </div>
            } 
            <div className="flex-1">
                <div className="h-[50px] flex-1 flex justify-between items-center">
                    {
                        configStore.theme.menuType === 'transverse' ? 
                        <HeaderMenu {...props} /> :
                        <Breadcrumb configStore={configStore} />
                    }
                    <UserContainer></UserContainer>
                </div>
                {/* <HistoryTag/> */}
            </div>
        </div>
    )
}

export default Header