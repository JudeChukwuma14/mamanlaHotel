import React, { lazy, useEffect, useState, Suspense } from "react";
import Header from "./components/static/Header";
import Footer from "./components/static/Footer";
import { BrowserRouter, Route, Routes, Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import SplashScreen from "./components/SplashScreen";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute, PublicOnlyRoute } from "./auth/AuthGuards";
import AdminSiderbar from "./components/static/AdminSiderbar";
import AdminHeader from "./components/static/AdminHeader";
import Dashboard from "./admin/Dashboard";
import AdminBooking from "./admin/AdminBooking";
import AdminRoom from "./admin/AdminRoom";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Services = lazy(() => import("./pages/Services"));
const Booking = lazy(() => import("./pages/Booking"));
const BookingConfirmation = lazy(
  () => import("./pages/BookingConfirmationPage"),
);
const MyBookings = lazy(() => import("./pages/MyBookingsPage"));
const Login = lazy(() => import("./auth/Login"));
const Register = lazy(() => import("./auth/Register"));
const ForgotPassword = lazy(() => import("./auth/ForgotPassword"));
const Otp = lazy(() => import("./auth/Otp"));
const ResetPassword = lazy(() => import("./auth/ResetPassword"));
const RoomDetails = lazy(() => import("./components/Roomdetails"));
const Rooms = lazy(() => import("./pages/Rooms"));

const Mainlayout = ({ children }) => (
  <div className=" flex flex-col min-h-screen">
    <Header />
    <main className="grow">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[50vh]"></div>
        }
      >
        {children || <Outlet />}
      </Suspense>
    </main>
    <Footer />
  </div>
);

const AuthLayout = ({ children }) => (
  <div className=" flex flex-col min-h-screen">
    <main className="grow">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[50vh]"></div>
        }
      >
        {children || <Outlet />}
      </Suspense>
    </main>
  </div>
);

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
const location = useLocation()
  useEffect(()=>{
    setSidebarOpen(false)
  },[location.pathname])
return(
  
  <div className=" min-h-screen flex flex-col">
    <AdminSiderbar isOpen={sidebarOpen} onClose={()=>setSidebarOpen(false)} />

    <div className=" lg:pl-72 flex flex-col min-h-screen min-w-0 transition-all duration-300">
      <AdminHeader onOpenSidebar={()=> setSidebarOpen(true)}  />

      <main className=" flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[50vh]"></div>
          }
        >
          {children || <Outlet />}
        </Suspense>
      </main>
    </div>
  </div>
)
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-center" reverseOrder={false} />
      {loading ? (
        <SplashScreen />
      ) : (
        <Routes>
          {/* Public pages with Main layout */}
          <Route element={<Mainlayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:slug" element={<RoomDetails />} />
          </Route>

          {/* Protected Guest & Booking pages */}
          <Route element={<Mainlayout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/booking" element={<Booking />} />
              <Route
                path="/booking/confirmation/:bookingReference"
                element={<BookingConfirmation />}
              />
              <Route path="/my-bookings" element={<MyBookings />} />
            </Route>
          </Route>

          {/* Auth pages */}
          <Route element={<AuthLayout />}>
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/otp" element={<Otp />} />
            <Route path="/verify-otp" element={<Otp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
          </Route>


          {/* Admin */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/bookings" element={<AdminBooking />} />
            <Route path="/admin/rooms" element={<AdminRoom />} />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;
