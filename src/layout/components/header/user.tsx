import React from "react"
import SetLan from "./setupLan"
import Notice from './notice'
import FullScreen from './fullscreen'
import SearchMenu from './searchMenu'
import { App, Avatar, Dropdown } from 'antd'
import type { MenuProps } from 'antd';
import { store } from '@/redux';
import { useNavigate } from 'react-router-dom'
import { StoreType  } from '@/redux/interface/index'
import { useTranslation } from "react-i18next";
import { connect } from "react-redux"

const UserContainer:React.FC<{userInfo:StoreType['userStore']['userInfo']}> = (props) => {
    const navigate = useNavigate()
    const app = App.useApp()
    const { t } = useTranslation();
    const { userInfo } = props

    // 退出登录
    const LoginOut = async ()=>{
        app.modal.confirm({
            title: t("login.userOutTitle"),
            content: t("login.userOutDesc"),
            onOk() {
                store.dispatch({ type:'LOGIN_OUT' })
                setTimeout(()=>{
                    store.dispatch({
                        type:'SET_USER_ROUTER',
                        routerList:[]
                    })
                },200)
            },
            onCancel: () => {
              app.message.warning(t("login.userOutCancel"));
            },
          });

    }
    // 用户下拉菜单
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
            <SearchMenu/>
            <FullScreen/>
            <Notice/>
            <SetLan/>
            <div className="ml-5 mr-4">
                <Dropdown menu={{items:dropdownMenu}} placement="bottomLeft">
                    <div className="cursor-pointer">
                        <Avatar src={userInfo?.avatar} />
                        <span className="ml-2">{ userInfo?.nickName }</span>
                    </div>
                </Dropdown>
            </div>
        </div>
    )
}

const mapStateToProps = (state: StoreType) => ({
    userInfo:state.userStore.userInfo
})

export default connect(mapStateToProps)(UserContainer)