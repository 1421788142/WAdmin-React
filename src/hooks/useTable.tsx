import React, { useEffect } from 'react';
import { App, TableProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { setTableColumns } from '@/components/Table/utils/index';
import { Api } from './types/api';
import { TablePropsType, RecordType } from '@/components/Table/types/type';
import { useImmer} from 'use-immer'
import { WTableColumn } from '@/components/Table/types';
import { isObject } from '@/utils/is';
import { useUpdateEffect } from './useUpdateEffect';

export const useTable = <
    T extends Api,
    O extends RecordType<T>
>({
    columns,
    size:defSize,
    initParam,
	pagination,
	api,
	beforeLoad,
	afterLoad,
}:TablePropsType<T,O>) => {
    const app = App.useApp();
    const { t } = useTranslation();
    
    // 加载
    const [ loading, setLoading ] = React.useState<boolean>(true)
    const [ params, setParams ] = useImmer<Record<string,any>>(initParam ?? {})
    //分页
    const [ pageable, setPageable ] = useImmer<{
        pageSize: number,
        pageNum: number,
        total: number
    }>({
        pageSize: 10,
        pageNum: 1,
        total: 0
    })
    // 数据源
    const [ tableCol, setTableCol ] = useImmer<Array<WTableColumn<O,keyof O>>>([])
    // 数据源
    const [ dataSource, setDataSource ] = useImmer<TablePropsType<T,O>['dataSource']>([])
    // 展开的行
    const [ expandedRowKeys, setExpandedRowKeys ] = useImmer<React.Key[]>([])
    // 表格的选择
    const [ selected, setSelected ] = useImmer<{
        hasChecked: boolean,
        checkData: React.Key[]
    }>({
        hasChecked: false,
        checkData: []
    })
    //是否查询失败重启 0没有重启任务 1正在重启,重启成功恢复到0
    const [ errorReset, setErrorReset ] = React.useState<number>(0)
    const [ size, setSize ] = React.useState<TablePropsType<T,O>['size']>(defSize ?? 'middle')

    useEffect(()=>{
        const { columns: tableColumns } = setTableColumns<T,O>({ columns })
        setTableCol(tableColumns)
    },[columns])

	/**
	 * @description 获取表格数据
	 * @return void
	 * */
	const getTableList = async (params:Record<string,any>) => {
		try {
            const $totalParams = {
                ...pageable,
                ...params,
                ...initParam
            } as any
            setLoading(true)
			const { data } = await api(beforeLoad ? beforeLoad($totalParams) : $totalParams);
            const handleList = afterLoad ? afterLoad(data as unknown as O, {
                setExpandedRowKeys,
                setSelected
            }) : (() => (pagination ? data.dataList : data))() as TablePropsType<T,O>['dataSource']
            // 重置查询错误次数
            setErrorReset(0)
			// 解构后台返回的分页数据(如果有分页更新分页信息)
			const { total = 0 } = data;

            setDataSource(handleList)
            setPageable((value)=>({...value,total}))
		} catch (error) {
			// 失败重启查询一次  bug:前一次请求和当前请求一样则会情况当前请求,所以导致拿不到数据  所以这里定义一下重启
            setErrorReset((value)=>value+1)
			if (errorReset !== 1) return
			app.message.warning(t('messages.queryFailed', { num: 2 }))
			setTimeout(() => {
				getTableList(params)
			}, 2000)
		} finally {
            setLoading(false)
		}
	};

    /**
	 * @description 转换传参( a.date = ['2021-01-01', '2021-01-02'] transform a.dateStart = '2021-01-01' a.dateEnd = '2021-01-02')
	 * @return { Object } 转换后的值
	 * */
	const transform = (formParam: Record<string, any>): Record<string, any> => {
        let transParams = {}
		columns.forEach((item) => {
			if (item.searchOption?.transform && item.searchOption?.transform instanceof Function) {
				const returnParam = item.searchOption?.transform(formParam)
				isObject(returnParam) && Object.assign(transParams, returnParam)
			}
		})
        return transParams
	}

    // 分页
    const paginationChange = (pageNum:number, pageSize:number)=>{
        setPageable((value)=>({
            ...value,
            pageNum,
            pageSize
        }))
        search({
            pageNum,
            pageSize
        })
    }

    const search = async (newParams:Record<string,any> = {})=>{
        let transParams = transform(newParams)
        const totalParams = { ...params, ...newParams, ...transParams }
        setParams((oldValue)=>({ ...oldValue, ...newParams }))
        await getTableList(totalParams)
    }

	return {
        params,
        expandedRowKeys,
        loading,
        pageable,
        dataSource,
        selected,
        size,
        tableCol,
        setTableCol,
        setSize,
        search,
        setPageable,
        setSelected,
        setExpandedRowKeys,
        paginationChange
	};
}