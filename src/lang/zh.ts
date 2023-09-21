import { getMessage } from './index'
const modules = import.meta.globEager<{ [props: string]: any }>('./zh_CN/**/*.ts')
export default {
  "zh_CN": {
    ...getMessage(modules, 'zh_CN'),
  },
}