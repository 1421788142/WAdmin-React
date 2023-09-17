import React, { useState } from 'react';
import { loginInterface } from '@/apis/user'
import { Form, Button, Input, Spin } from 'antd'
import ImageVerify from '@com/imageVerify'
import { loginRules } from '../utils/rules'

const LoginForm:React.FC = () => {
  const [form] = Form.useForm();
  const [ loading, setLoading ] = useState(false)
  const [ imgLoading, setImgLoading ] = useState(false)
  const [code, setCode] = useState("");

  const onFinish = (values: loginInterface) => {
    setLoading(true)
    console.log('Success:', values);
    setTimeout(()=>{
      setLoading(false)
    },2000)
  }

  const resetImgCode = ()=>{
    imageVerifyRef.current?.updateImgCode()
    form.resetFields(['code'])
  }

  const imageVerifyRef = React.createRef<{
    updateImgCode:Function
  }>()

  return (<>
    <Form
      name="ruleFormRef"
      form={form}
      initialValues={{ userName: 'wadmin', password: 'wadmin123' }}
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
                className="w-[100%] h-[100%] opacity-0 hover:opacity-100 absolute backdrop-invert backdrop-opacity-30 flex justify-center items-center"
              >
                <span className="text-white text-md">
                  刷新
                </span>
              </div>
              <div className='!w-full !h-[40px]'>
                <ImageVerify onRef={imageVerifyRef} code={code} setImgLoading={setImgLoading} setCode={setCode}/>
              </div>
            </div>
          </Spin>
        </div>
      </Form.Item>
      <Form.Item>
        <Button loading={loading} type="primary" className='!h-[45px] w-full' htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  </>)
}

export default LoginForm