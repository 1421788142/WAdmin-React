import _ from "loadsh";
import type {
    OptionsContent,
    UseOptionsReturnType,
} from "./type";
import { useImmer } from 'use-immer';
import { useEffect, useState } from "react";
import { Api, ResultType } from "../types/api";

/**
 * @param api 获取options的api
 * @param args api入参
 * @example
 * ```js
  import { paramsAll } from "xxx/xxx/xxx/xxx";
  const { options, enums } = useOptions(paramsAll, [{}]); // typeof enums === { label: string; value: string; }[]

  const { options, enums } = useOptions(paramsAll, [{}], { // typeof enums === { a: number; }[]
    enumKey: {
      a: "id",
    },
  });
 * ```
 */

export const useOptions = <
    T extends Api,
    O extends OptionsContent<T> = OptionsContent<T>
>(
    api: T,
    args: Parameters<T>['length'] extends 0 ? undefined[] : Parameters<T>,
    option: O = {} as O
): UseOptionsReturnType<T, O> => {
    const [dataSource, setDS] = useImmer<UseOptionsReturnType<T, O>['dataSource']>([] as any);
    const [options, setOptions] = useImmer<UseOptionsReturnType<T, O>['options']>([]);
    const [ loading, setLoading ] = useState<UseOptionsReturnType<T, O>['loading']>(false);

    const updateData = (dataSource: UseOptionsReturnType<T, O>['dataSource']) => {
        setDS(dataSource); //赋值源数据
        setOptions( //赋值options
            dataSource.map(r => {
              const _e: any = {};
              for (const [key, valueKey] of Object.entries(optionKey)) {
                _e[key] = r[valueKey];
              }
              return _e;
            }),
        );
    }

    const {
        autoLoad = true,
        optionKey = { label: 'name', value: 'value' },
        afterRequest,
    } = option;

    // 初始化入参数据
    let paramsArgs = _.cloneDeep(args) as Parameters<T>;
    const getOptions = async (..._args: Parameters<T>): Promise<void> => {
        setLoading(true)
        paramsArgs = _.merge(paramsArgs, _args);
        const result = (await api.apply(null, paramsArgs)) as PromiseReturnType<Api>;
        if (result.code !== 200) return
        updateData(
            afterRequest
              ? afterRequest(result.data.dataList as ResultType<PromiseReturnType<T>>)
              : (result.data.dataList as any),
          );
        setLoading(false)
    }

    useEffect(() => {
        autoLoad && getOptions(...paramsArgs);
    }, []);

    return {
        loading,
        options,
        dataSource,
        getOptions
    }
}