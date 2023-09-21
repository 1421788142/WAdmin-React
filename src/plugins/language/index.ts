import i18n from "i18next";
import zh_CN from "@/lang/zh";
import en_US from "@/lang/en";
import { initReactI18next } from "react-i18next";
const resources = {
    en: {
        translation: en_US.en_US
    },
    zh: {
        translation: zh_CN.zh_CN
    }
}

i18n.use(initReactI18next).init({
    resources,
    // 选择默认语言，选择内容为上述配置中的 key，即 en/zh
    fallbackLng: "zh",
    debug: false,
    interpolation: {
        escapeValue: false // not needed for react as it escapes by default
    }
});

export default i18n;