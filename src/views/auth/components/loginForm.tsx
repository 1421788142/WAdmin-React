import React, { useState } from 'react';
import { loginInterface } from '@/apis/user'
import { Form, Button, Input, Spin, Checkbox, App } from 'antd'
import ImageVerify from '@/components/ImageVerify'
import { loginRules } from '../utils/rules'
import type { userStoreType } from '@/redux/interface/index'
import { Login } from "../utils";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom'
import { timeState } from '@/utils/index'
import { store } from '@/redux';
import { REDUX_USER_ENUM } from '@/enums/redux';

const LoginForm:React.FC = () => {
  const [form] = Form.useForm();
  const [ loading, setLoading ] = useState(false)
  const [ imgLoading, setImgLoading ] = useState(false)
  const [code, setCode] = useState("");
  const app = App.useApp()
  const { t } = useTranslation();
  const initialValues = {
    userName: 'wadmin', 
    password: 'wadmin123',
    isRemember:true
  }
  const navigate = useNavigate();
  const onFinish = async (values: loginInterface) => {
    setLoading(true)
    app.message.loading(t('login.loading'))
    let { status } = await Login(values)
    setLoading(false)
    app.message.destroy()
    if(status === 200){
      app.notification.open({
          message: t('login.loginOk'),
          description: `${timeState()},${store.getState().userStore.userInfo?.userName}`,
      });
      navigate('/', { replace: true })
    }
  }

  const resetImgCode = ()=>{
    imageVerifyRef.current?.updateImgCode()
    form.resetFields(['code'])
  }

  const imageVerifyRef = React.createRef<{
    updateImgCode:Function
  }>()

  const setCurrentPage = (currentPage:userStoreType['currentPage'])=>{
    store.dispatch({
      type:REDUX_USER_ENUM.SET_CURRENT_PAGE,
      currentPage
    })
  }

  return (<>
    <Form
      name="ruleFormRef"
      form={form}
      initialValues={initialValues}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item<loginInterface> name="userName">
        <Input size='large' />
      </Form.Item>
      <Form.Item<loginInterface> name="password" rules={loginRules.password}>
        <Input.Password size='large' />
      </Form.Item>
      <Form.Item<loginInterface> name="code" rules={loginRules.code}>
        <div className="grid grid-flow-row-dense grid-cols-3 gap-2">
          <Input className='col-span-2' />
          <Spin spinning={imgLoading}>
            <div className="relative cursor-pointer">
              <div
                onClick={resetImgCode}
                className="w-[100%] h-[100%] opacity-0 hover:opacity-100 absolute backdrop-invert backdrop-opacity-30 wadmin-radius flex justify-center items-center"
              >
                <span className="text-white text-md">
                  { t("login.refresh") }
                </span>
              </div>
              <div className='!w-full !h-[40px]'>
                <ImageVerify onRef={imageVerifyRef} code={code} setImgLoading={setImgLoading} setCode={setCode}/>
              </div>
            </div>
          </Spin>
        </div>
      </Form.Item>
      <Form.Item name='isRemember' valuePropName="checked">
        <div className='flex items-center justify-between'>
          <Checkbox>{ t("login.remember") }</Checkbox>
          <Button type="link">
            <span className='text-sm'>{ t("login.forget") }</span>
          </Button>
        </div>
      </Form.Item>  
      <Form.Item>
        <Button loading={loading} type="primary" className='!h-[45px] w-full' htmlType="submit">
          <span className='text-md'>{ t('login.sign') }</span>
        </Button>
      </Form.Item>
    </Form>

    <div className="grid grid-cols-1 gap-2 xl:grid-cols-3">
      <Button onClick={()=>setCurrentPage(2)}>
        <span className="text-[12px]">{ t("login.phoneLogin") }</span>
      </Button>
      <Button onClick={()=>setCurrentPage(3)}>
        <span className="text-[12px]">{ t("login.qrCodeLogin") }</span>
      </Button>
      <Button onClick={()=>setCurrentPage(4)}>
        <span className="text-[12px]">{ t("login.register") }</span>
      </Button>
    </div>
  </>)
}

export default LoginForm