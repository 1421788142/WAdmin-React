import { Menu } from 'antd';
import type { MenuProps } from 'antd';
const Menus = (
    config:MenuProps
)=>{
    return <>
        <Menu
            style={{ width: '100%', height: '100%' }}
            {...config}
        />
    </>
}

export default Menus