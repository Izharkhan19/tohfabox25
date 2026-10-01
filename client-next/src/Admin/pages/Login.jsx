"use client";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
// import { apiCall } from "../../services/Axiosservice";
// import { API_URL } from "../../services/Apiroute";
// import { commonService } from "../../utils/commonService";
import { loginUser } from "../../api-services/apiService";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // const handleLogin = async (e) => {
  //     e.preventDefault();
  //     setLoading(true)
  //     let resData = await apiCall(
  //         {
  //             method: "POST",
  //             url: API_URL.AUTH.LOGIN,
  //             body: {
  //                 email: email,
  //                 password: password,
  //             },
  //         },
  //         false
  //     );
  //     if (resData?.success) {
  //         localStorage.setItem('adminToken', resData?.data?.token);
  //         localStorage.setItem('user', JSON.stringify(resData?.data?.user));
  //         // commonService?.setEncryptData("adminToken", resData?.data?.token)
  //         // commonService?.setEncryptData("userInfo", JSON.stringify(resData?.data?.user))
  //         router.push("/admin/");
  //         setLoading(false)
  //     } else {
  //         alert("Invalid credentials");
  //         setLoading(false)
  //     }

  // };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await loginUser({
        email: email,
        password: password,
      });
      if (result.success) {
        localStorage.setItem("adminToken", result?.data?.data?.token);
        localStorage.setItem("token", result?.data?.data?.token); // For shared API use
        localStorage.setItem("user", JSON.stringify(result?.data?.data?.user)); // { role: 'admin', ... }
        router.push("/admin"); // Goes to Dashboard
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 px-10 py-12 rounded-2xl shadow-2xl w-96 text-white">
        <h2 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Artistary Crafts Admin</h2>

        <div className="mb-4">
          <label className="text-sm text-gray-300 mb-1 block">Email</label>
          <InputText
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-300 mb-1 block">Password</label>
          <div className="relative">
              <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full p-3 pr-12 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
              <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5 text-gray-300 hover:text-white" /> : <EyeIcon className="w-5 h-5 text-gray-300 hover:text-white" />}
              </button>
          </div>
        </div>

        <Button
          label="Login"
          icon={loading ? "pi pi-spin pi-spinner" : "pi pi-sign-in"}
          disabled={loading}
          onClick={handleLogin}
          type="submit"
          className="w-full bg-blue-600 border-none py-3 rounded-lg text-white font-semibold hover:bg-blue-700 transition shadow-md flex justify-center"
        />

        <Button
          label="Go to Client Login"
          type="button"
          outlined
          onClick={() => router.push("/login")}
          className="w-full mt-4 border border-white/40 bg-transparent text-white py-3 rounded-lg font-semibold hover:bg-white/10 transition flex justify-center"
        />

        {/* <p className="text-sm text-center mt-5 text-gray-300">
          Demo: admin@example.com / admin123
        </p> */}
      </div>
    </div>
  );
}
