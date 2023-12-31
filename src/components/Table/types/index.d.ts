import type { SelectProps, TableColumnType, FormItemProps } from "antd";
import type { enumProp, SearchFormColumns } from '@/components/SearchForm/type'

export interface SearchProps {
    labelCol?: FormItemProps['labelCol'],
    wrapperCol?: FormItemProps['wrapperCol'],
}

export interface WTableColumn<
    T extends object,
    K extends keyof T = keyof T
> extends TableColumnType<T> {
    title: string,//单元格表头（非特殊类型必填）
    dataIndex: K | 'operation',//单元格表头（非特殊类型必填）operation 操作列
    search?: boolean, //是否作为查询条件,有搜索条件或者
    searchOption?: SearchProps & SearchFormColumns<T,K>  //查询表单配置项(有此配置则默认做完搜索条件)
    show?: boolean, //可通过表格设置显示隐藏,默认true
    hide?: boolean, //是否渲染(不会显示并且不能加入表格设置)
    tooltip?: boolean, //是否鼠标移动至内容显示提示框
    tag?: boolean; //是否是标签展示
    sort?: number, //排序
    image?: boolean; //是否是图片展示
    preview?: boolean; //是否查看大图
    height?: string | number, //图片高度
    summary?: boolean, //是否汇总
    renderSummary?: (pageData: any, column: WTableColumn<T>) => any, //自定义汇总内容
    enum?: enumProp[], //tag标签 默认取 searchOption['options']
    showEnum?: boolean; //表格有枚举时是否显示枚举内容,默认true
    children?: WTableColumn<T>[],//子表格
}