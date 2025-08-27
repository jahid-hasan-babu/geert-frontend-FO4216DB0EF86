"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { toast, Toaster } from "sonner";

import login_banner from "@/assets/images/login_banner.png";
import logo from "@/assets/images/logo.png";
import ForgotPasswordModal from "@/components/ui/modals/ForgotPasswordModal";

export default function LoginPage() {
  const router = useRouter();

  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot password modal
  const [modalOpen, setModalOpen] = useState(false);

  // Login handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
        { email, password }
      );
      const { accessToken: token, ...user } = response.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (rememberMe) localStorage.setItem("rememberMe", "true");

      toast.success("Logged in successfully!");
      if (user?.role === "SUPERADMIN") router.push("/dashboard");
      else router.push("/");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-h-screen flex bg-white">
      <Toaster richColors position="top-right" />

      {/* Left Banner */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="w-full max-w-lg">
          <Image src={login_banner} alt="Login Banner" />
        </div>
      </div>

      {/* Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center justify-center space-x-3">
            <Image src={logo} alt="Logo" />
          </div>

          <div className="space-y-2">
            <h1 className="text-[28px] text-center text-black font-medium leading-[120%] font-sans">
              Welcome Back
            </h1>
            <p className="text-[#5C5C5C] text-center text-[16px] font-sans">
              Enter your email & password to login
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="text-sm text-blue-500 hover:underline focus:outline-none cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-sky-500 focus:ring-sky-500 border-gray-300 rounded"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full button-bg text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
