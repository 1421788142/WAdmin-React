import { Button, Image } from 'antd'
import { getAssets } from "@/utils/index";
import { useNavigate } from 'react-router-dom'

const App = ()=>{
  const navigate = useNavigate();
  const goBack = () => {
    navigate('/', { replace: true })
  }

  return <>
    <div className="flex items-center justify-center w-screen h-screen">
      <div>
        <Image preview={false} src={getAssets('image/403.png')}></Image>
      </div>
      <div className="ml-[5vw]">
        <h2 className="text-6xl font-bold text-w text-stone-600">403</h2>
        <p className="my-4 text-lg">抱歉，您无权访问该页面~🙅‍♂️🙅‍♀️</p>
        <Button type="primary" onClick={goBack}>
          <span className='text-sm'>返回首页</span>
        </Button>
      </div>
    </div>
  </>
}

export default App

