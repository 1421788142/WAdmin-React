import type { FormInstance, FormItemProps, SelectProps } from "antd"
import { FormProp } from '@/components/Form/type'
import { DefaultOptionType } from "antd/es/select"
import { FormComponentProps } from "@/typings/formComponentPorps"

export type SearchFormProps<T extends object,K extends keyof T = keyof T> = {
    SearchBtnRender?:() => React.ReactNode,
    BtnRender?:(record:{
        form:FormInstance<any>,
        loading:boolean
    })=>React.ReactNode,
    loading?:boolean,
    search?:(params: Record<string,any>) => void
    columns:SearchFormColumns<T,K>[],
    initSearchParam:Record<string,any>,
    onRef?:React.RefObject<any>
}

/**
 * 枚举 1.搜索表单下拉选择框 2.table数据转换
*/
export interface enumProp {
    value: any,
    label: string,
    color?: string
}
export type SearchFormColumns<T extends object,K extends keyof T = keyof T> = {
    transform?: (params: any) => any//转换搜索条件
} & FormProp & {
    componentOption?: Partial<FormComponentProps<(DefaultOptionType & enumProp)[]>>,
    formItemOption?: FormItemProps<T> & {
        name?: K,
        label?: string
    }, //form-item的api
}