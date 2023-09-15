const config = {
    // 公用配置导出时根据当前环境合并
    // 暂时没用 用的 .env配置文件
    // 如果公司需要发布后直接修改配置可用这套方案 此文件跟随打包文件 可直接修改
    base: {
        logo: "https://cn.vitejs.dev/logo.svg",
        projectName: "Energy Storage"
    },
    // 开发环境配置
    development: {
        api: "http://localhost:3000/dev",
    },
    // 生产环境配置
    production: {
        api: "http://localhost:3000/pro",
    }
}

// @ts-ignore
const env = import.meta.env.MODE as "development" | "production"

export default { ...config.base, ...config[env] }

