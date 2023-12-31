import {
    Form,
    Button,
    Row,
    Col,
} from 'antd'
import { useTranslation } from 'react-i18next'
import React, {
    useState,
    useMemo,
    useRef,
    useEffect,
    useImperativeHandle
} from 'react'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { useAutoFormRow } from "@/hooks/useAutoFormRow";
import { AutoLoadCom } from "@/components/Form/utils";
import { SearchFormProps } from './type'

const WSerchForm = <T extends object, K extends keyof T = keyof T>(
    props:SearchFormProps<T,K>
)=>{
    const {
        loading = false,
        columns = [],
        initSearchParam = {},
        SearchBtnRender,
        BtnRender,
        search = ()=>{},
        onRef
    } = props

    const { t } = useTranslation();
    const [ form ] = Form.useForm();
    // 是否展开搜索项
    const searchFormRef = useRef(null);
    const gutter = 24;
    const [ showMax, setShowMax ] = useState(false);

    const { init, num } = useAutoFormRow(searchFormRef, 4, 4);
    useEffect(()=>{
        init();
    },[])

    const searchColumns = useMemo(()=>{
        return columns.slice(0, showMax ? columns.length : num)
    },[ showMax, num, columns ])

    useEffect(()=>{
        if(!searchFormRef.current) return
        form.setFieldsValue(initSearchParam)
    },[initSearchParam])

    const searchClick = ()=>{
        const query = form.getFieldsValue()
        search(query)
    }

    // 暴露方法出去给父组件使用
    useImperativeHandle(onRef,()=>{
        return {
            resetHandle:()=>{
                form.resetFields()
                searchClick()
            },
            getFields: ()=>{ //获取参数
                return form.getFieldsValue()
            },
        }
    })

    const FormRender = useMemo(()=>{
        return <>
            <Form
                className='flex-1'
                form={form}
                initialValues={initSearchParam}
            >
                <Row gutter={gutter}>
                    { searchColumns.map(({ formItemOption, componentOption, formItemType, renderForm })=>{
                        const { name } = formItemOption as { name:string, label:string }
                        return  <Col span={Math.ceil(gutter / num)} key={ name }>
                            <div className='w-full'>
                                <AutoLoadCom
                                    formItemOption={ formItemOption as any }
                                    comProps={ componentOption }
                                    type={ formItemType }
                                    renderForm={ renderForm }
                                />
                            </div>
                        </Col>
                    }) }
                </Row>
            </Form>
        </>
    },[
        initSearchParam,
        searchColumns,
        form
    ])

    const FormBtnsRender = useMemo(()=>{
        return <div className="flex items-center ml-5">
            { SearchBtnRender && <SearchBtnRender/>}
            { BtnRender ? <BtnRender form={form} loading={loading} /> : <>
                <Button type="primary"
                    onClick={ searchClick }
                    loading={ loading }
                > { t("buttons.inquire") } </Button>
                <Button className="ml-1" onClick={ ()=>{
                    form.resetFields()
                    searchClick()
                } } disabled={ loading }> { t("buttons.reset") } </Button>
            </> }

        </div>
    },[loading,form,SearchBtnRender])

    return <div ref={searchFormRef} className="justify-between md:flex table-search wadmin-content-bg">
        { FormRender }
        <div className="flex justify-end h-max">
            { FormBtnsRender }
            { columns.length > num && 
                <div className="flex pt-1 ml-2 cursor-pointer">
                    <div className="flex items-center w-max" onClick={()=>setShowMax((v)=>!v)}>
                        <span className="mr-1">{ showMax ? "收起" : "展开" }</span>
                        { showMax ? <UpOutlined/> : <DownOutlined/> }
                    </div>
                </div>  
            }
        </div>
    </div>
}

export default WSerchForm