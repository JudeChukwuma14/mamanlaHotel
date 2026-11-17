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
    },
    BOOKING: {
        CREATE: '/api/v1/bookings',
        MY_BOOKINGS: '/api/v1/bookings/my-bookings',
        BY_REFERENCE: (ref) => `/api/v1/bookings/${ref}`,
        CANCEL: (ref) => `/api/v1/bookings/${ref}/cancel`,
    },
    ROOMS: {
        GET_ALL: '/api/v1/rooms',
        GET_BY_SLUG: (slug) => `/api/v1/rooms/${slug}`,
    }
}


// ─── Auth API ─────────────────────────────────────────────────────────────────

export const registerApi = (userData) => {
    return api.post(ENDPOINTS.AUTH.REGISTER, userData)
}

export const verifyEmailApi = (data) => {
    return api.post(ENDPOINTS.AUTH.VERIFY_EMAIL, data)
}

export const resendOtpApi = (data) => {
    return api.post(ENDPOINTS.AUTH.RESEND_OTP, data)
}

export const loginApi = (credentials) => {
    return api.post(ENDPOINTS.AUTH.LOGIN, credentials)
}

export const forgotPasswordApi = (data) => {
    return api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, data)
}

export const resetPasswordApi = (data) => {
    return api.post(ENDPOINTS.AUTH.RESET_PASSWORD, data)
}

export const logoutApi = () => {
    return api.post(ENDPOINTS.AUTH.LOGOUT)
}

export const logoutAllApi = () => {
    return api.post(ENDPOINTS.AUTH.LOGOUT_ALL)
}

export const getMeApi = () => {
    return api.get(ENDPOINTS.AUTH.ME)
}


// ─── Booking API ──────────────────────────────────────────────────────────────

export const createBookingApi = (bookingData) => {
    return api.post(ENDPOINTS.BOOKING.CREATE, bookingData)
}

export const fetchMyBookingsApi = (params = {}) => {
    return api.get(ENDPOINTS.BOOKING.MY_BOOKINGS, { params })
}

export const fetchBookingByReferenceApi = (ref) => {
    return api.get(ENDPOINTS.BOOKING.BY_REFERENCE(ref))
}

export const cancelBookingApi = (ref, reason) => {
    return api.post(ENDPOINTS.BOOKING.CANCEL(ref), { reason })
}


// ─── Rooms API ────────────────────────────────────────────────────────────────

export const fetchRoomsApi = () => {
    return api.get(ENDPOINTS.ROOMS.GET_ALL)
}

export const fetchRoomBySlugApi = (slug) => {
    return api.get(ENDPOINTS.ROOMS.GET_BY_SLUG(slug))
}
