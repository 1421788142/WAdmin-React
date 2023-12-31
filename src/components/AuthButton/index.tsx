import { Button } from "antd"
import { t } from "i18next";
import { ButtonProps } from "antd/lib/button"
import AntdIcon from "../AntdIcon";
import { memo, useMemo } from "react";
import Permission from "@/utils/permission";
import { getCurrentRouter } from "@/utils/currentRouter"

enum btnIcon {
    add = "PlusOutlined",
    update = "FormOutlined",
    delete = "DeleteOutlined",
    export = "ExportOutlined",
}

const btnTitle = {
    add: t("buttons.add"),
    update: t("buttons.update"),
    delete: t("buttons.delete"),
    export: t("buttons.export"),
} as const

const AuthButton = (props:{
    onClick?:()=>void,
    children?:React.ReactNode,
    btnType?:ButtonProps['type'],
    title?: string; //按钮文字
    icon?: string | boolean; //按钮图标
    type?: string; //权限字符串 多个权限用逗号隔开 'add' || 'add,update'
    color?: string; //颜色
    disabled?: boolean; //禁用
}) => {
    const currentRouter = getCurrentRouter()
    const {
        btnType = 'text',
        type = 'add',
        disabled = false,
        title,
        children,
        color,
        onClick
    } = props

    const btnText = useMemo(()=>{
        return title || btnTitle[type as keyof typeof btnTitle]
    },[title,type])
    return <Permission keyVal={type} keyAll={currentRouter.meta.permission as string[]}>
        <div onClick={onClick}>
            { 
                children || 
                <Button
                    type={ btnType }
                    disabled={disabled}
                    style={{ color: color }}
                    icon={<AntdIcon component={btnIcon[type as keyof typeof btnIcon]} />}
                >{ btnText }
                </Button>
            }
        </div>
    </Permission>
}



export default memo(AuthButton)