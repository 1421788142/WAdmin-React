import { Switch } from 'antd'
import SvgIcon from '@com/svgIcon'
import { store } from '@/redux/index'
import { memo } from 'react'

const Theme = ()=>{
    const chnageDark = (val:boolean)=>{
        store.dispatch({
            type:'SET_THEME',
            theme:{
                ...store.getState().configStore.theme,
                isDark:val
            }
        })
    }
    const iconStyle = { width: 20, height: 20, margin:'' };
    return (
        <div className='theme'>
            <Switch
                defaultChecked={ store.getState().configStore.theme.isDark }
                checkedChildren={<SvgIcon name='sun' iconStyle={{...iconStyle,height:25}} />}
                unCheckedChildren={<SvgIcon name='moon' iconStyle={{...iconStyle,height:25}} />}
                onChange={chnageDark} 
            />
        </div>
    )
}

export default memo(Theme)