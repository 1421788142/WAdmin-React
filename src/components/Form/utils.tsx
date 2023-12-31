import { formItemType } from "@/typings/formComponentPorps";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { 
    DatePicker,
    Form,
    Input,
    InputNumber,
    Radio,
    Select,
    TreeSelect,
} from "antd"
import { FormProp, FormProps } from "./type";

const { RangePicker } = DatePicker;

const AutoLoadCom = <T extends object>(props:{
    type?:formItemType,
    comProps?:any,
    formItemOption?:FormProps<T>['formItemOption'],
    renderForm?:FormProp['renderForm'],
}) => {
    const { type, comProps = {}, formItemOption = {}, renderForm } = props

    // 筛选
    const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    let SwitchDom = <Input { ...comProps } />

    switch(type){
        case 'TextArea':
            SwitchDom = (
                <Input.TextArea
                    { ...comProps }
                />
            )
            break;
        case 'Password':
            SwitchDom = (
                <Input.Password
                    { ...comProps }
                    iconRender={(visible:boolean) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
            )
            break;
        case 'Select':
            SwitchDom = (
                <Select
                    showSearch
                    filterOption={filterOption}
                    { ...comProps }
                />
            )
            break;
        case 'InputNumber':
            SwitchDom = (
                <InputNumber
                    max={100}
                    min={0}
                    step={1}
                    {...comProps}
                />
            )
            break;
        case 'DatePicker':
            SwitchDom = (
                <DatePicker
                    showTime
                    {...comProps}
                />
            )
            break;
        case 'RangePicker':
            SwitchDom = (
                <RangePicker
                    showTime
                    {...comProps}
                />
            )
            break;
        case 'Radio':
            SwitchDom = (
                <Radio.Group
                    {...comProps}
                />
            )
            break;
        case 'TreeSelect':
            SwitchDom = (
                <TreeSelect
                    style={{ width: '100%' }}
                    allowClear
                    showSearch
                    {...comProps}
                />
            )
            break
    }
    return <Form.Item { ...formItemOption }>
        { renderForm ?? SwitchDom }
    </Form.Item>
}

export { AutoLoadCom }