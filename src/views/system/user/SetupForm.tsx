import { addUser, setupUserType, updateUser } from "@/apis/system/user"
import { FormProps, WFormType } from "@/components/Form/type"
import { useAppProps } from "antd/es/app/context"
import { useImperativeHandle, useMemo, useState } from "react"
import SelectRole from './Select'
import { exp_pwd } from "@/utils/rules"
import React from "react"
import WModal from "@/components/Modal"
import { Button } from "antd"
import WForm from "@/components/Form"
import UploadAvatar from './UploadAvatar'

const SetupForm:React.FC<{
    onRef:React.RefObject<any>,
    TableRef:any,
    antdApp:useAppProps,
}> = (props)=>{
    const { onRef, TableRef, antdApp } = props
    
    const [ open, setOpen ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const [ ruleForm, setRuleForm ] = useState<setupUserType>({} as setupUserType)

    const formColumns = useMemo<Array<FormProps<setupUserType>>>(()=>{
        return [
            {
                isRule:true,
                formItemOption:{
                    name:'userName',
                    label:'用户名',
                },
                validator:({ formParam })=> {
                    if(!formParam.userName){
                        return Promise.reject('用户名不能为空')
                    }
                    if(!/^[a-zA-Z0-9]+$/.test(formParam.userName)){
                        return Promise.reject('只能有大小写字母和数字组成')
                    }
                    return Promise.resolve()
                },
                isHide: () => !ruleForm?.id
            },
            {
                isRule:true,
                formItemOption:{
                    name:'nickName',
                    label:'真实姓名',
                }
            },
            {
                isRule:true,
                formItemOption:{
                    name:'role',
                    label:'角色',
                },
                renderForm:<SelectRole {...{ autoLoad:true } as any}/>
            },
            {
                formItemOption:{
                    name:'address',
                    label:'地址',
                }
            },
            {
                formItemType:'InputNumber',
                formItemOption:{
                    name:'age',
                    label:'年龄',
                }
            },
            {
                formItemType:'Select',
                formItemOption:{
                    name:'gender',
                    label:'性别',
                },
                componentOption:{
                    options:[
                        { label:'保密', value:0 },
                        { label:'男', value:1 },
                        { label:'女', value:2 },
                    ]
                }
            },
            {
                isRule:true,
                formItemOption:{
                    name:'email',
                    label:'邮箱',
                },
                validator:({ formParam })=> {
                    if(!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(formParam.email)){
                        return Promise.reject('邮箱格式不正确')
                    }
                    return Promise.resolve()
                }
            },
            {
                isRule:true,
                formItemType:'Password',
                formItemOption:{
                    name:'password',
                    label:'密码',
                },
                validator:({ formParam })=> {
                    if(!exp_pwd.test(formParam.password)){
                        return Promise.reject('密码格式应为8-18位数字、字母、符号的任意两种组合')
                    }
                    return Promise.resolve()
                },
                isHide: () => !ruleForm?.id
            },
            {
                isRule:true,
                formItemType:'Password',
                formItemOption:{
                    name:'passwordConfirm',
                    label:'确认密码',
                },
                componentOption:{
                    type:'password',
                },
                validator:({ formParam })=> {
                    if(formParam.password !== formParam.passwordConfirm){
                        return Promise.reject('两次密码不一致')
                    }
                    return Promise.resolve()
                },
                isHide: () => !ruleForm?.id
            },
            {
                formItemType:'TextArea',
                formItemOption:{
                    name:'remark',
                    label:'备注',
                },
            },
            {
                formItemOption:{
                    name:'avatar',
                    label:'头像',
                },
                isRule:true,
                renderForm:<UploadAvatar {...{} as any} />
            },
        ]
    },[ruleForm])
    
    // 搜索组件实例
    const formRef = React.createRef<WFormType.UseImperative<setupUserType>>();

    // 暴露方法出去给父组件使用
    useImperativeHandle(onRef,()=>{
        return {
            setOpen,
            setRuleForm
        }
    })

    const footer = useMemo(()=>{
        return (<div className="p-2">
            <Button disabled={loading} onClick={()=>setOpen(false)}>取消</Button>
            <Button loading={loading} type="primary" onClick={ async ()=>{
                const title = ruleForm.id ? '修改' : '添加'
                let valid = await formRef.current?.validateFields()
                const query = {
                    ...ruleForm,
                    ...valid
                }
                setLoading(true)
                let { code, message } = ruleForm.id ? await updateUser(query) : await addUser(query)
                if(code === 200){
                    antdApp.message.success(`${title}成功`)
                    setOpen(false)
                    TableRef.current.resetTabel()
                } else {
                    antdApp.message.error(message)
                }
                setLoading(false)
            }}>提交</Button>
        </div>)
    },[formRef,ruleForm,TableRef,loading])

    return( <WModal option={{
        title:'用户管理',
        open: open,
        width:900,
        onCancel:()=>setOpen(()=>false),
        footer:footer
    }}>
        <WForm<setupUserType>
            onRef={formRef}
            options={{
                initialValues:ruleForm,
                labelCol: {
                    span: 6
                },
                name:'userForm'
            }}
            columns={formColumns}
        ></WForm>
    </WModal>)
}

export default SetupForm