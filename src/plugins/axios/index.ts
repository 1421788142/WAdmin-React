import VAxios from "./axios";
import { RESULT_ENUM, CONTENT_TYPE_ENUM } from "@/enums/httpEnum";
export const baseURL = import.meta.env.VITE_API_URL as string
const Http = new VAxios({
    baseURL: baseURL,
    timeout: RESULT_ENUM.TIMEOUT as number,
    headers: {
        'Content-Type': CONTENT_TYPE_ENUM.JSON
    }
})
export { Http }