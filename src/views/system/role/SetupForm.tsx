import WModal from "@/components/Modal"
import WForm from "@/components/Form"
import { useAppProps } from "antd/lib/app/context"
import { useImperativeHandle, useMemo, useState } from "react"
import { addRole, setupRoleType, updateRole } from "@/apis/system/role"
import { FormProps, WFormType } from "@/components/Form/type"
import AuthMenu from "./AuthMenu"
import React from "react"
import { Button } from "antd"

const SetupForm:React.FC<{
    onRef:React.RefObject<any>,
    TableRef:any,
    antdApp:useAppProps
}> = (props)=>{
    const { onRef, TableRef, antdApp } = props
    
    const [ open, setOpen ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const [ ruleForm, setRuleForm ] = useState<setupRoleType>({} as setupRoleType)
    const [ treeData, setTreeData ] = useState<MenuListType[]>([])

    const formColumns = useMemo<Array<FormProps<setupRoleType>>>(()=>{
        return [
            {
                isRule:true,
                formItemOption:{
                    name:'roleName',
                    label:'角色名称',
                },
            },
            {
                isRule:true,
                formItemType:'InputNumber',
                formItemOption:{
                    name:'orderNum',
                    label:'排序',
                }
            },
            {
                formItemType:'TextArea',
                formItemOption:{
                    name:'remark',
                    label:'备注',
                }
            },
            {
                formItemOption:{
                    name:'menuId',
                    label:'菜单权限',
                },
                renderForm:<AuthMenu treeData={treeData} {...{} as any}/>
            }
        ]
    },[ruleForm])
    
    // 搜索组件实例
    const formRef = React.createRef<WFormType.UseImperative<setupRoleType>>();

    // 暴露方法出去给父组件使用
    useImperativeHandle(onRef,()=>{
        return {
            setOpen,
            setTreeData,
            setRuleForm
        }
    })

    const footer = useMemo(()=>{
        return (<div className="p-2">
            <Button disabled={loading} onClick={()=>setOpen(()=>false)}>取消</Button>
            <Button loading={loading} type="primary" onClick={ async ()=>{
                const title = ruleForm.id ? '修改' : '添加'
                let valid = await formRef.current?.validateFields()
                const query = {
                    ...ruleForm,
                    ...valid
                }
                setLoading(true)
                let { code } = ruleForm.id ? await updateRole(query) : await addRole(query)
                if(code === 200){
                    antdApp.message.success(`${title}成功`)
                    setOpen(()=>false)
                    TableRef.current.resetTabel()
                }
                setLoading(false)
            }}>提交</Button>
        </div>)
    },[formRef,ruleForm,TableRef,loading])

    return( <WModal option={{
        title:'用户管理',
        open: open,
        width:800,
        onCancel:()=>setOpen(()=>false),
        footer:footer
    }}>
        <WForm<setupRoleType>
            onRef={formRef}
            options={{
                initialValues:ruleForm,
                labelCol: {
                    span: 3
                },
                name:'userForm'
            }}
            span={24}
            columns={formColumns}
        ></WForm>
    </WModal>)
}

export default SetupForm