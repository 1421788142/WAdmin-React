import { useLocation, Navigate } from "react-router-dom";

/**
 * @description 路由守卫组件
 * */
const AuthRouter = (props: { children: JSX.Element }) => {
    const { pathname } = useLocation();
    // const route = searchRoute(pathname, rootRouter);
    return props.children;
}

export default AuthRouter