"use client";
import React, { useState } from "react";
import Profile01 from "./profile-01";

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuContentProps extends DropdownMenuProps {
  align?: string;
  sideOffset?: number;
  className?: string;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export const DropdownMenuTrigger = ({
  children,
  className,
}: DropdownMenuTriggerProps) => {
  return <div className={className}>{children}</div>;
};

export const DropdownMenuContent = ({
  children,
  align = "start",
  sideOffset = 0,
  className = "",
}: DropdownMenuContentProps) => {
  return (
    <div
      className={`absolute z-[10000] ${
        align === "end" ? "right-0" : "left-0"
      } ${className}`}
      style={{
        marginTop: sideOffset,
        top: "100%", // Position the dropdown below the trigger
      }}
    >
      <div className="relative p-2 bg-white  border border-zinc-200  rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};

export const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>{children}</div>
      {isOpen && (
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-[280px] sm:w-80"
        >
          <Profile01 />
        </DropdownMenuContent>
      )}
    </div>
  );
};
