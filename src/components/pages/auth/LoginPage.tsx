/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import login_banner from "@/assets/images/login_banner.png";
import logo from "@/assets/images/logo.png";
import ForgotPasswordModal from "@/components/ui/modals/ForgotPasswordModal";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { LanguageSwitcher } from "@/lib/google-translate/language-switcher";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const responseData = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      dispatch(
        setUser({
          user: responseData?.data,
          access_token: responseData?.data?.accessToken,
        })
      );

      const { accessToken: token, ...user } = responseData.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Logged in successfully!");

      if (user?.role === "SUPERADMIN") {
        router.push("/dashboard?reload=true");
      } else {
        router.push("/?reload=true");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="container min-h-screen flex bg-white">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="w-full max-w-lg">
          <Image
            src={login_banner}
            alt="Login Banner"
            width={400}
            height={400}
            className="w-full h-auto"
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center justify-center space-x-3">
            <Image src={logo} alt="Logo" width={120} height={60} />
          </div>

          <div className="space-y-2">
            <h1 className="text-[28px] text-center text-black font-medium leading-[120%] font-sans">
              Welcome Back
            </h1>
            <p className="text-[#5C5C5C] text-center text-[16px] font-sans">
              Enter your email & password to login
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                {...register("email")}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${
                  errors.email ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
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
                  {...register("password")}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 pr-12 ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  }`}
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
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}

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
            <button
              type="submit"
              disabled={isLoading}
              className="w-full button-bg text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>
          <div className="flex justify-end">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
