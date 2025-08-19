"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PersonalInfoModal } from "./PersonalInformation";
import { PasswordModal } from "./PasswordModal";
import { LanguageModal } from "./LanguageModal";
import { logoutHandler } from "@/utils/handleLogout";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  label: string;
  onClick: () => void;
  closeOnClick?: boolean;
}

export function MenuModal({ isOpen, onClose }: ProfileMenuProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    console.log("Logging out...");
    logoutHandler(dispatch, router);
    window.dispatchEvent(new Event("logout"));
  };

  const [isProfileInfo, setIsProfileInfo] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      label: "My Learning",
      onClick: () => router.push("/learning"),
    },
    { label: "Password", onClick: () => setIsPasswordOpen(true) },
    { label: "Language", onClick: () => setIsLanguageOpen(true) },
    {
      label: "Help & Support",
      onClick: () => console.log("Help & Support clicked"),
    },
    {
      label: "Sign Out",
      onClick: handleLogout,
      closeOnClick: false,
    },
  ];

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
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
            <div className="fixed inset-0 bg-black/10" />
          </Transition.Child>

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
              <Dialog.Panel className="w-64 transform overflow-hidden rounded-xl bg-white shadow-xl transition-all">
                <Card className="shadow-none">
                  <CardContent className="p-0">
                    {/* Profile section */}
                    <div
                      className="p-4 space-y-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => setIsProfileInfo(true)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src="/placeholder.svg?height=48&width=48"
                            alt="Jonathon Dickson"
                          />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            Jonathon Dickson
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            jonathondick@gmail.com
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Menu items */}
                    <div className="py-2">
                      {menuItems.map((item, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="w-full justify-start px-4 py-3 text-sm font-normal text-foreground hover:bg-muted"
                          onClick={() => {
                            item.onClick();
                            if (item.closeOnClick !== false) {
                              onClose();
                            }
                          }}
                        >
                          {item.label}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Sub-modals */}
      <PersonalInfoModal
        isOpen={isProfileInfo}
        onClose={() => setIsProfileInfo(false)}
      />
      <PasswordModal
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
      />
      <LanguageModal
        isOpen={isLanguageOpen}
        onClose={() => setIsLanguageOpen(false)}
      />
    </>
  );
}
