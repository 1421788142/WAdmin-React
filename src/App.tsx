import Router from "@/router/index";
import { useState, useEffect } from "react";
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
import type { configStoreType } from '@/redux/interface/index'

const Root = (props?:configStoreType) => {
  const { language, theme:sysTheme, component } = props as configStoreType;
  useEffect(()=>{
    useTheme(sysTheme)
  }),[sysTheme]
  const [i18nLocale, setI18nLocale]  = useState(zhCN)

  // 	// 设置 antd 语言国际化
	const setAntdLanguage = () => {
		// 如果 redux 中有默认语言就设置成 redux 的默认语言，没有默认语言就设置成浏览器默认语言
		if (language && language === "zh" || getBrowserLang() === "zh") return setI18nLocale(zhCN);
		if (language && language === "en" || getBrowserLang() === "en") return setI18nLocale(enUS);
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
          }
        }}>
          <App>
            <AuthRouter>
                <Router />
            </AuthRouter>
          </App>
      </ConfigProvider>
    </HashRouter>
  );
}

const mapStateToProps = (state: {
  configStore: configStoreType
}) => state.configStore;
const mapDispatchToProps = { setLanguage };
export default connect(mapStateToProps, mapDispatchToProps)(Root);
