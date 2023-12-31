
import { menuList, roleListType, setupRoleType } from '@/apis/system/role'
import { App } from "antd"
import React from "react"
import { arrayToTree } from "@/utils"
import Table from "./Table"
import SetupForm from './SetupForm'

const UserPage = ()=>{
    const TableRef = React.createRef<{
        TableRef:any
    }>()

    const SetupFormRef = React.createRef<{
        setOpen:React.Dispatch<React.SetStateAction<boolean>>
        setTreeData:React.Dispatch<React.SetStateAction<MenuListType[]>>
        setRuleForm:React.Dispatch<React.SetStateAction<setupRoleType>>
    }>()
    
    const app = App.useApp()

    const initData = {
        orderNum:50,
        status:1,
        menuId:''
    }

    const setup = async (query:Partial<roleListType>)=>{
        let { code, data } = await menuList()
        if(code === 200){
            let treeList = arrayToTree<MenuListType>(data.dataList as unknown as MenuListType[]);
            SetupFormRef.current?.setRuleForm((value)=>{
                let data = initData
                if(query.id){
                    data = { ...data, ...query }
                }
                return data as unknown as setupRoleType
            })
            SetupFormRef.current?.setTreeData(()=>treeList)
            SetupFormRef.current?.setOpen(true)
        } else {
            app.message.warning('获取菜单失败')
        }
    }

    return(<div>
        <Table antdApp={app} onRef={TableRef} setup={setup}></Table>
        <SetupForm antdApp={app} onRef={SetupFormRef} TableRef={TableRef}></SetupForm>
    </div>) 
}

export default UserPage