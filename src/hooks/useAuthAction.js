import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logoutApi, logoutAllApi } from "../api/endpoints";
import { logout } from "../redux/slices/authSlice";

/**
 * useAuthActions
 * A shared hook for performing authenticated actions (logout, logout-all, etc.).
 * Import this anywhere you need a Logout button.
 */
export function useAuthActions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /** Sign out of the current session */
  async function handleLogout() {
    try {
      // Backend clears the HttpOnly refresh-token cookie
      await logoutApi();
    } catch {
      // Even if the server call fails, clear the client state
    } finally {
      dispatch(logout()); // Clears Redux state + persisted localStorage
      toast.success("Signed out successfully.");
      navigate("/login", { replace: true });
    }
  }

  /** Sign out of ALL sessions (revokes all refresh tokens on the backend) */
  async function handleLogoutAll() {
    try {
      await logoutAllApi();
    } catch {
      // Fall through
    } finally {
      dispatch(logout());
      toast.success("All sessions signed out.");
      navigate("/login", { replace: true });
    }
  }

  return { handleLogout, handleLogoutAll };
}
