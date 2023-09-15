import React from "react";
import lazyLoad from './lazyLoad'
import { LayoutContent } from "../layout";

const getRouters = (routerList: any[] = []) => {

    let router: any = [] //注册后的路由

    // 全部视图页面
    const views = import.meta.glob<{ default:any }>('@/views/**/*.tsx')

    // 自动注册页面
    const autoRouterViews = (item: any) => {
        Object.entries(views).forEach(([file, module]) => {
            let fileName = file.split('/src/views/')?.pop()?.split('.tsx').shift()
            if (fileName === item.element) {
                console.log(module)
                // module.default.name = item.path
                /*@vite-ignore*/
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

    setRoute(routerList)

    let routers = {
        path: '/',
        name: 'Layout',
        element:<LayoutContent />,
        children: [
            ...router,
        ]
    }

    return routers
}

export { getRouters }

