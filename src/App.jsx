import React, { lazy, useEffect, useState, Suspense } from "react";
import Header from "./components/static/Header";
import Footer from "./components/static/Footer";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import SplashScreen from "./components/SplashScreen";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute, PublicOnlyRoute } from "./auth/AuthGuards";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Services = lazy(() => import("./pages/Services"));
const Booking = lazy(() => import("./pages/Booking"));
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

// const AdminLayout = ({children}) => (

// );
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
          <Route element={<Mainlayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
       <Route path="/rooms" element={<Rooms />} />     
            <Route path="/rooms/:slug" element={<RoomDetails />} />
          </Route>

          <Route element={<Mainlayout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/booking" element={<Booking />} />
            </Route>
          </Route>

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
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;
