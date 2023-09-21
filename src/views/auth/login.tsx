import { getAssets } from '@u/index'
import LoginLeft from './components/loginLeft'
import LoginRight from './components/loginRight'
import Theme from './components/theme'

const Login = ()=>{
    return (
        <div className="relative w-screen h-screen dark:bg-[#050505]">
            {/* 主题切换 */}
            <div className="fixed z-50 flex items-center md:top-10 top-5 md:right-10 right-5">
                <Theme/>
            </div>
            {/* 背景 */}
            <div className="absolute top-0 left-0 z-0 hidden w-full h-full xl:flex">
                <img src={getAssets('image/login_bg.png')} className="w-full" alt="login" />
            </div>
            {/* 主体内容 */}
            <div className="flex items-center justify-center w-screen h-screen">
                <LoginLeft />
                <LoginRight />
            </div>
        </div>
    )
}

export default Login