import { useMemo } from "react";
import { Navigate, useLocation, useOutlet } from "react-router-dom";
import { store } from '@/redux';
import { CloseOutlined } from "@ant-design/icons/lib/icons";
import { connect } from "react-redux";
import { userStoreType, configStoreType, historyTagStoreType } from "@/redux/interface";
import { CSSTransition, TransitionGroup} from 'react-transition-group'
import './index.less'
import { Spin } from "antd";

const Main:React.FC<{
    token:userStoreType['token']
    isViewFull:configStoreType['isViewFull'],
    viewStatus:historyTagStoreType['viewStatus']
}> = (props) => {
    const { token, isViewFull, viewStatus } = props
    const outlet = useOutlet()
    const { pathname, key } = useLocation()
    
    const RouterView = useMemo(()=>{
        return token ? (<TransitionGroup className="transition-group">
            <CSSTransition
                key={key}
                timeout={{ enter: 500, exit: 500 }}
                classNames="fade"
            >
                <div className="p-2 wadmin-content-bg wadmin-radius">
                    { 
                        viewStatus === 'ok' ? outlet : 
                        <Spin 
                            size="large"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        /> 
                    }
                </div>
            </CSSTransition>
        </TransitionGroup>) : <Navigate to='/login' />
    },[token,pathname,viewStatus])

    const CloseFull = useMemo(()=>{
        const setViewFull = ()=>{
            store.dispatch({
                type:'SET_VIEW_FULL',
                isViewFull:!isViewFull
            })
        }
        return (
            isViewFull && <div onClick={setViewFull} className="close-full"  >
                <CloseOutlined />
            </div>
        )
    },[isViewFull])

    return (
        <div className="max-h-[100%] overflow-auto m-1 flex-1">
            {/* 全屏按钮 */}
            { CloseFull }
            {/* 视图 */}
            { RouterView }
        </div>
    )
}

const mapStateToProps = (state: any) => ({
    token: state.userStore.token,
    isViewFull: state.configStore.isViewFull,
    viewStatus:state.historyTagStore.viewStatus
})

export default connect(mapStateToProps)(Main)