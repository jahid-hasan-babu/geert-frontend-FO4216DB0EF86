"use client";

import { useState } from "react";
import Image from "next/image";
import Logo from "@/assets/images/logo.png";
import { FaXTwitter, FaWhatsapp, FaFacebook } from "react-icons/fa6";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton/PrimaryButton";
import { LanguageSwitcher } from "@/lib/google-translate/language-switcher";
import axios from "axios";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    if (!email) {
      setMessage("⚠️ Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/users/make-subscribe`, { email });

      setMessage("✅ You have successfully subscribed!");
      setEmail("");
    } catch {
      setMessage("❌ Subscription failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Left Column - Logo and Newsletter */}
          <div className="lg:col-span-2 space-y-8">
            <Image src={Logo} alt="Logo" />

            <LanguageSwitcher />

            {/* Newsletter Signup */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#F2F9FE1A] border border-gray-700 rounded-[50px] text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
              <PrimaryButton
                label={loading ? "Subscribing..." : "Subscribe Now"}
                onClick={handleSubscribe}
              />
            </div>

            {message && <p className="text-sm mt-2 text-gray-400">{message}</p>}
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-300">
              Company
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Feature
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Course
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-300">Legal</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Cookies Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Regulatory Info
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © VMTA - All rights reserved
          </p>

          <div className="flex space-x-4">
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <FaXTwitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <FaFacebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <FaWhatsapp className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
