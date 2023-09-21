import { Navigate, useRoutes, RouteObject } from "react-router-dom";
import Login from "@/views/auth/login";
import Error403 from "@/views/errors/403";
import Error404 from "@/views/errors/404";
import { getRouters } from "./utils/autoLoad";
import { menu } from "@/assets/js/menu";

const rootRouter:RouteObject[] = [
    {
		path: "/",
		element: <Navigate to="/login" />
	},
	getRouters(menu),
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
			title: "登录页",
			key: "login"
		}
	},
	{
		path: "/404",
		element: <Error404 />,
		handle: {
			title: "登录页",
			key: "login"
		}
	},
]

const Router = () => {
	const routes = useRoutes(rootRouter);
	return routes;
};

export default Router;