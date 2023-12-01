import { StoreType, configStoreType } from "@/redux/interface"
import { useMemo } from "react"
import { connect } from "react-redux"

const Wrapper:React.FC<{
    children:React.ReactElement,
} & {
    collapsed:configStoreType['collapsed'],
    sidebarWidth:configStoreType['component']['sidebarWidth'],
    menuFlipColor:configStoreType['theme']['menuFlipColor'],
    isDark:configStoreType['theme']['isDark'],
}> = (props)=>{
    const {
        collapsed,
        sidebarWidth,
        menuFlipColor,
        isDark
    } = props
    const wrapStyle = useMemo<React.CSSProperties>(()=>{
        return {
            width: `${collapsed ? 70 : sidebarWidth}px`,
            backgroundColor:(menuFlipColor && !isDark) ? '#001529' : isDark ? '#141414' : '#fff',
            transition:'all .2s'
        }
    },[ props ])

    const wrapClass = useMemo(()=>{
        return [
            'flex flex-col border-0 border-r-[1px] border-[#e8e8e8] dark:border-[#424242] border-solid',
            ( menuFlipColor ? '!border-[#424242]' : ''),
        ].join(' ')
    },[menuFlipColor])

    return <>
        <div style={wrapStyle} className={ wrapClass }>
            { props.children }
        </div>
    </>
}
const mapStateToProps = (state: StoreType) => ({
    collapsed:state.configStore.collapsed,
    sidebarWidth:state.configStore.component.sidebarWidth,
    isDark:state.configStore.theme.isDark,
    menuFlipColor:state.configStore.theme.menuFlipColor,
});
export default connect(mapStateToProps)(Wrapper);