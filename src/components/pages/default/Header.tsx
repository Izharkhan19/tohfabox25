import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/config";
// import { auth } from "../firebase/config";
// import { setUser } from "../store/authSlice"; // If needed for dispatch

export const Header = () => {
  const user = useAppSelector((state) => state.auth.user);
  const cart = useAppSelector((state) => state.cart.cart);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    await signOut(auth);
  };
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold tracking-tight">
          E-Shop
        </Link>
        <nav className="flex space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-lg hover:text-gray-200 ${
                isActive ? "underline font-semibold" : ""
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-lg hover:text-gray-200 ${
                isActive ? "underline font-semibold" : ""
              }`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `text-lg hover:text-gray-200 ${
                isActive ? "underline font-semibold" : ""
              }`
            }
          >
            Cart ({cartItemCount})
          </NavLink>
          {user ? (
            <button
              onClick={handleLogout}
              className="text-lg hover:text-gray-200"
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Signup</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
