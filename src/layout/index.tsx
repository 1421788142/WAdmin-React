import { Layout } from "antd";
import './index.less'
import Main from './components/main';
import Header from './components/header';
import Sidebar from './components/sidebar';
import SidebarColumns from './components/sidebar/columns';
import Setting from './components/setting';
import { useSelector } from 'react-redux';
import { StoreType } from '@/redux/interface/index'
import { memo } from "react";

// 将不需要根据配置更新的组件缓存状态
const MainContainer = memo(() => <Main />)
const SettingContainer = memo(()=><Setting />)

const LayoutContent = () => {
    const { Content } = Layout;
    // 监听redux
    const state = {
        configStore: useSelector((state:StoreType)=>state.configStore),
        userStore:useSelector((state:StoreType)=>state.userStore)
    }

    return (
        <section>
            <div className="w-container">
                { state.configStore.theme.menuType === 'vertical' && <Sidebar {...state}></Sidebar> }
                { state.configStore.theme.menuType === 'columns' &&  <SidebarColumns {...state}></SidebarColumns>}
                <div className="w-container-content">
                    <Header {...state}></Header>
                    <Content className="w-container-main">
                        {state.configStore.theme.menuType === 'classic' && <Sidebar {...state}></Sidebar>}
                        <div className="w-container-main-content">
                            <MainContainer />
                        </div>
                    </Content>
                </div>
                {/* 设置 */}
                <SettingContainer />
            </div>
        </section>
    )
}

export default LayoutContent