import Theme from './theme'
import MenuType from './menuType'
import Primary from './primary'
import SetCom from './setCom'
import PageSet from './pageSet'
import { useTranslation } from "react-i18next";
import { Divider, Button, App } from 'antd'
import { connect } from "react-redux";
import type { configStoreType } from '@/redux/interface/index'
import { store } from '@/redux'
import { useNavigate } from 'react-router-dom'
import { REDUX_CONFIG_ENUM, REDUX_USER_ENUM } from '@/enums/redux'

const SettingCon = (props?:configStoreType)=>{
    const { t } = useTranslation();
    const { theme, component } = props as configStoreType;
    const app = App.useApp()
    const navigate = useNavigate()

    const resetConfig = async (hasLogin:boolean = false)=>{
        try {
            app.message.loading('重置中...')
            store.dispatch({
                type:REDUX_CONFIG_ENUM.RESET_CONFIG
            })
        } finally {
            setTimeout(()=>{
                if(hasLogin){
                    store.dispatch({ type:REDUX_USER_ENUM.LOGIN_OUT })
                    setTimeout(()=>{
                        store.dispatch({
                            type:REDUX_USER_ENUM.SET_USER_ROUTER,
                            routerList:[]
                        })
                    },200)
                }
                app.message.destroy()
                app.message.success('重置成功')
            },200)
        }
    }
    return <>
        <div className='flex flex-col items-center w-full'>
            <Divider>
                <span className='text-sm'>⚒ {t('layouts.navigationMode')}</span>
            </Divider>
            <div className='w-full'>
                <MenuType theme={theme}/>
            </div>
            <Divider>
                <span className='text-sm'>🎨 {t('layouts.systemTheme')}</span>
            </Divider>
            <div className='w-full'>
                <div className='flex justify-center mb-4'>
                    <Theme />
                </div>
                <Primary theme={theme} />
            </div>
            <Divider>
                <span className='text-sm'>📏 {t('layouts.controlSize')}</span>
            </Divider>
            <div className='w-full'>
                <SetCom component={component}/>
            </div>
            <Divider>
                <span className='text-sm'>📏 {t('layouts.projectConfig')}</span>
            </Divider>
            <div className='w-full'>
                <PageSet configStore={props as configStoreType}/>
            </div>
            {/* 操作按钮 */}
            <div className='flex flex-col w-full pb-4'>
                <Button className='w-full my-2' onClick={()=>resetConfig()}>重置</Button>
                <Button onClick={()=>resetConfig(true)}>清空缓存并退出登录</Button>
            </div>
        </div>
    </>
}   

const mapStateToProps = (state: {
    configStore: configStoreType
}) => state.configStore;
export default connect(mapStateToProps)(SettingCon);