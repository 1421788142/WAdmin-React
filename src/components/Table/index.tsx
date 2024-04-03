import { Api } from "@/hooks/types/api";
import { TableContextType, TablePropsType, RecordType } from './types/type'
import { createContext, useImperativeHandle, useMemo, useState, useContext, useEffect } from "react";
import { setSearhFormColumns } from './utils';
import WSearchForm from '@/components/SearchForm/index'
import React from "react";
import TabelHead from './components/header'
import { t } from "i18next";
import { ColumnWidthOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Dropdown, FormInstance, Table, Tooltip } from "antd";
import TableColSetting from "./components/colSetting";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { useTable } from "@/hooks/useTable";
import { useImmer } from 'use-immer'
import { SearchFormColumns, SearchFormProps } from "@/components/SearchForm/type";
import SummaryRender from "./components/summaryRender";
import { UseTableImperative } from './types/type'

export const TableContext = createContext<any>(null)

// 头部搜索模块
const SearchFormRender = <T extends Api, O extends RecordType<T>>(props:{
    onRef:React.RefObject<{
        show: boolean;
        setShow: React.Dispatch<React.SetStateAction<boolean>>;
    }>,
    BtnRender:SearchFormProps<O>['BtnRender']
})=>{
    const {
        columns,
        SearchBtnRender,
        search,
        loading,
        initParam
    } = useContext<TablePropsType<T,O> & TableContextType<T,O>>(TableContext);
    const {
        onRef,
        BtnRender
    } = props
    const [ show, setShow ] = useState<boolean>(true)
    const [ searchCol, setSearchCol ] = useImmer<SearchFormColumns<O>[]>([])
    const [ initSearchParams, setInitSearchParam ] = useState<Record<string,any>>()

    // 暴露方法出去给父组件使用
    useImperativeHandle(onRef,()=>{
        return {
            setShow,
            show,
        }
    })

    useEffect(()=>{
        const { columns: searchColumns, initSearchParam } = setSearhFormColumns<T,O>({ columns })
        setSearchCol(searchColumns)
        search(initSearchParam)
        setInitSearchParam(initSearchParam)
    },[columns])

    const initParams = useMemo(()=>{
        return { ...initParam, ...initSearchParams }
    },[initParam,initSearchParams])

    return <>
        <div className={[(show ? 'block' : 'hidden')].join(' ')}>
            <WSearchForm
                loading={loading}
                columns={searchCol}
                initSearchParam={initParams}
                SearchBtnRender={SearchBtnRender}
                BtnRender={BtnRender}
            ></WSearchForm>
        </div>
    </>
}

// 表头上面操作栏
const TableHeadRender = <T extends Api, O extends RecordType<T>>()=>{
    const {
        subTitle,
        TableTitleRender,
        TableHeaderRender,
        searchRef,
        tableCol,
        setTableCol,
        search,
        size,
        toolButton,
        selected,
        setSize,
    } = useContext<TablePropsType<T,O> & TableContextType<T,O>>(TableContext);
    // 自定义表格头部功能
    const ToolButtonRender = useMemo(()=>{
        const Items = [
          { title: t('components.dataFilter'), cont: <SearchOutlined onClick={()=>{
            searchRef.current?.setShow(!searchRef.current.show)
          }}/> },
          { title: t('buttons.refresh'), cont: <RedoOutlined onClick={()=>{
            if(searchRef.current?.show){
                search()
            }
          }}/> },
          { title: t('components.density'), cont: <>
            <Dropdown
              trigger={['click']}
              placement='bottom'
              menu={{
                onClick: (menuKey) => {
                    setSize(menuKey.keyPath[0] as SizeType)
                },
                defaultSelectedKeys: [size] as string[],
                selectable: true,
                items: [
                  { label:t('components.default'), key: 'default' },
                  { label:t('components.middle'), key: 'middle' },
                  { label:t('components.small'), key: 'small' },
                ]
            }}
            >
              <ColumnWidthOutlined/>
            </Dropdown>
          </> },
        ]
  
        return <>
            <div className='grid grid-flow-col grid-rows-1 gap-2 ml-2 text-xl'>
              { Items.map((item,index)=>{
                return <span key={index}>
                  <Tooltip placement='top' className='cursor-pointer' title={item.title}>
                    { item.cont }
                  </Tooltip>
                </span>
              }) }
              <TableColSetting<T,O>
                columns={tableCol || []}
                setState={setTableCol as any}
              />
            </div> 
        </>
    },[size,searchRef])

    return <>
        <TabelHead
            subTitle={subTitle}
            TableTitleRender={TableTitleRender}
            TableHeaderRender={TableHeaderRender}
            selected={selected}
        >
            { toolButton && ToolButtonRender }
        </TabelHead>
    </>
}

