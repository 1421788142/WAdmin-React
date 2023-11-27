import { Avatar } from 'antd'
import { getAssets } from '@/utils/index'
import { memo, useMemo } from 'react'
import { configStoreType } from '@/redux/interface/index'
 
const Logo = (props:{
    configStore:configStoreType
})=>{
    const { VITE_PROJECT_NAME, VITE_PROJECT_LOGO } = import.meta.env

    const { theme, collapsed } = props.configStore

    const classNames = useMemo(()=>{
        const name = [
            'flex items-center box-border h-[50px] justify-center cursor-pointer',
            ((
                (theme.menuFlipColor || theme.headerFlipColor) && 
                theme.menuType === 'vertical'
            ) && 
                '!bg-[#001529] text-white'
            ),
            
        ]
        return name.join(' ')
    },[theme.menuFlipColor])

    return (
        <div className={classNames}>
            <Avatar size={50} src={getAssets(VITE_PROJECT_LOGO)} />
            { (!collapsed || theme.menuType === 'transverse') && <span className='ml-4 font-bold text-[28px] truncate'>{ VITE_PROJECT_NAME }</span> }
        </div>
    )
}

export default memo(Logo)