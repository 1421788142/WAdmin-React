import { useLocation, Navigate } from "react-router-dom";
import { Modal } from "antd";
import { start, close } from '@/plugins/nprogress'
import { store } from "@/redux";
import config from "../../../public/config";
import { getCurrentRouter } from "@/utils/currentRouter"
import { REDUX_USER_ENUM } from "@/enums/redux";

// 是否需要登录
const isLogin = (pathName:string,token:string | null)=>{
    return Boolean( pathName !=='/login' && !token)
}
// 已经登录禁止到登录页
const prohibitLogin = (pathName:string,token:string | null)=>{
    return Boolean( pathName === '/login' && token)
}

/**
 * @description 路由守卫组件
 * */
const AuthRouter = (props: { children: JSX.Element }) => {
    const { VITE_PROJECT_NAME } = import.meta.env
    const { userInfo, token, userRouterList } = store.getState().userStore
    const { pathname } = useLocation();
    if(pathname === '/' && userInfo && userRouterList.length) return <Navigate to={config?.homePath || '/'} replace />; 

    //跳转路由清除弹窗
    setTimeout(()=>{
        Modal.destroyAll()
    },100)
    start()

    const currentRouter = getCurrentRouter(userRouterList)

    // 判断是否登录 自己按需替换token还是用户信息做权限
    if(isLogin(pathname, token)) return <Navigate to="/login" replace />; 
    //以登录状态禁止跳到登录
    if(prohibitLogin(pathname, token)) return <Navigate to='/' replace /> 
     //判断是否有权限访问
    if(currentRouter?.hidden) return <Navigate to="/403" />
    let title = currentRouter?.title ?? VITE_PROJECT_NAME
    window.document.title = `${title} - ${VITE_PROJECT_NAME}`
    close()

    //跳转前清空所有正在请求的接口
    store.dispatch({
        type: REDUX_USER_ENUM.SET_REQUEST_RECORD,
        record: {
            cancel: null,
            url:null,
            type: 'cancel'
        }
    })

    return props.children;
}

export default AuthRouter