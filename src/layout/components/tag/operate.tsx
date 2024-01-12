import { connect } from "react-redux"
import { ExpandOutlined, MenuOutlined } from '@ant-design/icons'
import { useMemo } from "react"
import { store } from "@/redux"
import { StoreType } from "@/redux/interface"
import { useNavigate, useLocation } from 'react-router-dom';
import { useTag } from './util';
import TagMenu from './tagMenu';
import RefreshView from "../refreshView"
import { REDUX_CONFIG_ENUM } from "@/enums/redux"

const OperateMenu:React.FC<{
    tagList: StoreType['historyTagStore']['historyTag'],
}> = (props)=>{
    const iconClass = useMemo(()=>{
        return ['cursor-pointer p-1 bg-[red hover:bg-[#F0F0F0] dark:hover:bg-[#3A3A3A] rounded'].join(' ')
    },[])

    // tab 标签业务
    const { tagList } = props 
    const navigate = useNavigate();
    const { pathname } = useLocation()
    const { 
        onClose,
        closeLeft,
        closeRight,
        closeAll,
        closeOther
    } = useTag({ tagList, navigate, pathname })

    const setViewFull = ()=>{
        store.dispatch({
            type:REDUX_CONFIG_ENUM.SET_VIEW_FULL,
            isViewFull:!store.getState().configStore.isViewFull
        })
    }

    return <div className="flex justify-end text-xl min-w-[100px]">
        <div className={iconClass}>
            <RefreshView>
                <></>
            </RefreshView>
        </div>
        <ExpandOutlined onClick={setViewFull} className={ iconClass } />
        <TagMenu
            trigger={['click']}
            pathname={pathname}
            tagPath={pathname}
            onClose={onClose}
            closeLeft={closeLeft}
            closeRight={closeRight}
            closeAll={closeAll}
            closeOther={closeOther}
        >
            <MenuOutlined className={ iconClass } />
        </TagMenu>
    </div>
}

const mapStateToProps = (state: StoreType) => ({
    tagList:state.historyTagStore.historyTag,
})
  
export default connect(mapStateToProps)(OperateMenu)

