import { Popover, Badge, Tabs, TabsProps } from 'antd'
import { BellOutlined } from '@ant-design/icons'
import { useMemo } from 'react'

const Notice = () => {
    const content = useMemo(()=>{
        const items: TabsProps['items'] = [
            {
              key: 'notice',
              label: '通知',
              children: 'Content of Tab Pane 1',
            },
            {
              key: 'msg',
              label: '消息',
              children: 'Content of Tab Pane 2',
            },
          ];
        return <>
            <Tabs centered items={items}></Tabs>
        </>
    },[])

    return <>
        <Popover
            className="flex items-center ml-3 cursor-pointer ant-dropdown-link"
            content={ content }
            trigger={['click']} placement="bottom"
        >
            <Badge count={10}>
                <BellOutlined style={{ fontSize: '20px' }}/>
            </Badge>
        </Popover>
    </>
}

export default Notice