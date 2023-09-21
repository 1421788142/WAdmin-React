import React, { useState } from 'react';
import { loginInterface } from '@/apis/user'
import { Form, Button, Input, Spin, Checkbox } from 'antd'
import ImageVerify from '@com/imageVerify'
import { loginRules } from '../utils/rules'
import { connect } from "react-redux";
import type { userStoreType } from '@/redux/interface/index'
import { setCurrentPage } from "@/redux/modules/user/action";
import { Login } from "../utils";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom'

const LoginForm:React.FC<{
  setCurrentPage:Function
}> = (props) => {
  const [form] = Form.useForm();
  const [ loading, setLoading ] = useState(false)
  const [ imgLoading, setImgLoading ] = useState(false)
  const [code, setCode] = useState("");

  const { t } = useTranslation();
  const initialValues = {
    userName: 'wadmin', 
    password: 'wadmin123',
    isRemember:true
  }
  const navigate = useNavigate();
  const onFinish = async (values: loginInterface) => {
    setLoading(true)
    let res = await Login(values)
    res && navigate('/home')
    setLoading(!res)
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
                className="w-[100%] h-[100%] opacity-0 hover:opacity-100 absolute backdrop-invert backdrop-opacity-30 flex justify-center items-center"
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
      <Button onClick={()=>props.setCurrentPage(2)}>
        <span className="text-sm">{ t("login.phoneLogin") }</span>
      </Button>
      <Button onClick={()=>props.setCurrentPage(3)}>
        <span className="text-sm">{ t("login.qrCodeLogin") }</span>
      </Button>
      <Button onClick={()=>props.setCurrentPage(4)}>
        <span className="text-sm">{ t("login.register") }</span>
      </Button>
    </div>
  </>)
}

const mapStateToProps = (state: {
  userStore: userStoreType
}) => state.userStore;
const mapDispatchToProps = { setCurrentPage };
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);