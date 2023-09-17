import { getAssets } from '@u/index'
import { Carousel } from 'antd'
const { VITE_PROJECT_NAME, VITE_PROJECT_LOGO } = import.meta.env;

const LoginLeft = ()=>{
    return (
        <div className="w-[55%] h-[65%] p-20 items-center hidden xl:flex flex-col justify-center z-10">
            <div className="w-[65%]">
                <div className="mb-6 text-left">
                    <div className="flex items-center w-full">
                        <img className="max-w-[70px] mr-[1%]" src={getAssets(VITE_PROJECT_LOGO)} />
                        <span className="text-3xl font-black">
                        { VITE_PROJECT_NAME }
                        </span>
                    </div>
                    <div className='text-sm'>输入您的个人详细信息开始使用！</div>
                </div>
                <Carousel autoplay>
                    <img src={getAssets('image/login_banner1.png')} alt="login" />
                    <img src={getAssets('image/login_banner2.png')} alt="login" />
                </Carousel>
            </div>
        </div>
    )
}

export default LoginLeft