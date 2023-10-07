import { store } from "@/redux";
import AntdIcon from '@/components/antdIcon';
import HasTooltip from '@/layout/components/menu/hasTooltip';
import config from '../../../public/config'

/**
 * @description 查询出打开菜单
 * @param {string} fullPath //当前的菜单
 * */
export function openKey(fullPath: string) {
    let menuList = findFn(
        () => fullPath,
        (val: any) => val.path,
        (val: any) => val.path,
    ) as string[]
    return menuList
}


/**
 * @description 根据不通需求筛选出对应菜单
 * @param {Function} key 最终返回字符串的key
 * @param {Function} filterKey  最终返回字符串的需要过滤的key
 * @param {Function} returnKey 最终返回字符串的过滤出的key
 * */
export function findFn<T>(key: Function, filterKey: Function, returnKey: Function) {
    let stack: T[] = [];
    let going: boolean = true;
    let filter = (menuItem: menuListType[], keys: Function) => {
        menuItem.forEach(item => {
            if (!going) return;
            stack.push(returnKey(item));
            if (filterKey(item) == keys(item)) {
                going = false;
            } else if (item['children']) {
                filter(item['children'], keys);
            } else {
                stack.pop();
            }
        });
        if (going) stack.pop();
    }
    const { userRouterList } = store.getState().userStore
    filter(userRouterList, key);
    return stack;
}

/**
 * @param iconName (aa-bb-cc)
 * @return iconNameCase (AaBbCc)
 */
export const iconNameCase = (iconName: string) => {
    let iconNameList = iconName.split('-').map((item: string) => item.charAt(0).toUpperCase() + item.slice(1))
    return iconNameList.join('')
}

export const getFirstMenu = (userRouterList: menuListType[]) => {
    return userRouterList.map(menu=>{
        return {
            path:menu.path,
            title: <HasTooltip hasTip={true} title={menu.title} />,
            component:menu.component,
            id:menu.id,
            icon:<AntdIcon component={iconNameCase(menu.icon) as any}/>
        }
    })
}

/**
 * @description 查询出面包屑
 * @param {string} fullPath //当前的菜单
 * @param {boolean} hasLoad //重载查询出来的数据
 * @param {function} callback //重载查询出来的数据
 * */
export const setBreadCrumbs = (fullPath: string, hasLoad = false, callback:Function = (menu:menuListType)=> null): menuListType[] => {
    let breadList = findFn<menuListType>(
        () => (fullPath === '/' ? config.homePath : fullPath),
        (val: menuListType) => val.path,
        (val: menuListType) => {
            if(!hasLoad) return val
            return {
                title:(<span className="cursor-pointer">
                    <AntdIcon component={iconNameCase(val.icon) as any}/>
                    <span>{ val.title }</span>
                </span>),
                menu:val.children ? {
                    items:val.children.map(x=>{
                        return {
                            title:(<div>
                                <AntdIcon component={iconNameCase(x.icon) as any}/>
                                <span className="ml-1">{ x.title }</span>
                            </div>),
                            href:x.path,
                            onClick:()=>callback(x)
                        }
                    })
                } : null
            }
        },
    )
    return !hasLoad ? breadList : [
        {
            title:(<span className="cursor-pointer" onClick={()=>callback({
                path:config.homePath,
                component:config.homePath,
                children:[]
            })}>
                <AntdIcon component={iconNameCase('home-filled') as any}/>
                <span>首页</span>
            </span>),
        } as any,
        ...breadList
    ]
}