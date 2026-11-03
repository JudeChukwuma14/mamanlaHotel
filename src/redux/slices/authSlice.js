import { createSlice } from "@reduxjs/toolkit"



const initialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: false,
    error: null
}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, accessToken } = action.payload
            if (user !== undefined) state.user = user
            if (accessToken) {
                state.accessToken = accessToken
                state.isAuthenticated = true
            }
            state.error = null
        },

        logout: (state) => {
            state.user = null
            state.accessToken = null
            state.isAuthenticated = false
            state.error = null
        },


        setError: (state, action) => {
            state.error = action.payload
        },
        clearError: (state) => {
            state.error = null
        }
    }
})
export const {setCredentials, logout,setError,clearError} = authSlice.actions




export default authSlice.reducer


