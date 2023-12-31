import { delRole, roleList, roleListType, setupRoleType, updateRole } from "@/apis/system/role"
import AuthButton from "@/components/AuthButton"
import WTable from "@/components/Table"
import { ColumnsType } from "@/components/Table/types/type"
import { Switch } from "antd"
import { useAppProps } from "antd/es/app/context"
import React, { useImperativeHandle } from "react"

const Table:React.FC<{
    setup:(params:Partial<roleListType>)=>void,
    onRef:React.RefObject<any>,
    antdApp:useAppProps
}> = (props)=>{
    const { setup, onRef, antdApp } = props
    const columns:ColumnsType<roleListType>[] = [
        {
            title:'角色名称',
            dataIndex:'roleName',
            search:true,
        },
        {
            title:'排序',
            dataIndex:'orderNum',
        },
        {
            width: 80,
            title:'状态',
            dataIndex:'status',
            render:(value:number,record:roleListType)=>{
                return <>
                  <Switch
                      checkedChildren="启用"
                      unCheckedChildren="停用"
                      checked={ value === 1 }
                      onChange={(checked)=>{
                          const title = checked ? '启用' : '停用'
                          antdApp.modal.confirm({
                              title:'确认操作',
                              content:`是否${title}${record.roleName}?`,
                              onOk:async ()=>{
                                  let params = {
                                      ...record,
                                      status:checked ? 1 : 0
                                  }
                                  let { code } = await updateRole(params as setupRoleType)
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
            render:(value,record:roleListType)=>{
                return <div className="flex items-center justify-center">
                    <AuthButton onClick={()=>{
                        setup(record)
                    }} type="update"/>
                    <AuthButton onClick={()=>{
                        antdApp.modal.confirm({
                            title:'删除提示',
                            content: `是否确定删除${record.roleName}?`,
                            onOk: async()=>{
                                const { code } = await delRole(record.id)
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
        getFormValue:()=> roleListType
    }>()

    // 暴露方法出去给父组件使用
    useImperativeHandle(onRef,()=>{
        return {
            resetTabel:TableRef.current?.reset
        }
    })

    return (<>
        <WTable
            columns={columns}
            onRef={TableRef}
            api={ roleList }
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