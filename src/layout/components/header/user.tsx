import React from "react"
import SetLan from "./setupLan"
import { Avatar, Dropdown } from 'antd'
import type { MenuProps } from 'antd';
import { store } from '@/redux';
import { useNavigate } from 'react-router-dom'

const UserContainer:React.FC = () => {
    const navigate = useNavigate()
    const LoginOut = async ()=>{
        store.dispatch({
            type:'UPDATE_USER_INFO',
            userInfo:null
        })
        store.dispatch({
            type:'SET_USER_ROUTER',
            routerList:[]
        })
        navigate('/login')
    }
    const dropdownMenu:MenuProps['items'] = [
        {
            key: '1',
            label: (
              <span> 修改信息 </span>
            ),
        },
        {
            key: '2',
            label: (<span onClick={LoginOut}> 退出登录 </span>),
        }
    ]

    return (
        <div className="flex items-center">
            <SetLan/>
            <div className="ml-10 mr-4">
                <Dropdown menu={{items:dropdownMenu}} placement="bottomLeft">
                    <div className="cursor-pointer">
                        <Avatar src='https://cn.vitejs.dev/logo.svg' />
                        <span className="ml-2">彭于晏</span>
                    </div>
                </Dropdown>
            </div>
        </div>
    )
}

export default UserContainer