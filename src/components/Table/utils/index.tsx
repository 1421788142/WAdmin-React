import { isArray, isBoolean } from '@/utils/is'
import { deepMerge } from '@/utils/index';
import { SearchFormColumns } from '@/components/SearchForm/type';
import AutoRender from '../components/autoRender';
import { Api } from '@/hooks/types/api';
import { TablePropsType, RecordType } from '../types/type';
import { WTableColumn } from '../types';


/**
 * @description 获取排序
 * @param {Number} sort 当前排序号
 * @param {Number} defaultSort 默认排序号
 * @return string
 * */
export const getSort = (sort: number, defaultSort: number = 10) => sort ?? defaultSort //排序

/**
 * @description 处理tableColumns转换a-table columns配置项
 * @param {Array} columns 自定义的配置
 * @return {WTableColumn} tableColumns 转换后的配置
 * */
export function setTableColumns<T extends Api, O extends RecordType<T>>({
    columns,
}:{
    columns: TablePropsType<T,O>['columns'],
}): {
    columns: Array<WTableColumn<O,keyof O>>
} {
    return {
        columns:columns.filter(x => !x.hide).map(m => {
            return {
                ...m,
                key:m.dataIndex as string,
                enum: m?.enum ?? m?.searchOption?.componentOption?.options,
                show: isBoolean(m?.show) ? m?.show : true,
                preview: isBoolean(m?.preview) ? m?.preview : true,
                showEnum: isBoolean(m?.showEnum) ? m?.showEnum : false,
                width: m.width || 150,
                align: m.align || 'center',
                render: m.render || ((value, record)=>{ //自定义渲染 这里给默认值
                    return <AutoRender<T,O> value={value} recode={record} column={m} />
                }),
            };
        }).sort((a, b) => {
            return getSort(a.sort || 50) - getSort(b.sort || 50)
        }) as Array<WTableColumn<O,keyof O>>
    }
}


/**
 * @description 处理searchForm formItem配置
 * @param {Array} columns 自定义的配置
 * */
export function setSearhFormColumns<T extends Api, O extends RecordType<T>>({
    columns,
}:{
    columns: TablePropsType<T,O>['columns'],
}): {
    columns: SearchFormColumns<O>[],
    initSearchParam: { [key: string]: any }
} {
    const initSearchParam = {} as { [key: string]: any }
    const column = columns.filter(x => x.search || x.searchOption).map(m => {
        let formItemOption = {
            name: m?.searchOption?.formItemOption?.name || m.dataIndex,
            label: m?.searchOption?.formItemOption?.label || m.title
        } as SearchFormColumns<O>['formItemOption'] & {
            name: string
            label: string
        }
        let options = deepMerge({}, { ...m?.searchOption ?? {}, formItemOption })
        initSearchParam[options.formItemOption.name] = options?.defaultValue || null;
        return {
            formItemType: 'Input',
            ...options,
        } as SearchFormColumns<O>;
    }).sort((a, b) => {
        return getSort(a.sort || 50) - getSort(b.sort || 50)
    })

    return {
        columns:column,
        initSearchParam
    } 
}

/**
 * @description 格式化表格单元格默认值
 * @param {Number} row 行
 * @param {Number} col 列
 * @param {String} callValue 当前单元格值
 * @return string
 * */
export function defaultFormat(callValue: any, joinStr: string = ',') {
	// 如果当前值为数组,使用 / 拼接（根据需求自定义）
	if (isArray(callValue))
		return callValue.length ? callValue.join(joinStr) : "--";
	return callValue ?? "--";
}

/**
 * @description 根据枚举列表查询当需要的数据
 * @param {String} callValue 当前单元格值
 * @param {Array} enumData 枚举列表
 * @param {String} type 过滤类型（目前只有 tag）
 * @return string
 * */
export function filterEnum<
    T extends object,
    K extends keyof T = keyof T
>(
	callValue: any,
	enumData: WTableColumn<T, K>['enum'] = [],
	type?: string
): string {
	let filterData = enumData.find((item) => item.value === callValue);
	if (type == "tag") return filterData?.color ? filterData.color : "";
	return filterData ? filterData.label : "--";
}


/**
 * @description 根据列表返回列表处理为table枚举列表
 * @param {String} labelKey table标题
 * @param {String} valueKey 枚举value值
 * @param {Array} listData 后台返回的数据
 * @return Array
 * */
type EnumType = {
	label: string;
	value: number | string;
};

/**
 * @description 根据列表返回处理为table的enum可用数据
 * @param {String} labelKey 数据标题
 * @param {String} valueKey 数据value值
 * @param {Array} listData 后台返回的数据
 * @return Array
 * */
export function setupTableEnum(
	labelKey: string,
	valueKey: string,
	listData: any[]
): Array<EnumType> {
	let EnumList:EnumType[] = [];
	listData.forEach((item) => {
		EnumList.push({
			label: item[labelKey],
			value: item[valueKey],
		});
	});
	return EnumList;
}

/**
 * @description 根据列表返回列表处理为table枚举列表
 * @param {String} value 拿取的value值
 * @param {String} key 根据key进行查找
 * @param {String} title 需要返回的value值
 * @param {Array} listData 后台返回的数据
 * @return Array
 * */
export function getEnumLable(
	key: string,
	value: string,
	title: string,
	listData: any[] = []
) {
	let item = listData.filter((x) => x[key] == value);
	return item.length > 0 && item[0][title] ? item[0][title] : "---";
}