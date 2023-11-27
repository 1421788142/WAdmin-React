import { App, Tooltip } from 'antd'
import { useState } from 'react'
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons'
import { useTranslation } from "react-i18next";
import screenfull from "screenfull";

const FullScreen = ()=>{
    const [ isFull, setIsFull ] = useState(false)
    const { t } = useTranslation();
    const app = App.useApp()
    
    // 全屏
    const toggleFullscreen = ()=>{
        if (!screenfull.isEnabled) return app.message.error(t("layouts.notFullScreen"));
        setIsFull((isFull)=>{
            return !isFull
        })
        screenfull.toggle();
    }
    const style = { fontSize: '20px', cursor: 'pointer' }

    return <>
        <Tooltip title={ !isFull ? t('layouts.fullScreen') : t('layouts.cancelFullScreen') }>
            <div onClick={toggleFullscreen} className='flex items-center ml-3'>
                { isFull ? <FullscreenExitOutlined style={style}/> : <FullscreenOutlined style={style}/> }
            </div>
        </Tooltip>
    </>
}

export default FullScreen