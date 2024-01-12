import { store } from '@/redux/index'
import { memo } from 'react'
import { useTranslation } from "react-i18next";
import { MENU_TYPE_ENUM } from '@/enums/sys'
import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip, Switch  } from 'antd'
import type { configStoreType } from '@/redux/interface/index'
import { REDUX_CONFIG_ENUM } from '@/enums/redux';

interface menuTypeInterface {
    title: string;
    mode: configStoreType['theme']['menuType'];
}

const MenuType = (props:{
    theme:configStoreType['theme']
})=>{
    const { menuType, menuFlipColor, headerFlipColor } = props.theme;
    const { t } = useTranslation();
    // 菜单类型
    const menuTypeList:menuTypeInterface[] = [
        { title: t("layouts.menuType1"), mode: MENU_TYPE_ENUM.VERTICAL },
        { title: t("layouts.menuType2"), mode: MENU_TYPE_ENUM.CLASSIC },
        { title: t("layouts.menuType3"), mode: MENU_TYPE_ENUM.TRANSVERSE },
        { title: t("layouts.menuType4"), mode: MENU_TYPE_ENUM.COLUMNS },
    ]
    
    const chnageConfigType = (value:configStoreType['theme'])=>{
        store.dispatch({
            type:REDUX_CONFIG_ENUM.SET_THEME,
            theme:value
        })
    }
    return (
        <>
            <div className="flex flex-wrap justify-between w-full mt-2">
                { menuTypeList.map(menu=>{
                    return (
                        <Tooltip placement='bottom' title={menu.title} key={menu.mode}>
                            <div className={ 
                                    ['layout-item', menu.mode ,menuType === menu.mode ? 'active' : ''].join(' ') 
                                }
                                onClick={()=>{
                                    if(menuType !== menu.mode){
                                        chnageConfigType({...props.theme,menuType:menu.mode})
                                    }
                                }}
                            >
                                <div className="layout-menu"></div>
                                <div className="layout-container">
                                    <div className="layout-light"></div>
                                    <div className="layout-content"></div>
                                </div>
                                <div className="icon">
                                    <CheckCircleOutlined />
                                </div>
                            </div>
                        </Tooltip>
                    )
                }) }
            </div>
            <div className="flex items-center justify-between my-4">
                <div className='dark:text-[#ffffffd9]'>
                    <span className='mr-1'>{ t("layouts.menuFlip") }</span>
                    <Tooltip title={ t('layouts.menuFlipTip') }>
                        <QuestionCircleOutlined className='cursor-pointer'/>
                    </Tooltip>
                </div>
                <Switch
                    checked={ menuFlipColor }
                    onChange={()=>chnageConfigType({...props.theme,menuFlipColor:!menuFlipColor})}
                />
            </div>
            <div className="flex items-center justify-between my-4">
                <div className='dark:text-[#ffffffd9]'>
                    <span className='mr-1'>{ t("layouts.headerFlip") }</span>
                    <Tooltip title={ t('layouts.headerFlipTip') }>
                        <QuestionCircleOutlined className='cursor-pointer'/>
                    </Tooltip>
                </div>
                <Switch
                    checked={ headerFlipColor }
                    onChange={()=>chnageConfigType({...props.theme,headerFlipColor:!headerFlipColor})}
                />
            </div>
        </>
    )
}

export default memo(MenuType)