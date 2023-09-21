import { Switch, Dropdown } from 'antd'
import SvgIcon from '@com/svgIcon'
import { connect } from "react-redux";
import { store } from '@/redux/index'
import type { configStoreType } from '@/redux/interface/index'
import type { MenuProps } from 'antd';
import { TranslationOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";

const Theme = (props?:configStoreType)=>{
    const { t } = useTranslation();
    const dropdownMenu:MenuProps['items'] = [
        {
            key: 'zh',
            label: (
            <span onClick={()=>{store.dispatch({type:'SET_LANGUAGE',language:'zh'})}}> { t('sys.zhCN') } </span>
            ),
        },
        {
            key: 'en',
            label: (
                <span onClick={()=>{store.dispatch({type:'SET_LANGUAGE',language:'en'})}}> { t('sys.enCN') } </span>
            ),
        }
    ]
  const { theme:sysTheme, } = props as configStoreType;
    const chnageDark = (val:boolean)=>{
        store.dispatch({
            type:'SET_THEME',
            theme:{
                ...sysTheme,
                isDark:val
            }
        })
    }
    const iconStyle = { width: 20, height: 20, margin:'' };
    return (
        <div className='login'>
            <Switch
                defaultChecked={ sysTheme.isDark }
                checkedChildren={<SvgIcon name='sun' iconStyle={{...iconStyle,height:25}} />}
                unCheckedChildren={<SvgIcon name='moon' iconStyle={{...iconStyle,height:25}} />}
                onChange={chnageDark} 
            />
            <Dropdown trigger={['click']} menu={{items:dropdownMenu}} placement="bottomLeft">
                <span className="ml-4 leading-4 cursor-pointer">
                    <TranslationOutlined style={{fontSize: '20px'}} />
                </span>
            </Dropdown>
        </div>
    )
}

const mapStateToProps = (state: {
    configStore: configStoreType
  }) => state.configStore;
  export default connect(mapStateToProps)(Theme);