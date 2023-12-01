import { Avatar } from 'antd'
import { getAssets } from '@/utils/index'
import { useMemo } from 'react'
import { StoreType, configStoreType } from '@/redux/interface/index'
import { connect } from 'react-redux'
 
type ThemeType = configStoreType['theme']

const Logo:React.FC<{
    collapsed:configStoreType['collapsed'],
    menuFlipColor:ThemeType['menuFlipColor'],
    headerFlipColor:ThemeType['headerFlipColor'],
    menuType:ThemeType['menuType'],
    isDark:ThemeType['isDark'],
}> = (props)=>{
    const { VITE_PROJECT_NAME, VITE_PROJECT_LOGO } = import.meta.env
    const { collapsed, menuFlipColor, headerFlipColor, menuType, isDark } = props
    const classNames = useMemo(()=>{
        const name = [
            'flex items-center box-border h-[50px] justify-center cursor-pointer',
            (
                (( menuType === 'vertical' && menuFlipColor ) || ( menuType === 'classic' && headerFlipColor ))
                && '!bg-[#001529] text-white'
            ),
            (
                (isDark) && '!bg-[#141414] text-white'
            )
            
        ]
        return name.join(' ')
    },[menuFlipColor,menuType,headerFlipColor, isDark])

    return (
        <div className={classNames}>
            <Avatar size={50} src={getAssets(VITE_PROJECT_LOGO)} />
            { (!collapsed || menuType === 'transverse') && <span className='ml-4 font-bold text-[28px] truncate'>{ VITE_PROJECT_NAME }</span> }
        </div>
    )
}

const mapStateToProps = (state: StoreType) => ({
    collapsed:state.configStore.collapsed,
    menuFlipColor:state.configStore.theme.menuFlipColor,
    headerFlipColor:state.configStore.theme.headerFlipColor,
    menuType:state.configStore.theme.menuType,
    isDark:state.configStore.theme.isDark,
});
export default connect(mapStateToProps)(Logo);