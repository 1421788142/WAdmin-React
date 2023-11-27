import { Modal, ModalProps } from 'antd'
import { useModalDragMove } from "@/hooks/useModal";
import { useEffect, useMemo, useState } from 'react';
import './index.less'
import { MinusOutlined, CloseOutlined, ExpandOutlined } from '@ant-design/icons'

const WModal = (props:{
    children?:React.ReactNode,
    option:ModalProps & {
        draggable?:boolean,
        onCancel:()=>void,
        customFooter?:React.ReactNode
    }
})=>{
    const [ hasFull, setHasFull ] = useState(false)
    const options = useMemo(()=>{
        return {
            footer: true,
            destroyOnClose:true,
            ...props.option,
            width:hasFull ? '100%' : props.option?.width,
            wrapClassName:['custom-modal', hasFull ? 'modal-full' : ''].join(' '),
            style:{ top: hasFull ? '0px' : '', left: hasFull ? '0px' : '' },
            closeIcon:false
        }
    },[props.option,hasFull])

    useEffect(()=>{
        useModalDragMove({
            open:options.open as boolean,
            destroyOnClose:options?.destroyOnClose ?? true,
            draggable:options?.draggable ?? true,
        })
    },[options.open,options.destroyOnClose])

    return (
        <Modal
            {...options}
            destroyOnClose
            title={
                <div className='relative'>
                    <div className='text-center'>
                        <span>{ options.title }</span>
                    </div>
                    <div className='btns'>
                        { !options.destroyOnClose && <MinusOutlined />}
                        <ExpandOutlined onClick={()=>{ setHasFull(!hasFull) }}/>
                        <CloseOutlined onClick={()=>{ options?.onCancel?.() }} />
                    </div>
                </div>
            }
        >
            <div className='max-h-[60vh] overflow-x-hidden overflow-y-auto custom-body'>
                { props.children }
            </div>
        </Modal>
    )
}

export default WModal