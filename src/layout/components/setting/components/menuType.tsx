import { store } from '@/redux/index'
import { memo } from 'react'
import { useTranslation } from "react-i18next";
import { menuTypeEnum } from '@/enums/sys'
import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip, Switch  } from 'antd'
import type { configStoreType } from '@/redux/interface/index'

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
        { title: t("layouts.menuType1"), mode: menuTypeEnum.vertical },
        { title: t("layouts.menuType2"), mode: menuTypeEnum.classic },
        { title: t("layouts.menuType3"), mode: menuTypeEnum.transverse },
        { title: t("layouts.menuType4"), mode: menuTypeEnum.columns },
    ]
    
    const chnageConfigType = (value:configStoreType['theme'])=>{
        store.dispatch({
            type:'SET_THEME',
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
                                onClick={()=>chnageConfigType({...props.theme,menuType:menu.mode})}
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
                    defaultChecked={ menuFlipColor }
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
                    defaultChecked={ headerFlipColor }
                    onChange={()=>chnageConfigType({...props.theme,headerFlipColor:!headerFlipColor})}
                />
            </div>
        </>
    )
}

export default memo(MenuType)