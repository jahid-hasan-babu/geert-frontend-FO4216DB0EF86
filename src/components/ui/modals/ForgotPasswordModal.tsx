"use client";

import { useState } from "react";
import { X } from "lucide-react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useTranslate } from "@/hooks/useTranslate";

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ open, onClose }: ForgotPasswordModalProps) {
  const [step, setStep] = useState(1);
  const [fpEmail, setFpEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { translateBatch } = useTranslate();
  const targetLanguage = typeof window !== "undefined"
    ? localStorage.getItem("currentLanguage") || "en"
    : "en";

  const handleSendEmail = async () => {
    if (!fpEmail) {
      const msg = "Enter your email";
      translateBatch([msg], targetLanguage).then(([tMsg]) => toast.error(tMsg));
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/forgot-password`,
        { email: fpEmail }
      );
      setUserId(response.data.data.userId);

      const msg = "OTP sent to your email!";
      translateBatch([msg], targetLanguage).then(([tMsg]) => toast.success(tMsg));

      setStep(2);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const msg = err.response?.data?.message || "Failed to send OTP";
      translateBatch([msg], targetLanguage).then(([tMsg]) => toast.error(tMsg));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode) {
      const msg = "Enter OTP";
      translateBatch([msg], targetLanguage).then(([tMsg]) => toast.error(tMsg));
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-reset-password-otp`,
        { userId, otpCode: Number(otpCode) }
      );
      setAccessToken(response.data.data.accessToken);

      const msg = "OTP verified! Reset your password now.";
      translateBatch([msg], targetLanguage).then(([tMsg]) => toast.success(tMsg));

      setStep(3);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const msg = err.response?.data?.message || "OTP verification failed";
      translateBatch([msg], targetLanguage).then(([tMsg]) => toast.error(tMsg));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      const msg = "Enter new password";
      translateBatch([msg], targetLanguage).then(([tMsg]) => toast.error(tMsg));
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`,
        { newPassword },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const msg = "Password reset successfully!";
      translateBatch([msg], targetLanguage).then(([tMsg]) => toast.success(tMsg));

      onClose();
      setStep(1);
      setFpEmail("");
      setOtpCode("");
      setNewPassword("");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const msg = err.response?.data?.message || "Password reset failed";
      translateBatch([msg], targetLanguage).then(([tMsg]) => toast.error(tMsg));
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
