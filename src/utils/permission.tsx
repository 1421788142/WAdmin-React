const Permission:React.FC<{
    children?:React.ReactNode,
    keyVal: string; //权限字符串 多个权限用逗号隔开 'add' || 'add,update'
    keyAll: string[]; //所有权限例如 ['add','update','delete']
}> = (props)=>{
    const { children, keyVal, keyAll } = props

    let $key = keyVal.split(',')
    let intersection = [...new Set(keyAll)].filter(x => [...new Set($key)].includes(x))
    const has = intersection.join(',') !== $key.join(',')

    return <>{ !has && children }</>
}

export default Permission