import { Layout } from "antd";
import './index.less'
import Main from './components/main';
import Header from './components/header';
import Sidebar from './components/sidebar';
import SidebarColumns from './components/sidebar/columns';
import Setting from './components/setting';
import { connect } from 'react-redux';
import { StoreType, configStoreType } from '@/redux/interface/index'
import { memo } from "react";
import HistoryTag from "./components/tag";

// 将不需要根据配置更新的组件缓存状态
const MainContainer = memo(() => <Main />)
const SettingContainer = memo(()=><Setting />)

const LayoutContent:React.FC<{
    menuType:configStoreType['theme']['menuType']
    isViewFull:configStoreType['isViewFull']
}> = (props) => {
    const { menuType, isViewFull } = props
    const { Content } = Layout;
    return (
        <section>
            <div className="w-container">
                { menuType === 'vertical' && !isViewFull && <Sidebar></Sidebar> }
                { menuType === 'columns' && !isViewFull &&  <SidebarColumns></SidebarColumns>}
                <div className="w-container-content">
                    { !isViewFull && <Header></Header>}
                    <Content className="w-container-main">
                        {menuType === 'classic' && !isViewFull && <Sidebar></Sidebar> }
                        <div className="w-container-main-content">
                            { !isViewFull && <HistoryTag/> }
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

const mapStateToProps = (state: StoreType) => ({
    menuType:state.configStore.theme.menuType,
    isViewFull:state.configStore.isViewFull
});
export default connect(mapStateToProps)(LayoutContent);