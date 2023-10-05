import { ColorPicker, Switch, Button } from 'antd'
import type { ColorPickerProps } from 'antd'
import type { configStoreType } from '@/redux/interface/index'
import { memo, useMemo } from 'react'
import { store } from '@/redux/index'
import { CheckCircleOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";

const colors = [
    "#009688",
    "#1890FF",
    "#9C27B0",
    "#02B96C",
    "#FF9800",
    "#FF5C93",
    "#BAA380",
    "#23D5DB"
]
const systemTheme:ColorPickerProps['presets'] = [
    {
        label: '建议',
        colors:colors
    }
]

const SetPrimary = (props:{
    theme:configStoreType['theme'],
})=>{
    const { t } = useTranslation();
    // 修改主题颜色
    const changeColor = (value:string)=>{
        store.dispatch({
            type:'SET_THEME',
            theme:{
                ...props.theme,
                primary:value.toUpperCase()
            }
        })
    }

    const changeMode = ( data: Partial<configStoreType['theme']>)=>{
        store.dispatch({
            type:'SET_THEME',
            theme:{
                ...store.getState().configStore.theme,
                ...data
            }
        })
    }

    const graySwitch = useMemo(()=>{
        return (
            <Switch
                checked={ props.theme.weakOrGray === 'gray' }
                onChange={(value)=>changeMode({weakOrGray:value ? 'gray' : ''})}
            />
        )
    },[props.theme.weakOrGray])

    const happySwitch = useMemo(()=>{
        return (
            <Switch
                checked={ props.theme.isHappy }
                onChange={(value)=>changeMode({isHappy:value })}
            />
        )
    },[props.theme.isHappy])

    const weakSwitch = useMemo(()=>{
        return (
            <Switch
                checked={ props.theme.weakOrGray === 'weak' }
                onChange={(value)=>changeMode({weakOrGray:value ? 'weak' : ''})}
            />
        )
    },[props.theme.weakOrGray])

    return <>
        <div className='flex justify-center'>
            <ColorPicker
                value={props.theme.primary}
                format='rgb'
                presets={systemTheme}
                onChange={(val)=>changeColor(val.toHexString())}
                placement={'top'}
            />        
        </div>
        <div className="flex justify-between mt-4">
            { colors.map((color,index)=>{
                return(
                    <Button
                        className="!w-[30px] !p-0 !h-[30px] color-active cursor-pointer flex justify-center items-center border-[1px]"
                        style={{ backgroundColor: color as string }}
                        onClick={()=>changeColor(color)}
                        key={`color_${index}`}
                    >
                        { color ===  props.theme.primary ? <CheckCircleOutlined className='text-white'/> : ''}
                    </Button>
                )
            }) }
        </div>
        <div className="flex items-center justify-between my-4">
            <div className='dark:text-[#ffffffd9]'>
                <span className='mr-1'>{ t("layouts.grayMode") }</span>
            </div>
            { graySwitch }
        </div>
        <div className="flex items-center justify-between my-4">
            <div className='dark:text-[#ffffffd9]'>
                <span className='mr-1'>{ t("layouts.colorWeaknessMode") }</span>
            </div>
            { weakSwitch }
        </div>
        <div className="flex items-center justify-between my-4">
            <div className='dark:text-[#ffffffd9]'>
                <span className='mr-1'>{ t("layouts.happyWork") }</span>
            </div>
            { happySwitch }
        </div>
    </>
}

export default memo(SetPrimary)