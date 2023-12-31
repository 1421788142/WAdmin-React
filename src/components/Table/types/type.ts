import { tableResultData } from "@/apis/interface";
import { TableProps } from 'antd'
import { Api } from "@/hooks/types/api";
import type { WTableColumn } from './index'
import { Updater } from "use-immer";
import { SizeType } from "antd/es/config-provider/SizeContext";

// 表格返回值
export type RecordType<T> = ResultType<PromiseReturnType<T>>
// 表格列
export type ColumnsType<T extends object> = WTableColumn<T>
// 入参
export type ArgsType<T extends Api> = Parameters<T>['length'] extends 0 ? undefined[] : Parameters<T>
// 返回值
export type ResultType<T> = T extends Result<tableResultData<any>> ? T['data']['dataList'] : any[]

// 暴露组件方法
export type UseTableImperative = {
    reset:()=> Promise<void>,
    getFormValue:()=> any
}

export type TableContextType<T extends Api, O extends RecordType<T>> = {
    params:Record<string,any>,// 表格请求参数
    loading:boolean,// 表格是否加载
    searchRef:React.RefObject<{// 头部搜索实例
        show: boolean;
        setShow: React.Dispatch<React.SetStateAction<boolean>>;
    }>,
    tableCol:WTableColumn<O, keyof O>[],// 表格列
    setTableCol: React.Dispatch<React.SetStateAction<WTableColumn<O, keyof O>[]>>
    size:SizeType,//表格大小
    setSize:React.Dispatch<React.SetStateAction<SizeType>>,
    // 搜索
    search: (query?: Record<string, any>) => Promise<void>,
    // 选中
    selected:{
        hasChecked: boolean,
        checkData: React.Key[]
    },
    setSelected: Updater<{
        hasChecked: boolean;
        checkData: React.Key[];
    }>,
    pageable:Omit<tableResultData<T>, "dataList" | "message">,
    paginationChange:(pageNum:number, pageSize:number)=>void,
    expandedRowKeys:React.Key[],
    setExpandedRowKeys:Updater<React.Key[]>
}

export type TablePropsType<T extends Api, O extends RecordType<T>> = {
    // 用于暴露组件的值和方法
    onRef?:  React.RefObject<UseTableImperative>,
    /** 表格配置项 */
    columns: Array<ColumnsType<RecordType<T>[number]>>;
    /** 数据源 如果使用那么requestApi则失效 */
    dataSource?: Array<O>;
    // 头部搜索按钮旁边
    SearchBtnRender?: () => React.ReactNode
    /** 请求表格数据的api ==> 必传 */
    api: T;
    /** 请求前触发入参为searchParams,返回值为false时取消请求,否则将返回值searchParams合并 */
    beforeLoad?: (args:ArgsType<T>)=> ArgsType<T>;
    /** 请求完成后渲染数据前触发,可处理数据 */
    afterLoad?: (
        record: O,
        setState: {
            setExpandedRowKeys:Updater<React.Key[]>,
            setSelected:Updater<{
                hasChecked: boolean;
                checkData: React.Key[];
            }>
        }
    ) => O;
    selection?: boolean; //是否显示表格选择框
    selectionOption?: TableProps<O>["rowSelection"]; //表格左侧选择框属性
    pagination?: boolean; //是否需要分页组件 ==> 非必传（默认为true）
    initParam?: Record<string,any>; //初始化请求参数 ==>非必传（默认为{}）
    toolButton?: boolean; //是否显示表格功能按钮 ==>非必传（默认为true）
    autoSummary?: boolean; //是否自动汇总 (通过填写col配置项，自动汇总)
    summaryFixed?: boolean | "top" | "bottom"; //汇总是否固定
    subTitle?: string; //副标题
    TableTitleRender?: () => React.ReactNode; //自定义表格标题
    TableHeaderRender?: (record: TableContextType<T,O>['selected']) => React.ReactNode; //表格头部按钮模块
    rowKey?: string; //选择框所选键值 allKey代表选择行数据
    scroll?: TableProps<T>["scroll"]; // 滚动配置项
    wrapClass?: string; //外层盒子的css类名
} & TableProps<any>