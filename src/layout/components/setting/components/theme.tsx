import { Switch } from 'antd'
import SvgIcon from '@/components/SvgIcon'
import { store } from '@/redux/index'
import { memo } from 'react'
import { connect } from 'react-redux'
import { StoreType, configStoreType } from '@/redux/interface'
import { REDUX_CONFIG_ENUM } from '@/enums/redux'

const Theme:React.FC<{
    theme:configStoreType['theme']
}> = (props)=>{
    const { theme } = props

    const chnageDark = (val:boolean)=>{
        store.dispatch({
            type:REDUX_CONFIG_ENUM.SET_THEME,
            theme:{
                ...theme,
                isDark:val
            }
        })
    }
    const iconStyle = { width: 20, height: 20, margin:'' };
    return (
        <div className='theme'>
            <Switch
                checked={ theme.isDark }
                checkedChildren={<SvgIcon name='sun' iconStyle={{...iconStyle,height:25}} />}
                unCheckedChildren={<SvgIcon name='moon' iconStyle={{...iconStyle,height:25}} />}
                onChange={chnageDark} 
            />
        </div>
    )
}


const mapStateToProps = (state: StoreType) => ({
    theme:state.configStore.theme
})
export default connect(mapStateToProps)(memo(Theme))