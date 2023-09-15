import { Navigate, useRoutes } from "react-router-dom";
import Login from "@/views/auth/login";
import { getRouters } from "./utils/autoLoad";
import { menu } from "@/assets/js/menu";

const rootRouter:any = [
    {
		path: "/",
		element: <Navigate to="/login" />
	},
	getRouters(menu),
    {
		path: "/login",
		element: <Login />,
		meta: {
			requiresAuth: false,
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