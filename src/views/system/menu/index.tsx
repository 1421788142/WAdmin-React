import { menuList } from '@/apis/system/menu'
import { App } from "antd"
import { arrayToTree } from "@/utils"
import React from "react"
import Table from './Table';
import SetupForm from './SetupForm';


const MenuPage = ()=>{
    const TableRef = React.createRef<{
        TableRef:any
    }>()

    const SetupFormRef = React.createRef<{
        setOpen:React.Dispatch<React.SetStateAction<boolean>>
        setTreeData:React.Dispatch<React.SetStateAction<MenuListType[]>>
        setRuleForm:React.Dispatch<React.SetStateAction<MenuListType>>
    }>()
    
    const app = App.useApp()

    const initData = {
        menuType:'M',
        orderNum:50,
        isFrame:0,
        hidden:0,
        keepAlive:1,
        status:1,
    }

    const setup = async (query:Partial<MenuListType>)=>{
        let { code, data } = await menuList({status:-1})
        if(code === 200){
            let treeList = arrayToTree<MenuListType>(data as unknown as MenuListType[]);
            SetupFormRef.current?.setRuleForm((value)=>{
                let data = {}
                if(query.pId){ //列表上选新增
                    data = { ...initData,...query }
                } else if(query.id){ //编辑
                    data = query
                } else { //表头上新增
                    data = { ...initData, pId:0 }
                }
                return data as MenuListType
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

export default MenuPage