import { StoreType, historyTagStoreType } from "@/redux/interface"
import { SyncOutlined } from "@ant-design/icons"
import React, { useMemo } from "react"
import { connect } from "react-redux"
import { store } from "@/redux"

const RefreshView:React.FC<{
    children:React.ReactNode,
    classNames?:string,
    viewStatus?:historyTagStoreType['viewStatus']
}> = (props) => {
    const { classNames, children, viewStatus } = props
    const animate = useMemo(()=>{
        // 如果是loading状态，强制200ms后变为ok
        if(viewStatus === 'loading'){
            setTimeout(()=>{
                store.dispatch({
                    type:'SET_VIEW_STATUS',
                    viewStatus:'ok'
                })
            },200)
        }
        return viewStatus === 'loading' ? 'animate-spin' : ''
    },[viewStatus])

    const refres = ()=>{
        store.dispatch({
            type:'SET_VIEW_STATUS',
            viewStatus:'loading'
        })
    }
    
    return <div className="flex" onClick={refres}>
        <SyncOutlined className={ [classNames, animate].join(' ') } />
        { children }
    </div>
}

const mapStateToProps = (state: StoreType) => ({
    viewStatus:state.historyTagStore.viewStatus
})

export default connect(mapStateToProps)(RefreshView)