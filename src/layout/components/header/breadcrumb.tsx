import { memo, useMemo } from 'react'
import { Breadcrumb } from 'antd';
import { setBreadCrumbs } from '@/layout/utils'
import { useNavigate, useLocation } from 'react-router-dom'
import { ConfigProvider, theme } from "antd";
import { StoreType, configStoreType } from '@/redux/interface/index'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import { store } from '@/redux'
import { connect } from 'react-redux';

type ThemeType = configStoreType['theme']

const BreadcrumbCon:React.FC<Partial<{
    collapsed:configStoreType['collapsed'],
    headerFlipColor:ThemeType['headerFlipColor'],
    isDark:ThemeType['isDark'],
}>> = (props)=>{
    const { isDark, headerFlipColor, collapsed } = props
    const navigate = useNavigate();
    const { pathname } = useLocation();

    // 头部面包屑
    const callback = (value: menuListType)=>{
        if (value.component !== "Layout" && pathname !== value.path){
            return navigate(value.path || "" );
        }
        let path = (value.children && getPath(value.children)) || "";
        pathname !== value.path && navigate(path);
    }

    const getPath = (value: menuListType[]): string => {
        let path = "";
        for (let i = 0; i < value.length; i++) {
          if (value[i].component !== "Layout") return value[i].path;
          value[i]?.children?.length && getPath(value[i]?.children || []);
        }
        return path;
    };

    const crumbsList = useMemo(()=>{
        return setBreadCrumbs(pathname,true,callback)
    },[pathname])

    return (
        <div>
            <ConfigProvider
                theme={{
                    algorithm: isDark || headerFlipColor ? theme.darkAlgorithm : theme.defaultAlgorithm
                }}
            >
                <div className='flex items-center'>
                    <div className='mx-2 text-xl cursor-pointer' onClick={()=>store.dispatch({
                        type:'SET_COLLAPSED',
                        collapsed:!collapsed
                    })}>
                        { collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined /> }
                    </div>
                    <Breadcrumb
                        items={crumbsList}
                    />
                </div>
            </ConfigProvider>
        </div>
    )
}

const mapStateToProps = (state: StoreType) => ({
    headerFlipColor:state.configStore.theme.headerFlipColor,
    isDark:state.configStore.theme.isDark,
    collapsed:state.configStore.collapsed,
})

export default connect(mapStateToProps)(BreadcrumbCon)