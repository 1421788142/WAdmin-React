import type { Dayjs } from 'dayjs';

type Generic = string;
type GenericFn = (value: Dayjs) => string;
export type FormatType = Generic | GenericFn | Array<Generic | GenericFn>;

export type formItemType =
    'Input' |
    'Select' |
    'InputNumber' |
    'DatePicker' |
    'RangePicker' |
    'TextArea' |
    'Radio' |
    'TreeSelect' |
    'IconPicker' |
    'Password'

// 所有表单组件的props属性集合
export type FormComponentProps<T> = {
    options: T, //此次选项兼容 searchForm 和 proForm
    allowClear: boolean, //是否清空组件数据内容
    autofocus: boolean,
    disabled: boolean,
    placeholder: string,
    size: 'large' | 'middle' | 'small',
    format: FormatType,
    showTime: boolean,
    showSearch: boolean,
    filterOption?: (value: any, option: any) => boolean,
    [prop: string]: any,
}