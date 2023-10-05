import { DatePicker, Button, Input, message, App } from 'antd';

const HomePage = ()=>{
    const app = App.useApp()
    return(<div>
                <Button type="primary">Happy Work</Button>
            <DatePicker/>
            <Button type='primary' onClick={()=>app.message.info('123')}>按钮</Button>
            <Input placeholder="Basic usage" />
    </div>) 
}

export default HomePage