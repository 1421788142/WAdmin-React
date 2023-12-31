import React from "react";
import lazyLoad from '../../utils/lazyLoad'
import { LayoutContent } from "../layout";
import { RouteObject } from "react-router-dom";
import config from '../../../public/config'
import type { userStoreType } from '@/redux/interface/index'
import _ from 'loadsh'
import { store } from "@/redux";

type AutoRouter = RouteObject & MenuListType[]
type menuType = userStoreType['userRouterList']
const getRouters = () => {
    let menuList = _.cloneDeep(store.getState().userStore.userRouterList) as menuType
    let router:AutoRouter  = [] //注册后的路由

    // 全部视图页面
    const views = import.meta.glob<{ default:any }>('@/views/**/*.tsx')

    // 自动注册页面
    const autoRouterViews = (item: menuType[number]) => {
        Object.entries(views).forEach(([file, module]) => {
            let fileName = file.split('/src/views/')?.pop()?.split('.tsx').shift()
            if (fileName === item.component) {
                item.element = lazyLoad(React.lazy(module))
                router.push(item)
            }
        })
    }

    // 自动注册路由
    const setRoute = (menus: any[]) => {
        menus.forEach(item => {
            if (item.element !== 'Layout' && !item.isFrame && item.status === 1) {
                autoRouterViews(item)
            }
            item.children && item.children.length > 0
                ? setRoute(item.children)
                : ""
        })
    }
    setRoute(menuList)

    //获取启动页
    const setRedirect = () => {
        let redirect = null
        for (let i = 0; i < router.length; i++) {
            if (!router[i]?.hidden && config.homePath === router[i].path) {
                redirect = router[i]
                break;
            }
        }
        return redirect as AutoRouter[number]
    }

    let routers = {
        path: '/',
        name: 'Layout',
        element: <LayoutContent />,
        children: [
            ...router,
            ( setRedirect() ? {
                ...setRedirect(),
                path:'/'
            } : {}),
        ] as unknown as RouteObject[]
    }
    return routers
}

export { getRouters }

