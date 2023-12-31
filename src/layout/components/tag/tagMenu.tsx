import React from 'react'
import { Dropdown, DropdownProps, MenuProps } from 'antd'
import { useTranslation } from 'react-i18next';
import {
    ReloadOutlined,
    CloseOutlined,
    VerticalRightOutlined,
    VerticalLeftOutlined,
    PicCenterOutlined,
    DashOutlined
} from '@ant-design/icons'
import { MenuInfo } from 'rc-menu/lib/interface';
import RefreshView from '../refreshView';
 
const TagMenu: React.FC<{
    children?: React.ReactNode,
    tagPath?: string,
    pathname: string,
    onClose: (key: string) => void
    closeLeft: (key: string) => void
    closeRight: (key: string) => void
    closeAll: () => void
    closeOther: (key: string) => void
    trigger?: DropdownProps['trigger']
}> = (props) => {
    // 这些props最好传值过来 如果再此组件监听则会很不雅 最好是父组件监听即可
    const {
        tagPath = '',
        pathname,
        trigger = ['contextMenu'],
        onClose,
        closeLeft,
        closeRight,
        closeAll,
        closeOther
    } = props
    const { t } = useTranslation();

    // 菜单
    const disabled = React.useMemo(() => {
        return !tagPath ? false : tagPath !== pathname
    }, [tagPath, pathname])
    const items: MenuProps['items'] = [
        {
            label:<RefreshView classNames='mr-2'>{t('layouts.reload')}</RefreshView> ,
            disabled: disabled,
            key: 'refresh'
        },
        {
            label: t('layouts.closeTab'),
            icon: <CloseOutlined/>,
            key: 'closeCurrent',
        },
        {
            label: t('layouts.closeLeftTabs'),
            icon: <VerticalRightOutlined/>,
            key: 'closeLeft',
            disabled: disabled
        },
        {
            label: t('layouts.closeRightTabs'),
            icon: <VerticalLeftOutlined/>,
            key: 'closeRight',
            disabled: disabled
        },
        {
            label: t('layouts.closeOtherTabs'),
            icon: <PicCenterOutlined/>,
            key: 'closeOther',
            disabled: disabled
        },
        {
            label: t('layouts.closeAllTabs'),
            icon: <DashOutlined/>,
            key: 'closeAll',
        },
    ];

    // 处理
    const handleMenu = (e:MenuInfo) => {
        if(e.key === 'closeCurrent') {
            onClose(tagPath)
        } else if(e.key === 'closeLeft') {
            closeLeft(tagPath)
        } else if(e.key === 'closeRight') {
            closeRight(tagPath)
        } else if(e.key === 'closeOther') {
            closeOther(tagPath)
        } else if(e.key === 'closeAll') {
            closeAll()
        }
    }

    return <Dropdown
            menu={{
                items,
                onClick: handleMenu
            }}
            trigger={trigger}
            dropdownRender={menu => (
                <div onClick={e => e.stopPropagation()}>
                    {menu}
                </div>
            )}
        >
            { props.children }
    </Dropdown>
}

export default TagMenu