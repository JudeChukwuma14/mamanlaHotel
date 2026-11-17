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

export const registerApi = (userData) => {
    return api.post(ENDPOINTS.AUTH.REGISTER, userData);
};

// 2. Verify email address with 6-digit OTP
export const verifyEmailApi = (data) => {
    return api.post(ENDPOINTS.AUTH.VERIFY_EMAIL, data);
};

// 3. Resend OTP code to the provided email
export const resendOtpApi = (data) => {
    return api.post(ENDPOINTS.AUTH.RESEND_OTP, data);
};

// 4. Sign in with email and password
export const loginApi = (credentials) => {
    return api.post(ENDPOINTS.AUTH.LOGIN, credentials);
};

// 5. Silent access token refresh (automatically includes HttpOnly cookie)
export const refreshApi = () => {
    return api.post(ENDPOINTS.AUTH.REFRESH, {});
};

// 6. Sign out of the current session
export const logoutApi = () => {
    return api.post(ENDPOINTS.AUTH.LOGOUT);
};

// 7. Sign out of all active sessions
export const logoutAllApi = () => {
    return api.post(ENDPOINTS.AUTH.LOGOUT_ALL);
};

// 8. Request a password reset OTP code
export const forgotPasswordApi = (data) => {
    return api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
};

// 9. Reset password using email, 6-digit OTP, and newPassword
export const resetPasswordApi = (data) => {
    return api.post(ENDPOINTS.AUTH.RESET_PASSWORD, data);
};

// 10. Fetch authenticated user profile
export const getMeApi = () => {
    return api.get(ENDPOINTS.AUTH.ME);
};
