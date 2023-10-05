import Menus from '../menu'
import { menuItems } from '@/layout/utils/menuItems';
import { useMenu } from '@/hooks/useMenu';
import { StoreType } from '@/redux/interface/index'
import { useNavigate, useLocation } from 'react-router-dom'

const HeaderMenu = (props:StoreType) => {
    const { configStore, userStore } = props

    const { component, theme } = configStore
    
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return <>
        <div className='flex-1 w-[200px]'>
            <Menus 
                items={menuItems(userStore.userRouterList)}
                {
                    ...useMenu({
                        userStore,
                        theme:configStore.theme,
                        navigate,
                        pathname,
                        hasOpenKey:false
                    })
                }
                mode='horizontal'
            />
        </div>
    </>
}

export default HeaderMenu