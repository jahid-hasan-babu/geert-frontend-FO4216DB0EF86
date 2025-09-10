"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X } from "lucide-react";
import { Skeleton } from "antd";
import { TranslateInitializer } from "@/lib/language-translate/LanguageSwitcher";

interface Notification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  sender: {
    username: string;
    profileImage: string;
  };
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  isLoading: boolean;
}

// Helper function to get "time ago"
function timeAgo(date: Date) {
  const now = new Date();
  const seconds = Math.floor((now?.getTime() - date?.getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const key in intervals) {
    const interval = Math.floor(seconds / intervals[key]);
    if (interval >= 1) {
      return `${interval} ${key}${interval > 1 ? "s" : ""} ago`;
    }
  }
  return "Just now";
}

export default function NotificationModal({
  isLoading,
  isOpen,
  onClose,
  notifications,
}: NotificationModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* ✅ Initialize translator */}
        <TranslateInitializer />

        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        {/* Modal Panel (top-right dropdown) */}
        <div className="fixed inset-0 flex justify-end items-start pr-5 pt-16">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-2"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-2"
          >
            <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
              {/* Loading state inside Dialog.Panel */}
              {isLoading ? (
                <Skeleton active />
              ) : (
                <>
                  {/* Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h2
                      className="text-[20px] font-semibold font-playfairDisplay"
                      data-translate
                    >
                      Notifications
                    </h2>
                    <button onClick={onClose}>
                      <X className="w-6 h-6 text-gray-600 cursor-pointer" />
                    </button>
                  </div>

                  {/* Notifications List */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div
                            className="text-xs font-semibold"
                            data-translate
                          >
                            {n.title}
                          </div>
                          <div className="text-sm" data-translate>
                            {n.body}
                          </div>
                          <div
                            className="text-gray-400 text-xs mt-1 flex justify-end"
                            data-translate
                          >
                            {timeAgo(new Date(n.createdAt))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p
                        className="text-gray-500 text-center"
                        data-translate
                      >
                        No new notifications
                      </p>
                    )}
                  </div>
                </>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
