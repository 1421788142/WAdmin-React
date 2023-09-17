import { userInterface } from '@api/user/index'

/* GlobalState */
export type appConfigType = {
    token: string,
    verifyCode: string,
    userInfo: userInterface | null;
    language: 'zh' | 'en';
}