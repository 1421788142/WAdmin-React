import Theme from './theme'
import MenuType from './menuType'
import Primary from './primary'
import SetCom from './setCom'
import { useTranslation } from "react-i18next";
import { Divider } from 'antd'
import { connect } from "react-redux";
import type { configStoreType } from '@/redux/interface/index'

const SettingCon = (props?:configStoreType)=>{
    const { t } = useTranslation();
    const { theme, component } = props as configStoreType;
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
                    <Theme isDark={ theme.isDark } />
                </div>
                <Primary theme={theme} />
            </div>
            <Divider>
                <span className='text-sm'>📏 {t('layouts.controlSize')}</span>
            </Divider>
            <div className='w-full'>
                <SetCom component={component}/>
            </div>
        </div>
    </>
}   

const mapStateToProps = (state: {
    configStore: configStoreType
}) => state.configStore;
export default connect(mapStateToProps)(SettingCon);