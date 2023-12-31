import { getAssets } from "@/utils"
import { TablePropsType, RecordType } from "../types/type"
import { Image, Tag, Tooltip } from 'antd'
import { defaultFormat, filterEnum } from "../utils"
import { Api } from "@/hooks/types/api"
import { WTableColumn } from "../types"

const AutoRender = <T extends Api, O extends RecordType<T>> (props:{
    value:any,
    recode:T
    column:WTableColumn<T,keyof T>
}) => {

    const {
        value,
        recode,
        column
    } = props
    
    return <>
        {/* image */}
        {
            column.image &&
            <div className="table-img-box">
                <Image
                    src={value}
                    preview={column.preview}
                    width={column.width || 130}
                    height={column.height || 130}
                    fallback={getAssets('image/404.png')}
                ></Image>
            </div>
        }
        {/* tag */}
        {
            column.tag && column.enum &&
            <Tag
                color={filterEnum(value, column.enum || [],'tag')}
            >
                { column.enum.length ? filterEnum(value, column.enum) : defaultFormat(value) }
            </Tag>
        }
        {/* tooltip提示 */}
        {
            column.tooltip && 
            <Tooltip title={value}>
                <div className="mx-auto text-center truncate" style={{ width: `${column.width}px` || '130px' }}>
                    { value }
                </div>
            </Tooltip>
        }
        {/* 默认 */}
        {
            !column.image && !column.tag && !column.tooltip &&
            <div>
                {
                    column.enum?.length && column.showEnum
                    ? filterEnum(value, column.enum)
                    : defaultFormat(value)
                }
            </div>
        }
    </>
}

export default AutoRender