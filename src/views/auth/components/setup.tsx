import Theme from '@/layout/components/setting/components/theme'
import Lan from '@/layout/components/header/setupLan'
import { store } from '@/redux'

const Setup = ()=>{
    return (
        <div className='flex items-center login'>
            <Theme />
            <Lan />
        </div>
    )
}

export default Setup