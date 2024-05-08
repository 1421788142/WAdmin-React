import { login, loginInterface, getRouter, userInfo } from '@/apis/user/index'
import { REDUX_USER_ENUM } from '@/enums/redux';
import { store } from '@/redux';
import { arrayToTree, arrRemoval } from '@/utils/index'
import menus from '@/assets/js/menu';


export const Login = async (query: loginInterface): Promise<{ status:number }> => {
    try{
        const { code, data } = await login(query)
        if (code === 200) {
            store.dispatch({
                type: REDUX_USER_ENUM.SET_TOKEN,
                token: data.access_token
            })
            const { data:userDetail, code:userInfoCode } =  await userInfo()
            if(userInfoCode !== 200) return { status: code }
            store.dispatch({
                type: REDUX_USER_ENUM.UPDATE_USER_INFO,
                userInfo: userDetail
            })
            return await getUserRouter()
        }
        return { status: code }
    } catch {
        return { status: 500 }
    }

}

const getUserRouter = async ():Promise<{ status:number }> => {
    const { token, userInfo } = store.getState().userStore
    if (!userInfo || !token) return Promise.reject()
    const { code, data } = await getRouter() //获取用户菜单
    if (code === 200) {
        let dataList = (data?.dataList ?? []).sort((a, b) => a.orderNum - b.orderNum)
        if(!dataList.length) return { status: 500 }
        let menuTree = arrayToTree(dataList)
        await setMenuTree(menuTree)
        store.dispatch({
            type: REDUX_USER_ENUM.SET_USER_ROUTER,
            routerList: menuTree
        })
        return { status: code }
    } else {
        return { status: 500 }
    }
}

// 取菜单下的按钮
const setMenuTree = async (menuTree: MenuListType[]) => {
    // 取菜单下的权限
    let getPermission = (data: MenuListType) => {
        let arr: string[] = []
        data.children && data.children.forEach(item => arr.push(item.perms))
        delete data['children']
        return arrRemoval(arr)
    }
    menuTree.forEach(item => {
        let menuItem = {
            component: item.menuType === 'M' ? 'Layout' : (item.menuType === 'C' ? item.component : ''),
            name: item?.path.split('/').join(''),
            meta: {
                title: item.title,
                permission: (item?.children && item.menuType === 'C') ? getPermission(item) : [],
                hidden: item.hidden
            }
        }
        Object.assign(item, menuItem)
        item?.children && item?.children?.length > 0 ? setMenuTree(item.children) : ''
    })
}