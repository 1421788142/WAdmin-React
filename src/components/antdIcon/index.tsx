import React, { memo } from 'react';
import Icon, * as Icons from '@ant-design/icons';

export type customIconType = {
    component:keyof typeof Icons,
    rotate?:number,
    spin?:boolean,
    style?:React.CSSProperties
}

const AntdIcon = (props = {} as customIconType)=>{
    if(!props.component) return <></>
    return <Icon {...props} component={Icons[props['component']] as React.ForwardRefExoticComponent<any>} />
}

export default memo(AntdIcon)