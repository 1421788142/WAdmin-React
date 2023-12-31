import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store, persistor } from "@/redux";
import { PersistGate } from "redux-persist/integration/react";
import 'virtual:svg-icons-register' //本地icon
import 'antd/dist/reset.css'
// 根文件
import App from "@/App";
// 挂载多语言
import "@/plugins/language/index";
// 挂载css
import "@/styles/tailwind.less";
import "@/styles/common.less";

ReactDOM.createRoot(document.getElementById("root")!).render(
  //让所有子组件拿到store
  <Provider store={store}>
    {/* 持久化 */}
    <PersistGate persistor={persistor}>
        {/* <React.StrictMode> */}
          <App />
        {/* </React.StrictMode> */}
    </PersistGate>
  </Provider>
);
