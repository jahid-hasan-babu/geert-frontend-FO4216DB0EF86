"use client";

import { useState } from "react";
import { X } from "lucide-react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  open,
  onClose,
}: ForgotPasswordModalProps) {
  const [step, setStep] = useState(1);
  const [fpEmail, setFpEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!fpEmail) return toast.error("Enter your email");
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/forgot-password`,
        { email: fpEmail }
      );
      setUserId(response.data.data.userId);

      toast.success(<span data-translate>OTP sent to your email!</span>);

      setStep(2);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode) return toast.error("Enter OTP");

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-reset-password-otp`,
        { userId, otpCode: Number(otpCode) }
      );
      setAccessToken(response.data.data.accessToken);

      toast.success(<span data-translate>OTP verified! Reset your password now.</span>);

      setStep(3);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) return toast.error("Enter new password");

    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`,
        { newPassword },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      toast.success(<span data-translate>Password reset successfully!</span>);

      onClose();
      setStep(1);
      setFpEmail("");
      setOtpCode("");
      setNewPassword("");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          className="absolute top-3 right-3 cursor-pointer"
          onClick={() => {
            onClose();
            setStep(1);
          }}
        >
          <X />
        </button>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Forgot Password</h2>
            <p>Enter your email to receive OTP code</p>
            <input
              type="email"
              placeholder="Email"
              value={fpEmail}
              onChange={(e) => setFpEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <button
              onClick={handleSendEmail}
              disabled={loading}
              className="w-full bg-[#3399CC] text-white py-2 rounded-lg cursor-pointer"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Verify OTP</h2>
            <p>Enter the OTP sent to your email</p>
            <input
              type="number"
              placeholder="OTP"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full button-bg text-white py-2 rounded-lg"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Reset Password</h2>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full button-bg text-white py-2 rounded-lg cursor-pointer"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
