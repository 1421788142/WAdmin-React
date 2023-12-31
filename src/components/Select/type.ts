import { Api, DataContent, ResultType } from "@/hooks/types/api";
import { SelectProps } from "antd";

export type OptionsContent<T extends Api> = {
    optionKey?: {
        label: keyof DataContent<T>,
        value: keyof DataContent<T>,
        [props: string]: keyof DataContent<T>
    },
    autoLoad?:boolean,
    afterRequest?: (record: ResultType<PromiseReturnType<T>>) => ResultType<PromiseReturnType<T>> //加载完成后的回调
} & SelectProps

export type ApiType = Api