import { useSelector } from "react-redux"
import { selectIsAdmin, selectIsAuthenticated } from "../redux/slices/authSlice"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useEffect, useRef } from "react"
import toast from "react-hot-toast"



export const  ProtectedRoute = () => {

    const isAuthenticated = useSelector(selectIsAuthenticated)
    const location = useLocation()
    const alerted = useRef()



    useEffect(()=>{
        if(!isAuthenticated && !alerted.current){
            alerted.current = true
            toast.error("Please sign into access this page")
        }
    },[isAuthenticated])
    
    return isAuthenticated ? <Outlet/> : <Navigate to="/login" state={{from: location}} replace />
}


export const PublicOnlyRoute =()=>{
   
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const isAdmin = useSelector(selectIsAdmin)

    if(!isAuthenticated) return <Outlet/>
    return <Navigate to={isAdmin ? "/dashboard": "/"} replace/>
}


export const AdminRoute =()=>{
      const isAuthenticated = useSelector(selectIsAuthenticated)
    const isAdmin = useSelector(selectIsAdmin)

    if(!isAuthenticated)  return <Navigate to="/login" replace />;
    if(!isAdmin){
        toast.error("Access denied. Admin  privileges required")
         return <Navigate to="/" replace />;
    }

    return <Outlet/>
}