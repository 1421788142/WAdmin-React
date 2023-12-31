import { Api, DataContent, ResultType } from "../types/api";

export type OptionsContent<T extends Api> = {
    autoLoad?: boolean
    optionKey?: {
        label: keyof DataContent<T>,
        value: keyof DataContent<T>,
        [props: string]: keyof DataContent<T>
    },
    afterRequest?: (record: ResultType<PromiseReturnType<T>>) => ResultType<PromiseReturnType<T>> //加载完成后的回调
}

type GetEnumKey<O extends OptionsContent<any>> = keyof O['optionKey'] extends '' ?
    { label: "name"; value: "value" }
    : O["optionKey"];

export type UseOptionsReturnType<T extends Api, O extends OptionsContent<T>> = {
    dataSource: ResultType<PromiseReturnType<T>> //处理前的数据
    options: { //处理后的数据
        // @ts-ignore
        [K in keyof GetEnumKey<O>]-?: DataContent<T>[GetEnumKey<O>[K]]
    }[]
    loading: boolean,
    getOptions: (...args: Parameters<T>) => Promise<void>;
}