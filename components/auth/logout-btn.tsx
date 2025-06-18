"use client";

import { logout } from "@/lib/actions/auth";
import React from "react";

const LogoutBtn = () => {
  const handleLogout = async () => {
    await logout();
  };
  return (
    <span
      onClick={handleLogout}
      className="inline-block w-full cursor-pointer text-destructive"
    >
      logout
    </span>
  );
};

export default LogoutBtn;