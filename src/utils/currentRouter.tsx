import { store } from "@/redux"
import { getFlatArr } from "."
import { useLocation } from "react-router-dom"
import { useMemo } from "react"

// 存储递归扁平化后的路由,以防每次递归查询
let routerList:MenuListType[] = []

export const getCurrentRouter = (routers?:MenuListType[])=>{
    const userRouterList = routers || store.getState().userStore.userRouterList
    if(!routerList.length){
        //过滤掉非页面菜单
       routerList = [...getFlatArr<MenuListType[]>(userRouterList)].filter(x=>x.menuType === "C")
   }
    const { pathname } = useLocation();
    // 当前路由
    const currentRouter = useMemo(()=>{
        if(pathname === '/login') routerList = [] // 登录页不做权限控制
        return routerList.filter(x=>x.path === pathname)[0]
    },[routerList,pathname])
    return currentRouter
}