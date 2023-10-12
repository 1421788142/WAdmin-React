import Router from "@/router/index";
import { useState, useEffect, memo } from "react";
import { connect } from "react-redux";
import { HashRouter } from "react-router-dom";
import { ConfigProvider, theme, App } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import enUS from "antd/lib/locale/en_US";
import i18n from "i18next";
import { getBrowserLang } from '@/utils/index'
import AuthRouter from "@/router/utils/authRouter";
import { setLanguage } from "@/redux/modules/config/action";
import useTheme from "@/hooks/useTheme";
import type { StoreType } from '@/redux/interface/index'
import { HappyProvider } from '@ant-design/happy-work-theme';

const RouterView = memo(()=>{
    return (
      <AuthRouter>
        <Router />
      </AuthRouter>
    )
})

const Root = (props?:StoreType['configStore']) => {
  const { language, theme:sysTheme, component } = props as StoreType['configStore'];
  useEffect(()=>{
    useTheme(props as StoreType['configStore'])
  }),[component,theme]
  const [i18nLocale, setI18nLocale]  = useState(zhCN)

  // 设置 antd 语言国际化
	const setAntdLanguage = () => {
		// 如果 redux 中有默认语言就设置成 redux 的默认语言，没有默认语言就设置成浏览器默认语言
		if (language && language === "zh") {
      import('dayjs/locale/zh-cn')
      setI18nLocale(zhCN)
    } else if(language && language === "en") {
      setI18nLocale(enUS)
    }
	};

  useEffect(()=>{
		// 全局使用国际化
		i18n.changeLanguage(language || getBrowserLang());
		setLanguage(language || getBrowserLang());
		setAntdLanguage();
  },[language])

  return (
    <HashRouter>
      <ConfigProvider 
        locale={i18nLocale}
        componentSize={component.size}
        theme={{
          algorithm:sysTheme.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: sysTheme.primary,
            borderRadius: component.borderRadius,
          },
        }}>
        <HappyProvider disabled={!sysTheme.isHappy}>
            <App>
              { <RouterView /> }
            </App>
        </HappyProvider>
      </ConfigProvider>
    </HashRouter>
  );
}

const mapStateToProps = (state: StoreType) => state.configStore;
const mapDispatchToProps = { setLanguage };
export default connect(mapStateToProps, mapDispatchToProps)(Root);
