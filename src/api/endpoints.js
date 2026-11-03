import api from "./axiosInstance"

export const ENDPOINTS = {
    AUTH: {
        REGISTER: "/auth/register",
        VERIFY_EMAIL: '/auth/verify-email',
        RESEND_OTP: '/auth/resend-otp',
        LOGIN: '/auth/login',
        REFRESH: '/auth/refresh',
        LOGOUT: "/auth/logout",
        LOGOUT_ALL: "/auth/logout-all",
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: "/auth/reset-password",
        ME: "/auth/me"
    }
}


export const registerApi = (userData)=>{
    return api.post(ENDPOINTS.AUTH.REGISTER, userData)
}

