import _ from 'loadsh'
import { useImmer} from 'use-immer'
import { Api, ResultType } from '@/hooks/types/api'
import { useEffect, useState } from 'react'
import { tableResultData } from '@/apis/interface'

/**
 * @description 查询分页功能
 * @param api 获取数据的api
 * @example
 * ```js
  import { userList } from "xxx/xxx/xxx/xxx";
  const { listData, loading, pageable, searchParam } = usePageData(userList, {
      xxx:'xxx'
      ....
  })
 * ```
 */

export type UsePageDataReturnType<T extends Api> = {
  dataSource: Array<ResultType<PromiseReturnType<T>>> //
  loading: boolean,
  pageable: Omit<tableResultData<T>,'dataList' | 'message'>,
  getPageData: (...args: Parameters<T>) => Promise<void>;
}

export const usePageData = <
    T extends Api,
>(
    api:T, //api
    args:Parameters<T>['length'] extends 0 ? undefined[] : Parameters<T>, //api的所有参数数组接收,
    options?:{
        afterRequest?: (record: tableResultData<ResultType<PromiseReturnType<T>>>) => ResultType<PromiseReturnType<T>> //加载完成后的回调
        autoLoad?:boolean
    }
):UsePageDataReturnType<T>=>{
    const [dataSource, setData] = useImmer<UsePageDataReturnType<T>['dataSource']>([] as any);
    const [ loading, setLoading ] = useState<UsePageDataReturnType<T>['loading']>(false);
    const [ pageable, setPageable ] = useImmer<UsePageDataReturnType<T>['pageable']>({
        pageNum: 1,
        pageSize: 10,
        total: 0
    })

    const updateData = (data:tableResultData<ResultType<PromiseReturnType<T>>>)=>{
        setData(data.dataList)
        setLoading(false)
        setPageable({
            pageNum: data.pageNum,
            pageSize: data.pageSize,
            total: data.total
        })
    }

    const { afterRequest, autoLoad = true } = options || {}

    let paramsArgs = _.cloneDeep(args) as Parameters<T>;
    const getPageData = async (..._args: Parameters<T>)=>{
        setLoading(true)
        paramsArgs = _.merge(paramsArgs, _args);
        const result = (await api.apply(null, paramsArgs)) as PromiseReturnType<Api>;
        if (result.code !== 200) return
        updateData(
            afterRequest
              ? afterRequest(result.data)
              : (result.data as any),
          );
    }

    useEffect(()=>{
        autoLoad && getPageData(...paramsArgs)
    },[])

    return {
        loading,
        dataSource,
        pageable,
        getPageData
    }
}