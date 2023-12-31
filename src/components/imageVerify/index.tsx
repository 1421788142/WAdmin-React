import React, { useEffect, useRef, useImperativeHandle } from 'react';
import { useUpdateEffect } from '@/hooks/useUpdateEffect'
import { useImageVerify } from './useImageVerify';


const ImageVerify:React.FC<{
    code:string,
    setCode:React.Dispatch<React.SetStateAction<string>>,
    setImgLoading:React.Dispatch<React.SetStateAction<boolean>>,
    onRef:React.RefObject<{
        updateImgCode:Function
    }>
}> = (props)=>{

    const domRef = useRef<HTMLCanvasElement>(null);
    const { imgCode, getImgCode } = useImageVerify();            
    const handleFn = ()=>{
        props.setCode(imgCode)
    }
    useUpdateEffect(handleFn,[imgCode])
    
    const updateImgCode = async ()=>{
        props.setImgLoading(true)
        await getImgCode(domRef.current as HTMLCanvasElement)
        props.setImgLoading(false)
    }

    useEffect(()=>{
        updateImgCode()
    },[domRef])

    useImperativeHandle(props.onRef,()=>{
        return {
            updateImgCode
        }
    })
    const wrapperClassName = `w-full h-full wadmin-radius overflow-hidden`
    return (
        <div className={wrapperClassName}>
            <canvas
                ref={domRef}
                width="120"
                height="40"
                className='w-full cursor-pointer h-[40px]'
            />
        </div>
    )
}

export default ImageVerify