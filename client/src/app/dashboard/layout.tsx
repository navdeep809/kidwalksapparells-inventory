import React from "react";
import Sidebar from "../(components)/Sidebar";
import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated =
    typeof window !== "undefined" ? !!localStorage.getItem("token") : false;

  // You can't use `localStorage` directly in a server component, so instead:
  if (!isAuthenticated && typeof window !== "undefined") {
    redirect("/login"); // redirect to login if not authenticated
  }
  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex-1 h-screen overflow-y-scroll">{children}</div>
    </div>
  );
}
