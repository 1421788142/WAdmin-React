import {
    Form,
    Row,
    Col,
} from 'antd'
import { useTranslation } from 'react-i18next'
import {
    useImperativeHandle,
    useMemo
} from 'react'
import { AutoLoadCom } from "@/components/Form/utils";
import { Rule } from 'antd/es/form';
import { useElementSize } from 'usehooks-ts'
import { WFormType } from './type'

const WSerchForm = <T extends object = any, K extends keyof T = keyof T>(
    props:WFormType.PropType<T,K>
)=>{
    const {
        columns = [],
        onRef,
        gutter = 24,
        span = 12,
        options
    } = props

    const { t } = useTranslation();
    const [ form ] = Form.useForm();
    
    // 是否展开搜索项
    const [FormRef, { width }] = useElementSize()
    const formRowSpan = (colSpan: number = 0) => {
        if (width >= 1200) {
          return 6;
        } else if (width >= 700) {
          return colSpan || span;
        } else {
          return 24;
        }
    };
    
    // 暴露方法出去给父组件使用
    useImperativeHandle<any,WFormType.UseImperative<T>>(onRef,()=>{
        return {
            getFields: ()=>{ //获取参数
                return form.getFieldsValue()
            },
            resetFields:()=>{ //重置表单
                form.resetFields()
            },
            validateFields: async ()=>{ //校验
                return form.validateFields()
            }
        }
    })

    const formColumns = useMemo(()=>{
        return columns.filter(f=>(f.isHide && f.isHide()) ?? true).map((item)=>{
            return {
                ...item,
                formItemOption:{
                    ...item.formItemOption,
                    rules:item?.isRule ? [{
                        required: true,
                        trigger: ["change", "blur"],
                        validator: item?.validator
                        ? (rule: Rule, value: any) =>
                            item.validator!({ formParam: form.getFieldsValue() })
                        : (rule: Rule, value: any) => {
                            if ([0].includes(value) || (value && String(value))) {
                              return Promise.resolve();
                            } else {
                              return Promise.reject(
                                `${t("commons.notEmpty", {
                                  text: item?.formItemOption?.label
                                })}`,
                              );
                            }
                          },
                    }] : []
                } as any
            }
        })
    },[columns])

    return <div ref={FormRef} className="justify-between md:flex table-search wadmin-content-bg">
        <Form
            className='flex-1'
            form={form}
            {...options}
        >
            <Row gutter={gutter}>
                { formColumns.map(({
                    formItemOption,
                    componentOption,
                    formItemType,
                    colSpan,
                    renderForm
                })=>{
                    const { name } = formItemOption as { name:string, label:string }
                    return <Col span={formRowSpan(colSpan)} key={ name }>
                        <div className='w-full'>
                            <AutoLoadCom<T>
                                formItemOption={ formItemOption }
                                comProps={ componentOption }
                                type={ formItemType }
                                renderForm={ renderForm }
                            />
                        </div>
                    </Col>
                }) }
            </Row>
        </Form>
    </div>
}

export default WSerchForm