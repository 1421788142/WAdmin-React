import { userListType, setupUserType } from '@/apis/system/user'
import { App } from "antd"
import React from "react"
import Table from './Table'
import SetupForm from './SetupForm'

const UserPage = ()=>{
    const TableRef = React.createRef<{
        TableRef:any
    }>()

    const SetupFormRef = React.createRef<{
        setOpen:React.Dispatch<React.SetStateAction<boolean>>
        setRuleForm:React.Dispatch<React.SetStateAction<setupUserType>>
    }>()

    const app = App.useApp()

    const initData = {
        age:18,
        status:1,
        gender:0,
        avatar:''
    }

    const setup = async (query:Partial<userListType>)=>{
        SetupFormRef.current?.setRuleForm((value)=>{
            let data = initData
            if(query.id){
                data = { ...data, ...query }
            }
            return data as unknown as setupUserType
        })
        SetupFormRef.current?.setOpen(true)
    }

    return(<div>
        <Table antdApp={app} onRef={TableRef} setup={setup}></Table>
        <SetupForm antdApp={app} onRef={SetupFormRef} TableRef={TableRef}></SetupForm>
    </div>) 
}

export default UserPage