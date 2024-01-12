import { store } from '@/redux/index'
import { Tooltip, Switch  } from 'antd'
import type { configStoreType } from '@/redux/interface/index'
import { useTranslation } from "react-i18next";
import { REDUX_CONFIG_ENUM } from '@/enums/redux';

const PageSet = (props:{
    configStore:configStoreType
})=>{

    const { collapsed } = props.configStore
    const { t } = useTranslation();

    return (<>
        <div className="flex items-center justify-between my-4">
            <div className='dark:text-[#ffffffd9]'>
                <span className='mr-1'>{ t("layouts.collapseMenu") }</span>
            </div>
            <Switch
                checked={ collapsed }
                onChange={()=>store.dispatch({
                    type:REDUX_CONFIG_ENUM.SET_COLLAPSED,
                    collapsed:!collapsed
                })}
            />
        </div>
    </>)
}

export default PageSet