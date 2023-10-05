import { Radio, InputNumber } from 'antd'
import type { configStoreType } from '@/redux/interface/index'
import type { RadioChangeEvent } from 'antd/es/radio/interface'
import { memo, useMemo } from 'react'
import { store } from '@/redux/index'
const SetPrimary = (props:{
    component:configStoreType['component']
})=>{

    const comRadius = useMemo(()=>{
        return <InputNumber 
            min={1} max={20}  
            onChange={val=>store.dispatch({
                type:'SET_COMPONENT',
                component:{
                        ...store.getState().configStore.component,
                        borderRadius:val
                    }
                })
            }
            formatter={(value) => `${value}px`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            value={props.component.borderRadius}
            />
    },[ props.component.borderRadius ])

    const sidebarWidth = useMemo(()=>{
        return <InputNumber 
            min={100} step={10} max={400}  
            onChange={val=>store.dispatch({
                type:'SET_COMPONENT',
                component:{
                        ...store.getState().configStore.component,
                        sidebarWidth:val
                    }
                })
            }
            formatter={(value) => `${value}px`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            value={props.component.sidebarWidth}
            />
    },[ props.component.sidebarWidth ])

    return <>
        <div className="flex justify-center">
            <Radio.Group
                options={[
                    { label: 'small', value: 'small' },
                    { label: 'middle', value: 'middle' },
                    { label: 'large', value: 'large' }
                ]}
                value={props.component.size}
                onChange={(val:RadioChangeEvent)=>store.dispatch({
                    type:'SET_COMPONENT',
                    component:{
                        ...store.getState().configStore.component,
                        size:val.target.value
                    }
                })}
                optionType="button"
                buttonStyle="solid"
            />
        </div>
        <div className="flex items-center justify-between my-4">
            <div className='dark:text-[#ffffffd9]'>
                <span className='mr-1'>控件圆角</span>
            </div>
            { comRadius }
        </div>
        <div className="flex items-center justify-between my-4">
            <div className='dark:text-[#ffffffd9]'>
                <span className='mr-1'>侧栏菜单宽度</span>
            </div>
            { sidebarWidth }
        </div>
    </>
}

export default memo(SetPrimary)