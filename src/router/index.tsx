import { useRoutes, RouteObject } from "react-router-dom";
import Login from "@/views/auth/login";
import Error403 from "@/views/errors/403";
import Error404 from "@/views/errors/404";
import { getRouters } from "./utils/autoLoad";
import { memo, useMemo } from "react";
import { StoreType } from '@/redux/interface/index'
import { useSelector } from 'react-redux'

const rootRouter:RouteObject[] = [
	{
		path: "/login",
		element: <Login />,
		handle: {
			title: "登录页",
			key: "login"
		}
	},
	{
		path: "/403",
		element: <Error403 />,
		handle: {
			title: "暂无权限",
			key: "403"
		}
	},
	{
		path: "*",
		element: <Error404 />,
		handle: {
			title: "暂无页面",
			key: "404"
		}
	},
]

const Router = memo(() => {
	const userRouterList = useSelector((state:StoreType)=>state.userStore.userRouterList)
	const routers = useMemo(()=>getRouters(),[userRouterList])
	return useRoutes([...rootRouter, routers])
})

export default Router