// 表格组件
const TableRender = <T extends Api, O extends RecordType<T>>()=>{
    const {
        summary,
        autoSummary,
        summaryFixed,
        dataSource,
        rowKey,
        size,
        scroll,
        loading,
        pagination,
        pageable,
        selection,
        selectionOption,
        expandable,
        paginationChange,
        tableCol,
        selected,
        setSelected,
        expandedRowKeys,
        setExpandedRowKeys
    } = useContext<TablePropsType<T,O> & TableContextType<T,O>>(TableContext);

    return <>
        <div className='flex flex-1 w-full'>
            <Table
                className='flex-1 w-full'
                loading={loading}
                size={size}
                scroll={scroll}
                // 分页
                pagination={ pagination && {
                    size:'default',
                    className:'w-tabel-pagination',
                    ...pageable,
                    current:pageable.pageNum,
                    showSizeChanger:true,
                    showQuickJumper:true,
                    showTotal:(total) => `${t('components.paginationTotal',{total:total})}`,
                    onChange:paginationChange
                }}
                // 选择功能
                rowSelection={ (selection || selectionOption) ? {
                    onChange:(newSelectedRowKeys: React.Key[])=>{
                        setSelected(()=>({
                            checkData: newSelectedRowKeys,
                            hasChecked: Boolean(!newSelectedRowKeys.length)
                        }))
                    },
                    ...selectionOption,
                    selectedRowKeys:selected.checkData
                } : undefined}
                //展开功能
                expandable={{
                    ...expandable,
                    expandedRowKeys,
                    onExpandedRowsChange:(keys)=>{
                        setExpandedRowKeys(keys as React.Key[])
                    }
                }}
                // 汇总
                summary={summary ? summary : (pageData)=>{
                    return <SummaryRender<T,O>
                    pageData={pageData}
                    autoSummary={autoSummary || false}
                    fixed={summaryFixed}
                    column={tableCol}
                    />
                }}
                bordered
                rowKey={rowKey}
                dataSource={dataSource}
                columns={tableCol.filter(col => col.show) as any}
                >
            </Table>
        </div>
    </>
}

const WTable = React.memo(<
    T extends Api,
    O extends RecordType<T>
>(
    props:TablePropsType<T,O>
)=>{
    console.log('WTable')
    const defaultProps = useMemo(()=>{
        return {
            scroll:{
                x: 1200,
                y: '70vh'
            },
            autoSummary:false,
            toolButton:true,
            pagination:true,
            summaryFixed:'buttom',
            rowKey:'id',
            wrapClass:'',
            ...props
        } as TablePropsType<T,O>
    },[props])

    const {
        params,
        loading,
        pageable,
        dataSource,
        selected,
        setSelected,
        expandedRowKeys,
        setExpandedRowKeys,
        size,
        setSize,
        tableCol,
        setTableCol,
        search,
        paginationChange,
        setPageable
    } = useTable(defaultProps)

    // 搜索组件实例
    const searchRef = React.createRef<{
        show:boolean,
        setShow: React.Dispatch<React.SetStateAction<boolean>>
    }>();

    // 搜索按钮
    const SearchBtns = ({ form, loading }:{ form :FormInstance<any>, loading:boolean })=>{
        const getDataSource = ()=>{
            setPageable((value)=>({
                ...value,
                pageNum:1,
            }))
            let searchParams = form?.getFieldsValue()
            search({...searchParams,pageNum:1})
        }
        return <>
            <Button type="primary"
                loading={ loading }
                onClick={()=>getDataSource()}
            > { t("buttons.inquire") } </Button>
            <Button className="ml-1" onClick={ ()=>{
                form.resetFields()
                getDataSource()
            } } disabled={ loading }> { t("buttons.reset") } </Button>
        </>
    }

    // 暴露方法出去给父组件使用
    useImperativeHandle<UseTableImperative,UseTableImperative>(defaultProps?.onRef,()=>{
        return {
            reset:()=> search({}),
            getFormValue:()=> params as O,
        }
    })

    return <TableContext.Provider value={{
        ...defaultProps,
        searchRef,
        params,
        loading,
        pageable,
        dataSource,
        selected,
        setSelected,
        expandedRowKeys,
        setExpandedRowKeys,
        size,
        setSize,
        paginationChange,
        tableCol,
        setTableCol,
        search
    }}>
        <div className={['flex flex-col w-full h-full wadmin-content-bg', defaultProps.wrapClass].join(' ')}>
            <div className="w-full p-1 mb-1">
                {/* 头部搜索 */}
                <SearchFormRender<T,O>
                    onRef={searchRef}
                    BtnRender={SearchBtns}
                />
                {/* 表格头部操作 */}
                <TableHeadRender/>
            </div>
            {/* 表格 */}
            <TableRender />
        </div>
    </TableContext.Provider>
})

export default WTable