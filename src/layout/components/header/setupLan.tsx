import { Dropdown } from 'antd'
import { store } from '@/redux/index'
import type { MenuProps } from 'antd';
import { TranslationOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";

const Setup = ()=>{
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

    return (
        <div className='flex items-center login'>
            <Dropdown trigger={['click']} menu={{items:dropdownMenu}} placement="bottomLeft">
                <span className="ml-4 leading-4 cursor-pointer">
                    <TranslationOutlined style={{fontSize: '20px'}} />
                </span>
            </Dropdown>
        </div>
    )
}

export default Setup