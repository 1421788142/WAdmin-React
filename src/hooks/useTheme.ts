import { configStoreType } from '@/redux/interface/index'

/**
 * @description 全局主题设置
 * */
const useTheme = (theme: configStoreType['theme']) => {
    const { weakOrGray, isDark } = theme
    const initTheme = () => {
        // 灰色和弱色切换
        const body = document.documentElement as HTMLElement;
        if (!weakOrGray) body.setAttribute("style", "");
        if (weakOrGray === "weak") body.setAttribute("style", "filter: invert(80%)");
        if (weakOrGray === "gray") body.setAttribute("style", "filter: grayscale(1)");
        // 暗色
        document.documentElement.classList[isDark ? "add" : "remove"]("dark");
        document.documentElement.setAttribute("data-theme", isDark ? 'dark' : '');
    };
    initTheme();

    return {
        initTheme
    };
};

export default useTheme;
