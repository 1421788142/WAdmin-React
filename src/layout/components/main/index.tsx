import { useMemo } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { store } from '@/redux';
const Main = () => {
    const { userInfo } = store.getState().userStore
    const RouterView = useMemo(()=>{
        return userInfo ? <Outlet /> : <Navigate to='/login' />
    },[userInfo])
    return (
        <div className="p-2 bg-white border-radius">
            { RouterView }
        </div>
    )
}

export default Main