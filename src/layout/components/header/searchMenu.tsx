import { Input, Tooltip, Empty } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { SearchOutlined, EnterOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { useTranslation } from "react-i18next";
import WModal from '@/components/modal/index'
import './index.less'
import { use } from 'i18next';

interface Active {
    title: string;
    icon: string;
    path: string;
}

const SearchMenu = ()=>{
    const { t } = useTranslation();
    const [ open, setOpen ] = useState(false)
    const [ value, setValue ] = useState('')

    const [ menuList, setMenuList ] = useState<Active[][]>([])

    const MenuHander = useMemo(()=>{
        return (
            <div className='mt-4 max-h-[500px] overflow-y-auto px-1'>
                { menuList.length ? menuList.map((item,index)=>{
                    return <div
                        key={index}
                        className='flex items-center justify-between p-4 my-2 bg-white rounded-md shadow-md cursor-pointer dark:bg-[#1f1f1f] dark:text-white dark:border'
                    >

                    </div>
                }) : <Empty description={ t('layouts.emptyMenu') }/> }
            </div>
        )
    },[menuList])
    
    return <>
        <Tooltip title={ t('layouts.menuSearch') }>
            <SearchOutlined onClick={()=>{ setOpen(true) }} style={{ fontSize: '20px', cursor: 'pointer' }}/>
        </Tooltip>
        <WModal option={{
            title: t('layouts.menuSearch'),
            width: 700,
            open,
            onCancel:()=>{setOpen(false)},
        }}>
            {/* 搜索 */}
            <div className='px-1'>
                <Input
                    id="searchInput"
                    size="large"
                    allowClear
                    value={value}
                ></Input>
            </div>

            {/* 查询出来的菜单 */}
            { MenuHander }
            {/* 底部提示 */}
            <div className="flex items-center px-1 mt-4">
                <div className="flex items-center">
                    <EnterOutlined className="mr-2 btn" />
                    <span>{ t("buttons.confirm") }</span>
                </div>
                <div className="flex items-center mx-4">
                    <ArrowUpOutlined className="btn" />
                    <ArrowDownOutlined className="mx-2 btn" />
                <span>{ t("buttons.switch") }</span>
                </div>
                <div className="flex items-center">
                    <div className="px-1 btn">esc</div>
                    <span>{ t("buttons.close") }</span>
                </div>
            </div>
        </WModal>
    </>
}

export default SearchMenu