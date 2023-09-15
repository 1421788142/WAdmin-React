import { userInterface } from '@api/user/index'

/* GlobalState */
export type appConfig = {
    token: string,
    userInfo: userInterface | null;
    language: 'zh' | 'en';
}