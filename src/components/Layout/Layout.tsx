import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Signin from "../Auth/Signin";
import Signup from "../Auth/Signup";
import Dashboard from "../Dashboard/Dashboard";
import NoRouteFound from "../NotFound/NoRouteFound";
 
const Layout = () => {
  let token = localStorage.getItem("token");
  const navigate: any = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      navigate("/dashboard");
    }
  }, []);

  const authorised = () => {
    return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    );
  };
  const unauthorised = () => {
    return (
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={<NoRouteFound />} />
      </Routes>
    );
  };
  return token ? authorised() : unauthorised();
};

export default Layout;
