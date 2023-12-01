import type { userStoreType } from '@/redux/interface/index'
import AntdIcon from '@/components/antdIcon';
import HasTooltip from '@/layout/components/menu/hasTooltip';
import { iconNameCase } from '@/layout/utils'
import { AppstoreOutlined } from '@ant-design/icons';
import { ItemType } from 'antd/es/menu/hooks/useItems';

export const menuItems = (
    router: userStoreType['userRouterList']
):ItemType[]=>{
    const getItem = (menu: userStoreType['userRouterList'][number]): ItemType => {
        if (menu.children && menu.menuType === 'M') {
            return {
                key: menu.path,
                icon: <AntdIcon emptyicon={
                    <AppstoreOutlined />
                } component={iconNameCase(menu.icon) as any}/>,
                children: menu.children.map(child => getItem(child)),
                label: <HasTooltip title={menu.title} />,
            }
        } else {
            return {
                key: menu.path,
                icon: <AntdIcon emptyicon={
                    <AppstoreOutlined />
                } component={iconNameCase(menu.icon) as any}/>,
                label: <HasTooltip title={menu.title} />,
            }
        }
    }

    const items: ItemType[] = router.map(menu => getItem(menu))
    return items
}