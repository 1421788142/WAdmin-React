import { Button, Drawer } from "antd"
import { SettingOutlined } from '@ant-design/icons';
import lazyLoad from "@/utils/lazyLoad"
import React, { useState } from "react";

const Setting = () => {
    const [ open, setOpen ] = useState(false)
    return (<>
        <div id="set-up" className="set-up">
            <Button className="set-up-btn" style={{ borderRadius: '10px 0 0 10px' }} onClick={() => setOpen(true)} type="primary" icon={
                <SettingOutlined className="!text-[22px]"/>
            } />
        </div>
        <Drawer 
            getContainer={() => document.getElementById('set-up') as HTMLDivElement} 
            title="项目配置" 
            width={300} 
            open={open} 
            onClose={() => setOpen(false)} 
            bodyStyle={{padding:'0px 20px'}}
        >
            { lazyLoad(React.lazy(()=>import('./components/index'))) }
        </Drawer>
    </>) 
}

export default Setting