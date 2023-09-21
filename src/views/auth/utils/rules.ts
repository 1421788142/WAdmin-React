import { store } from '@/redux/index'
import type { Rule } from "antd/es/form";

// 6位数字验证码正则
export const exp_phone_code = /^\d{6}$/;

// 密码正则（密码格式应为8-18位数字、字母、符号的任意两种组合）
export const exp_pwd = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/;

// 6位数字验证码正则
export const exp_phone = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;

// 登录校验
export const loginRules: Record<string, Rule[]> = {
    password: [
        {
            validator: (rule: Rule, value: string, callback: Function) => {
                if (!value) {
                    callback(new Error('请输入密码'));
                } else if (!exp_pwd.test(value)) {
                    callback(new Error('密码格式应为8-18位数字、字母、符号的任意两种组合'));
                } else {
                    return Promise.resolve();
                }
            },
            validateTrigger: ["blur", 'change']
        }
    ],
    code: [
        {
            validator: (rule: Rule, value: string, callback: Function) => {
                const { userStore } = store.getState()
                if (!value) {
                    callback(new Error('请输入验证码'));
                } else if (userStore.verifyCode !== value) {
                    callback(new Error('请输入正确的验证码'));
                } else {
                    return Promise.resolve();
                }
            },
            validateTrigger: "blur"
        }
    ]
}

// 手机登录校验
export const phoneRules: Record<string, Rule[]> = {
    phone: [
        {
            validator: (rule: Rule, value: string, callback: Function) => {
                if (!value) {
                    callback(new Error('请输入手机号'));
                } else if (!exp_phone.test(value)) {
                    callback(new Error('请输入正确的手机号码格式'));
                } else {
                    return Promise.resolve();
                }
            },
            validateTrigger: "blur"
        }
    ],
    code: [
        {
            validator: (rule: Rule, value: string, callback: Function) => {
                const { userStore } = store.getState()
                if (!value) {
                    callback(new Error('请输入验证码'));
                } else if (userStore.verifyCode !== value) {
                    callback(new Error('请输入正确的验证码'));
                } else {
                    return Promise.resolve();
                }
            },
            validateTrigger: "blur"
        }
    ]
}

// 注册校验
export const registerRules: Record<string, Rule[]> = {
    phone: [
        {
            validator: (rule: Rule, value: string, callback: Function) => {
                if (!value) {
                    callback(new Error('请输入手机号'));
                } else if (!exp_phone.test(value)) {
                    callback(new Error('请输入正确的手机号码格式'));
                } else {
                    return Promise.resolve();
                }
            },
            validateTrigger: "blur"
        }
    ],
    password: [
        {
            validator: (rule: Rule, value: string, callback: Function) => {
                if (!value) {
                    callback(new Error('请输入密码'));
                } else if (!exp_pwd.test(value)) {
                    callback(new Error('密码格式应为8-18位数字、字母、符号的任意两种组合'));
                } else {
                    return Promise.resolve();
                }
            },
            validateTrigger: ["blur", 'change']
        }
    ],
    code: [
        {
            validator: (rule: Rule, value: string, callback: Function) => {
                const { userStore } = store.getState()
                if (!value) {
                    callback(new Error('请输入验证码'));
                } else if (userStore.verifyCode !== value) {
                    callback(new Error('请输入正确的验证码'));
                } else {
                    return Promise.resolve();
                }
            },
            validateTrigger: "blur"
        }
    ]
}

export const updateRules: Record<string, Rule[]> = {
    ...registerRules
}