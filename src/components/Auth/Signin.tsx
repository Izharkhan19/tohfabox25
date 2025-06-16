import { useState } from "react";
import "./signin.css"; // Import the CSS file for styling
import { useNavigate } from "react-router-dom";
import { authSignIn } from "../APIServices/authApi";
import { ErrorToast, SuccessToast } from "../Common/toastUtils";
import { setItem } from "../Common/CommonServices";

const Signin = () => {
  const navigate = useNavigate();
  // Added onNavigateToSignup prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let input = {
        email: email,
        password: password,
      };
      const response = await authSignIn(input);
      if (response.data) {
        setItem("user", response?.data?.user);
        setItem("token", response?.data?.token);
        navigate("/dashboard");
        SuccessToast(response?.data?.message);
      }
    } catch (error: any) {
      ErrorToast(error?.response?.data?.message);
      console.error(
        "Network error during login:",
        error?.response?.data?.message
      );
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const onNavigateToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="signin-outer-container">
      <div className="signin-card">
        <h2 className="signin-heading">
          Sign-In
          <span className="logo ms-2">tohfabox25</span>
        </h2>
        <form onSubmit={handleSubmit} className="signin-form">
          <div>
            <label htmlFor="login-email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`submit-button ${
              isLoading ? "submit-button-loading" : ""
            }`}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <div className="signin-navigation-section">
          <p className="navigation-text">Don't have an account?</p>
          <button onClick={onNavigateToSignup} className="navigation-button">
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signin;
