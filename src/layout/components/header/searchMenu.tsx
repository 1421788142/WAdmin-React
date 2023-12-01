import { Input, Tooltip, Empty, App } from 'antd'
import { useMemo, useRef, useState } from 'react'
import { SearchOutlined, EnterOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { useTranslation } from "react-i18next";
import WModal from '@/components/modal/index'
import './index.less'
import { screenPageList, iconNameCase } from '@/layout/utils';
import AntdIcon from '@/components/antdIcon';
import { customIconType } from '@com/antdIcon/index'
import { debounce } from '@/utils/index'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

interface Active {
    title: string;
    icon: customIconType['component'];
    path: string;
}

const SearchMenu = ()=>{
    const { t } = useTranslation();
    const [ open, setOpen ] = useState(false)
    const [ menuActive, setMenuActive ] = useState<Active | null>()
    const [ menuList, setMenuList ] = useState<Active[][]>([])
    const navigate = useNavigate();
    const location = useLocation();
    const app = App.useApp()

    const getMenu = (val:any)=> {
        const value = val.target.value
        if (value && value.length > 0) {
            const filterMenu = screenPageList<Active>(value)
            setMenuList(()=>filterMenu)
            if (filterMenu.length === 0) return false;
            let menuItem = filterMenu[0];
            setMenuActive(()=>menuItem[menuItem.length - 1] ?? null);
          } else {
            setMenuList(()=>[]);
        }
    }

    const setMenuFn = debounce(getMenu,200)

    // 是否高亮
    const hasHight = (val: Active[]): boolean => {
        let has = false;
        if (val.length > 0 && val[val.length - 1].path === menuActive?.path) {
            has = true;
        }
        return has;
    };

    // 设置高亮
    const setHighlight = (val: Active[]) => {
        setMenuActive(()=>val.length > 0 ? val[val.length - 1] : null)
    };

    // 跳转页面
    const toPage = (val: Active[]) => {
        setHighlight(val);
        if (location.pathname === menuActive?.path)
        return app.message.error(t("layouts.toHisPageError"));
        navigate(menuActive?.path || '/');
        setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
        let downKey = e.keyCode || e.which;
        let isHasKey = [40, 38, 13].includes(downKey);
        if (isHasKey && menuList.length && menuActive && open) {
            let index: number = menuList.findIndex(
                x => x[x.length - 1].path === menuActive.path,
            ); //下标
            let menuLength = menuList.length;
            let firstItem = menuList[0][menuList[0].length - 1]; //第一个菜单
            let lastItem = menuList[menuLength - 1][menuList[menuLength - 1].length - 1]; //最后一个菜单
            if (downKey === 38) {
                //上
                if (index > 0) {
                    setMenuActive(()=>menuList[index - 1][menuList[index - 1].length - 1])
                } else {
                    setMenuActive(()=>lastItem)
                }
            }
            if (downKey === 40) {
                //下
                if (index < menuList.length - 1) {
                    setMenuActive(()=>menuList[index + 1][menuList[index + 1].length - 1])
                } else {
                    setMenuActive(()=>firstItem)
                }
            }
            if (downKey === 13) {
                //回车
                toPage(menuList[index]);
            }
        }
    };

    useEffect(()=>{
        if(open){
            setTimeout(()=>{
                document.addEventListener("keydown", onKeyDown);
                document.getElementById("searchInput")?.focus();
            })
        }
        return ()=>{
            document.removeEventListener("keydown", onKeyDown);
        }
    },[open,menuList,menuActive])

    // 渲染搜索出的菜单
    const MenuHander = useMemo(()=>{
        return (
            <div className='mt-4 max-h-[500px] overflow-y-auto px-1'>
                { menuList.length ? menuList.map((item,index)=>{
                    return <div
                        key={index}
                        onMouseEnter={() => setHighlight(item)}
                        onClick={()=>toPage(item)}
                        className={
                            [
                                'flex items-center justify-between p-4 my-2 bg-white rounded-md shadow-md cursor-pointer dark:bg-[#1f1f1f] dark:text-white dark:border-[#424242]',
                                (hasHight(item) ? 'search-menu-active' : '')
                            ].join(' ')
                        }
                    >
                        <div className="flex items-center duration-300 menu-item">
                            <AntdIcon component={iconNameCase(item[0].icon)} />
                            { item.length > 0 ? <div className='flex items-center ml-2'>
                                { item.map((val,ind)=>{
                                    return <div key={ind}>
                                        <span>{ val.title }</span>
                                        { ind < item.length - 1 ? <span className="mx-2">{'>'}</span> : null }
                                    </div>
                                }) }
                            </div> : null }
                        </div>
                        <EnterOutlined />
                    </div>
                }) : <Empty description={ t('layouts.emptyMenu') }/> }
            </div>
        )
    },[menuList, menuActive])
    
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
                    onChange={setMenuFn}
                    prefix={<SearchOutlined />}
                    placeholder={ t('layouts.menuSearch') }
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