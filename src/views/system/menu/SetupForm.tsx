import { addMenu, updateMenu } from "@/apis/system/menu"
import { FormProps, WFormType } from "@/components/Form/type"
import { Button } from "antd"
import { useAppProps } from "antd/es/app/context"
import React, { useImperativeHandle } from "react"
import { useMemo, useState } from "react"
import WForm from '@/components/Form'
import WModal from '@/components/Modal'
import WIconPicker from '@/components/AntdIconPick'

const SetupForm:React.FC<{
    onRef:React.RefObject<any>,
    TableRef:any,
    antdApp:useAppProps
}> = (props)=>{
    const { onRef, TableRef, antdApp } = props
    
    const [treeData, setTreeData] = useState<MenuListType[]>([])
    const [ loading, setLoading ] = useState(false)
    const [ open, setOpen ] = useState(false)
    const [ ruleForm, setRuleForm ] = useState<MenuListType>({} as MenuListType)

    const formColumns = useMemo<Array<FormProps<MenuListType>>>(()=>{
        return [
            {
                formItemType:'Radio',
                formItemOption:{
                    name:'menuType',
                    label:'菜单类型',
                },
                componentOption:{
                    options:[
                        { label:'目录', value:'M' },
                        { label:'菜单', value:'C' },
                        { label:'按钮', value:'F' },
                    ],
                    onChange:(e:Event)=>{
                        let menuType = (e.target as HTMLInputElement).value as MenuListType['menuType']
                        setRuleForm((value)=>({
                            ...value,
                            menuType
                        }))
                    },
                    optionType:'button',
                    buttonStyle:'solid'
                }
            },
            {
                isRule:true,
                formItemType:'TreeSelect',
                formItemOption:{
                    name:'pId',
                    label:'上级菜单',
                },
                componentOption:{
                    treeData: treeData,
                    fieldNames: {
                        children: "children",
                        label: "title",
                        value: "id",
                    },
                    allowClear:false,
                    treeDefaultExpandAll:true,
                    treeNodeFilterProp: "title",
                }
            },
            {
                isRule:true,
                formItemType:'Input',
                formItemOption:{
                    name:'title',
                    label:'菜单名称',
                }
            },
            {
                formItemOption: {
                  name: "icon",
                  label: "图标",
                },
                renderForm:<WIconPicker />,
                isHide: () => ruleForm?.menuType !== "F",
            },
            {
                isRule: true,
                formItemOption: {
                  name: "orderNum",
                  label: "显示排序",
                },
                formItemType: "InputNumber",
                componentOption: { min: 0, step: 1 },
            },
            {
                isRule: true,
                formItemOption: {
                  name: "component",
                  label: "组件路径",
                  tooltip:'访问的组件路径，如：`system/user/index`，默认在`views`目录下'
                },
                isHide: () => ruleForm?.menuType === "C",
            },
            {
                isRule: true,
                formItemOption: {
                  name: "path",
                  label: "路由地址",
                  tooltip:'访问的路由地址,如:`/user`，如外网地址需内链访问则以`http(s)://`开头,如果为目录,请以当前文件夹地址做拼接(system),注意请不要和其他目录文件夹重复,保持唯一性'
                },
                isHide: () => ruleForm?.menuType !== "F",
            },
            {
                formItemType:'Radio',
                formItemOption:{
                    name:'isFrame',
                    label:'是否外链',
                    tooltip:'选择是外链则路由地址需要以`http(s)://`开头'
                },
                isHide: () => ruleForm?.menuType !== "F",
                componentOption:{
                    options:[
                        { label:'否', value:0 },
                        { label:'是', value:1 },
                    ],
                    optionType:'button',
                    buttonStyle:'solid'
                }
            },
            {
                formItemType:'Radio',
                formItemOption:{
                    name:'hidden',
                    label:'是否隐藏',
                    tooltip:'选择是则路由将不会出现在菜单栏,但依然会加载菜单'
                },
                isHide: () => ruleForm?.menuType !== "F",
                componentOption:{
                    options:[
                        { label:'否', value:0 },
                        { label:'是', value:1 },
                    ],
                    optionType:'button',
                    buttonStyle:'solid'
                }
            },
            {
                formItemType:'Radio',
                formItemOption:{
                    name:'keepAlive',
                    label:'是否缓存',
                },
                isHide: () => ruleForm?.menuType === "C",
                componentOption:{
                    options:[
                        { label:'否', value:0 },
                        { label:'是', value:1 },
                    ],
                    optionType:'button',
                    buttonStyle:'solid'
                }
            },
            {
                formItemType:'Radio',
                formItemOption:{
                    name:'status',
                    label:'菜单状态',
                    tooltip:"选择停用则路由将不会出现在菜单栏不会加载菜单"
                },
                componentOption:{
                    options:[
                        { label:'停用', value:0 },
                        { label:'正常', value:1 },
                    ],
                    optionType:'button',
                    buttonStyle:'solid'
                }
            },
            {
                isRule: true,
                formItemOption: {
                  name: "perms",
                  label: "权限字符串",
                },
                isHide: () => ruleForm?.menuType === "F",
                formItemType:'Select',
                componentOption:{
                    options:[
                        { label:'新增', value:'add' },
                        { label:'编辑', value:'update' },
                        { label:'删除', value:'delete' },
                    ],
                }
            },
        ]
    },[ruleForm,treeData])
    
    // 搜索组件实例
    const formRef = React.createRef<WFormType.UseImperative<MenuListType>>();

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
            <Button onClick={()=>setOpen(()=>false)}>取消</Button>
            <Button type="primary" onClick={ async ()=>{
                const title = ruleForm.id ? '修改' : '添加'
                let valid = await formRef.current?.validateFields()
                const query = {
                    ...ruleForm,
                    ...valid
                }
                setLoading(true)
                let { code } = ruleForm.id ? await updateMenu(query) : await addMenu(query)
                if(code === 200){
                    antdApp.message.success(`${title}成功`)
                    setOpen(()=>false)
                    TableRef.current.resetTabel()
                }
                setLoading(false)
            }}>提交</Button>
        </div>)
    },[ ruleForm, formRef, TableRef, loading ])

    return( <WModal option={{
        title:'菜单管理',
        open: open,
        width:900,
        onCancel:()=>setOpen(()=>false),
        footer:footer
    }}>
        <WForm<MenuListType>
            onRef={formRef}
            options={{
                initialValues:ruleForm,
                labelCol: {
                    span: 6
                }
            }}
            columns={formColumns}
        ></WForm>
    </WModal>)
}

export default SetupForm