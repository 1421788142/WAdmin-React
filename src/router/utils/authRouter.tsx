import { useLocation, Navigate } from "react-router-dom";
import { Modal } from "antd";
import { start, close } from '@/plugins/nprogress'
import { store } from "@/redux";
import { userInterface } from '@/apis/user/index'
import { getFlatArr } from '@u/index'


// 是否需要登录
const isLogin = (pathName:string,userInfo:userInterface | null)=>{
    return Boolean( pathName !=='login' && !userInfo)
}
// 已经登录禁止到登录页
const prohibitLogin = (pathName:string,userInfo:userInterface | null)=>{
    return Boolean( pathName === 'login' && userInfo)
}

// 存储递归扁平化后的路由,以防每次递归查询
let routerList:menuListType[] = []

/**
 * @description 路由守卫组件
 * */
const AuthRouter = (props: { children: JSX.Element }) => {
    const { VITE_PROJECT_NAME } = import.meta.env
    const { userInfo, token, userRouterList } = store.getState().userStore
    const { pathname } = useLocation();

    //跳转路由清除弹窗
    Modal.destroyAll()
    start()

    if(!routerList.length){
         //过滤掉非页面菜单
        routerList = [...getFlatArr<menuListType[]>(userRouterList)].filter(x=>x.menuType === "C")
    }

    // 当前路由
    const currentRouter = routerList.filter(x=>x.path === pathname)[0]

    //跳转前清空所有正在请求的接口
    store.dispatch({
        type: 'SET_REQUEST_RECORD',
        record: {
            cancel: null,
            url:null,
            type: 'cancel'
        }
    })

    // Modal.destroyAll()
    // console.log(props)
    // console.log(currentRouter)
    // console.log(pathname)

    // // 自己按需替换token还是用户信息做权限
    // if(isLogin(pathname, userInfo)) return <Navigate to="/login" replace />; //判断是否登录
    // if(prohibitLogin(pathname, userInfo)) return props.children //以登录状态禁止跳到登录
    // if(!currentRouter?.hidden) return <Navigate to="/403" /> //判断是否有权限访问
    // let title = currentRouter.title ? currentRouter.title + '-' : ''
    // window.document.title = title + VITE_PROJECT_NAME 

    // close()
    return props.children;
}

export default AuthRouter