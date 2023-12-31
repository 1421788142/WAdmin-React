import { Table } from "antd"
import { TableContextType, TablePropsType, RecordType } from "../types/type"
import { t } from "i18next"
import { Api } from "@/hooks/types/api"

const SummaryRender = <T extends Api, O extends RecordType<T>> (props:{
    pageData:any,
    autoSummary:boolean,
    fixed:TablePropsType<T,O>['summaryFixed'],
    column:TableContextType<T,O>['tableCol']
})=>{
    const { 
        pageData,
        fixed,
        column,
        autoSummary
    } = props
    return autoSummary ? <>
        <Table.Summary fixed={fixed}>
          <Table.Summary.Row>
            { column.filter(f=>f.show).map((item)=>{
                return  <Table.Summary.Cell index={0}  key={item.dataIndex as string}>
                    { item.summary ?
                        <div className="flex flex-row items-center justify-center">
                            { item.renderSummary ? item.renderSummary(pageData, item) : t('commons.summary') }
                        </div> :
                    '' }
                </Table.Summary.Cell>
            }) }
          </Table.Summary.Row>
        </Table.Summary>
    </> : <></>
}

export default SummaryRender