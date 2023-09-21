import { login, loginInterface, getRouter } from '@/apis/user/index'
import { message, notification } from 'antd'
import i18n from "i18next";
import { store } from '@/redux';
import { arrayToTree, arrRemoval, timeState } from '@/utils/index'

const { t } = i18n
export const Login = async (query: loginInterface): Promise<boolean> => {
    try {
        const { code, data } = await login(query)
        if (code === 200) {
            message.success(t('login.loginOk'))
            store.dispatch({
                type: 'UPDATE_USER_INFO',
                userInfo: data
            })
            let res = await afterLoginAction()
            return res
        } else {
            return false
        }
    } catch {
        return false
    }
}

const getUserRouter = async () => {
    const { token, userInfo } = store.getState().userStore
    if (!userInfo) return
    try {
        const { code, data } = await getRouter() //获取用户菜单
        if (code === 200) {
            let dataList = (data?.dataList ?? []).sort((a, b) => a.orderNum - b.orderNum)
            let menuTree = arrayToTree(dataList)
            await setMenuTree(menuTree)
            store.dispatch({
                type: 'SET_USER_ROUTER',
                routerList: menuTree
            })
            return true
        } else {
            message.error(t('sys.getMenuError'))
            return false
        }
    } catch {
        message.error(t('sys.getMenuError'))
        return false
    }
}


const afterLoginAction = async () => {
    let res = await getUserRouter()
    if (res) {
        notification.open({
            message: t('login.loginOk'),
            description: `${timeState()},${store.getState().userStore.userInfo?.userName}`,
        });
        return true
    } else {
        store.dispatch({
            type: 'UPDATE_USER_INFO',
            userInfo: null
        })
        return false
    }
}

// 取菜单下的按钮
const setMenuTree = async (menuTree: menuListType[]) => {
    // 取菜单下的权限
    let getPermission = (data: menuListType) => {
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
            }
        }
        Object.assign(item, menuItem)
        item?.children && item?.children?.length > 0 ? setMenuTree(item.children) : ''
    })
}