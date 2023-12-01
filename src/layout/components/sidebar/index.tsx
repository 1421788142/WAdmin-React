import React, { useMemo } from 'react'
import { StoreType, configStoreType, userStoreType } from '@/redux/interface/index'
import Logo from '../logo'
import { connect } from 'react-redux';
import Wrapper from './wrapper'
import Menus from './menus'

type ThemeType = configStoreType['theme']

const Sidebar:React.FC<Partial<{
    menuType:ThemeType['menuType'],
    collapsed:configStoreType['collapsed'],
    userRouterList:userStoreType['userRouterList']
}>> = (props) => {
    const {
        menuType,
        collapsed,
    } = props
    
    const menuBoxClass = useMemo(()=>{
        return ['flex-1 overflow-auto menu-box',(collapsed ? 'menu-box-collapsed' : '')].join(' ')
    },[collapsed])

    return (
        <Wrapper>
            <div>
                { menuType === 'vertical' && <Logo /> }
                <div className={menuBoxClass}>
                    <Menus/>
                </div>
            </div>
        </Wrapper>
    )
}

const mapStateToProps = (state: StoreType) => ({
    collapsed:state.configStore.collapsed,
    menuType:state.configStore.theme.menuType,
});

export default connect(mapStateToProps)(Sidebar);