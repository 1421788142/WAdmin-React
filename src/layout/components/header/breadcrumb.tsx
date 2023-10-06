import { memo, useMemo } from 'react'
import { Breadcrumb } from 'antd';
import { setBreadCrumbs } from '@/layout/utils'
import { useNavigate, useLocation } from 'react-router-dom'
import { ConfigProvider, theme } from "antd";
import { configStoreType } from '@/redux/interface/index'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'

const BreadcrumbCon = (props:{
    configStore:configStoreType
})=>{
    const { theme:sysTheme } = props.configStore
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
        <div className='pl-2'>
            <ConfigProvider
                theme={{
                    algorithm: sysTheme.isDark || sysTheme.headerFlipColor ? theme.darkAlgorithm : theme.defaultAlgorithm
                }}
            >
                <div className='flex items-center'>
                    <MenuUnfoldOutlined />
                    <MenuFoldOutlined />
                    <Breadcrumb
                        items={crumbsList}
                    />
                </div>
            </ConfigProvider>
        </div>
    )
}

export default memo(BreadcrumbCon)