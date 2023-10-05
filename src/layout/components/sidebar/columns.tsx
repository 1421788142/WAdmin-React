import { memo, useMemo } from 'react'
import { StoreType } from '@/redux/interface/index'
import AntdIcon from '@/components/antdIcon';
import { getFirstMenu } from '@/layout/utils'

const Columns = (props:StoreType) => {
    const { configStore, userStore } = props

    const pathname = '/home'

    const firstMenu = useMemo(()=>{
        return getFirstMenu(userStore.userRouterList).map(menu=>{
            return (
                <div className='px-1 border-0 border-r-[1px] border-solid border-[#e8e8e8]'>
                    <div 
                        key={`${menu.id}_${menu.path}`} 
                        className={ 
                            [
                                'text-center cursor-pointer py-2 my-1',
                                pathname === menu.path ? 'columns-active' : ''
                            ].join(' ') 
                        }
                    >
                        <div>
                            { menu?.icon || '' }
                        </div>
                        <div className='w-[70px]'>
                            { menu.title }
                        </div>
                    </div>
                </div>
            )
        })
    },[userStore.userRouterList])

    console.log(firstMenu)

    return <div className='flex h-screen'>
        <div className='h-full overflow-auto menu-box'>
            <div className='flex flex-col overflow-auto'>
                { firstMenu }
                <div>

                </div>
            </div>
        </div>
        <div className='h-full overflow-auto menu-box'>
            <div className='h-[2000px]'>navMenu</div>
        </div>
    </div>
}

export default memo(Columns)