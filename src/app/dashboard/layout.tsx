// src/app/dashboard/layout.tsx
import DashboardNavbar from "@/components/DashboardNavbar"; // your internal navbar
import "@/app/globals.css";
import ClientAuthWrapper from "@/components/ClientAuthWrapper";

export const metadata = {
  title: "Dashboard",
  description: "User dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardNavbar />
      <main className="ml-64 flex-1 p-6">{children}</main>
    </div>
  );
}
