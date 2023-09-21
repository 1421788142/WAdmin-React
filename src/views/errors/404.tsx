import { Button, Image } from 'antd'
import { getAssets } from "@/utils/index";
import { useNavigate } from 'react-router-dom'
const ErrorPage403 = ()=>{

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1)
  }

  return <>
    <div className="flex items-center justify-center w-screen h-screen">
      <div>
        <Image preview={false} src={getAssets('image/403.png')}></Image>
      </div>
      <div className="ml-[5vw]">
        <h2 className="text-6xl font-bold text-w text-stone-600">404</h2>
        <p className="text-xl">抱歉，您访问的页面不存在~🤷‍♂️🤷‍♀️</p>
        <Button type="primary" onClick={goBack}>返回上一页</Button>
      </div>
    </div>
  </>
}

export default ErrorPage403

