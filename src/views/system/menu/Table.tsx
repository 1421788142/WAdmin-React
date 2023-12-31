import { delMenu, menuList } from "@/apis/system/menu"
import AntdIcon from "@/components/AntdIcon"
import AuthButton from "@/components/AuthButton"
import { ColumnsType } from "@/components/Table/types/type"
import { iconNameCase } from "@/layout/utils"
import { useAppProps } from "antd/es/app/context"
import { Updater } from "use-immer";
import React, { useImperativeHandle } from "react"
import { arrRemoval, arrayToTree } from "@/utils"
import WTable from "@/components/Table"

const Table:React.FC<{
    setup:(params:Partial<MenuListType>)=>void,
    onRef:React.RefObject<any>,
    antdApp:useAppProps
}> = (props)=>{
    const { setup, onRef, antdApp } = props
    const columns:ColumnsType<MenuListType>[] = [
        {
            title:'菜单名称',
            dataIndex:'title',
            search:true,
        },
        { 
            title:'图标',
            dataIndex:'icon',
            render:(value)=>{
                return <AntdIcon component={iconNameCase(value) as any}/>
            }
        },
        { 
            title:'组件',
            width:300,
            dataIndex:'component',
        },
        {
            width: 80,
            title:'状态',
            dataIndex:'status',
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
            tag:true,
            enum:[
                { label:'启用', value:1, color:'green' },
                { label:'停用', value:0, color:'red' },
            ]
        },
        { 
            width:200,
            title:'操作',
            dataIndex:'operation',
            fixed:'right',
            render:(value,record:MenuListType)=>{
                return <div className="flex items-center justify-center">
                    <AuthButton onClick={()=>{
                        setup({pId:record.id})
                    }} />
                    <AuthButton onClick={()=>{
                        setup(record)
                    }} type="update"/>
                    <AuthButton onClick={()=>{
                        antdApp.modal.confirm({
                            title:'删除提示',
                            content: `是否确定删除${record.title}?`,
                            onOk: async()=>{
                                const { code } = await delMenu(record.id)
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
        reset:()=>Promise<void>,
        getFormValue:()=>Promise<MenuListType>
    }>()

    // 拿到数据后操作
    const afterLoad = (
        data:MenuListType[],
        setState:{
            setExpandedRowKeys:Updater<React.Key[]>,
        }
    )=>{
        const expandedKeys = Array.from(
            new Set((data as MenuListType[]).filter(x => x.menuType !== "C").map(x=>x.id)),
        ) as React.Key[]
        setState.setExpandedRowKeys((oldV)=>{
            return arrRemoval([...oldV,...expandedKeys])
        })
        return arrayToTree<MenuListType>((data as MenuListType[]).sort((a, b) => {
            return a.orderNum - b.orderNum;
        }));
    }   
    
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
            api={ menuList }
            pagination={ false }
            afterLoad={afterLoad}
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