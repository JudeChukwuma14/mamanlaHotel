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


export const verifyEmailApi = (data)=>{
    return api.post(ENDPOINTS.AUTH.VERIFY_EMAIL, data)
}

export const resendOtpApi = (data)=>{
    return api.post(ENDPOINTS.AUTH.RESEND_OTP, data)
}


export const loginApi = (credentials)=>{
    return api.post(ENDPOINTS.AUTH.LOGIN, credentials)
}

export const forgotPasswordApi = (data)=>{
    return api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, data) 
}

export const resetPasswordApi = (data)=>{
    return api.post(ENDPOINTS.AUTH.RESET_PASSWORD, data)  
}