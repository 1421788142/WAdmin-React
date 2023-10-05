import { configStoreType } from '@/redux/interface/index'
import { transLessVar } from '@/utils/transLessVar'

/**
 * @description 全局主题设置
 * */
const useTheme = (config: configStoreType) => {
    const { theme } = config
    const initTheme = () => {
        // 灰色和弱色切换
        const body = document.documentElement as HTMLElement;
        // 暗色
        document.documentElement.classList[theme.isDark ? "add" : "remove"]("dark");
        document.documentElement.setAttribute("data-theme", theme.isDark ? 'dark' : '');

        let lessVar = transLessVar(config)
        body.setAttribute("style", lessVar);
    };
    initTheme();

    return {
        initTheme
    };
};

export default useTheme;
