import { delUser, setupUserType, updateUser, userList, userListType } from "@/apis/system/user"
import AuthButton from "@/components/AuthButton"
import WTable from "@/components/Table"
import { ColumnsType } from "@/components/Table/types/type"
import { Switch } from "antd"
import { useAppProps } from "antd/es/app/context"
import React, { useImperativeHandle } from "react"
import SelectRole from './Select'

const Table:React.FC<{
    setup:(params:Partial<userListType>)=>void,
    onRef:React.RefObject<any>,
    antdApp:useAppProps,
}> = (props)=>{
    const { setup, onRef, antdApp } = props
    const columns:ColumnsType<userListType>[] = [
        {
            title:'用户名',
            dataIndex:'userName',
            search:true
        },
        {
            title:'真实姓名',
            dataIndex:'nickName',
            search:true
        },
        {
            title:'角色',
            dataIndex:'roleName',
            searchOption:{
                formItemOption:{
                  name:'role',
                },
                sort:2,
                renderForm:<SelectRole {...{ autoLoad:false } as any}/>
            }
        },
        {
            title:'性别',
            dataIndex:'gender',
            showEnum:true,
            enum:[
                { label:'保密', value:0 },
                { label:'男', value:1 },
                { label:'女', value:2 },
            ]
        },
        {
            width: 80,
            title:'状态',
            dataIndex:'status',
            render:(value:number,record:userListType)=>{
              return <>
                <Switch
                    checkedChildren="启用"
                    unCheckedChildren="停用"
                    checked={ value === 1 }
                    onChange={(checked)=>{
                        const title = checked ? '启用' : '停用'
                        antdApp.modal.confirm({
                            title:'确认操作',
                            content:`是否${title}用户${record.userName}?`,
                            onOk:async ()=>{
                                let params = {
                                    ...record,
                                    status:checked ? 1 : 0
                                }
                                let { code } = await updateUser(params as unknown as setupUserType)
                                if(code === 200){
                                    antdApp.message.success(`${title}成功`)
                                    TableRef.current?.reset()
                                }
                            }
                        })
                    }}
                 />
              </>  
            },
            searchOption:{
                formItemType:'Select',
                componentOption:{
                    options:[
                        { label:'所有', value:-1 },
                        { label:'启用', value:1 },
                        { label:'停用', value:0 },
                    ]
                },
                defaultValue:-1,
            },
        },
        {
            title:'创建人',
            dataIndex:'cUserName',
        },
        {
            title:'创建时间',
            dataIndex:'createTime',
        },
        { 
            width:200,
            title:'操作',
            dataIndex:'operation',
            fixed:'right',
            render:(value,record:userListType)=>{
                return <div className="flex items-center justify-center">
                    <AuthButton onClick={()=>{
                        setup(record)
                    }} type="update"/>
                    <AuthButton onClick={()=>{
                        antdApp.modal.confirm({
                            title:'删除提示',
                            content: `是否确定删除${record.nickName}?`,
                            onOk: async()=>{
                                const { code } = await delUser(record.id)
                                if(code === 200){
                                    antdApp.message.success('删除成功')
                                    TableRef.current?.reset()
                                }
                            }
                        })
                    }} color="red" type="delete"/>
                </div>
            }
        }
    ]

    const TableRef = React.createRef<{
        reset:()=> Promise<void>,
        getFormValue:()=> userListType
    }>()
    
    // 暴露方法出去给父组件使用
    useImperativeHandle(onRef,()=>{
        return {
            resetTabel:TableRef.current?.reset
        }
    })

    return (<>
        <WTable
            api={ userList }
            columns={columns}
            onRef={TableRef}
            summaryFixed={'top'}
            TableHeaderRender={()=>{
                return <>
                   <AuthButton btnType="primary" onClick={()=>{
                        setup({})
                    }}/>
                </>
            }}
        ></WTable>
    </>)
}

export default Table