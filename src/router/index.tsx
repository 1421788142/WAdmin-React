import { useRoutes, RouteObject } from "react-router-dom";
import Login from "@/views/auth/login";
import Error403 from "@/views/errors/403";
import Error404 from "@/views/errors/404";
import { getRouters } from "./utils/autoLoad";

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

let userRouter = {} as {
    path: string;
    name: string;
    element: JSX.Element;
    children: RouteObject[];
}
let hasLoad = false

const Router = () => {
	// 保存自动注册的路由
	if(!hasLoad) userRouter = getRouters()
	const routes = useRoutes([...rootRouter, userRouter]);
	hasLoad = true
	return routes;
};

export default Router