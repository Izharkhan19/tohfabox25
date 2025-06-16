import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorToast, SuccessToast } from "../Common/toastUtils";
import { authSignUp } from "../APIServices/authApi";
import "./signin.css";

const Signup = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let input = {
        userName: userName,
        email: email,
        password: password,
        role: role,
      };
      const response = await authSignUp(input);
      if (response.data) {
        navigate("/signin");
        SuccessToast(response?.data?.message);
      }
    } catch (error: any) {
      ErrorToast(error?.response?.data?.message);
      console.error("Network error during signup:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };
  const onNavigateToSignin = () => {
    navigate("/signin");
  };
  return (
    <div className="signin-outer-container">
      <div className="signin-card">
        <h2 className="signin-heading">Join Us!</h2>
        <form onSubmit={handleSubmit} className="signin-form">
          <div>
            <label htmlFor="UserName" className="form-label">
              User Name
            </label>
            <input
              type="text"
              id="UserName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="form-input"
              placeholder="User Name"
            />
          </div>
          <div>
            <label htmlFor="signup-email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label htmlFor="signup-password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label htmlFor="signup-role" className="form-label">
              Role
            </label>
            <select
              id="signup-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-input"
            >
              <option value="client">Client</option>
              <option value="admin">
                Admin
                {/* (email must end with @admin.com) */}
              </option>
            </select>
            {/* <p className="text-xs text-gray-500 mt-1">
              Note: Admin role assignment in backend is conditional on email
              ending with "@admin.com".
            </p> */}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`submit-button ${
              isLoading ? "submit-button-loading" : ""
            }`}
          >
            {isLoading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <div className="signin-navigation-section">
          <p className="navigation-text">Already have an account?</p>
          <button onClick={onNavigateToSignin} className="navigation-button">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
