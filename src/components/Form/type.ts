import { FormProps as AntdFormProps } from 'antd/es/form';
import type { SelectProps, FormItemProps } from 'antd'
import { FormComponentProps, formItemType } from '@/typings/formComponentPorps'
import React from 'react'

export namespace WFormType {
    export type PropType<T extends object,K extends keyof T> = {
        columns: Array<FormProps<T,K>>,
        onRef?: React.RefObject<UseImperative<T>>,
        gutter?: number; //栅格间隔
        span?: number; //格占位格数
        options?: AntdFormProps
    }

    export type UseImperative<T> = {
        getFields: () => T,
        resetFields: () => void,
        validateFields: () => Promise<T>
    }
}

export type FormProp = {
    defaultValue?: any,// 搜索项初始值
    sort?: number, //排序
    formItemType?: formItemType, // 表单项类型默认文本
    renderForm?: React.ReactNode, //自定义表单tsx
}

export type FormProps<T extends Object, K extends keyof T = keyof T> = {
    isHide?: () => boolean, //可通过表格设置显示隐藏,默认true
    //默认验证(默认给表单添加rules(可被formItemOption的rules替换)  rules: [{ required: true, trigger: ['change', 'blur'] }] )
    isRule?: boolean,
    validator?: (param: { formParam: T }) => void, //验证器
    colSpan?: number, //col占比
    componentOption?: Partial<FormComponentProps<SelectProps['options']>>,
    formItemOption?: FormItemProps<T> & {
        name: K,
        label: string
    }, //form-item的api
} & FormProp