"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import {
  HomeIcon,
  CogIcon,
  RefreshCwIcon,
  LogOutIcon,
  MenuIcon, // hamburger icon
  XIcon, // close icon
} from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import styles from "./Navbar.module.css";

export default function DashboardNavbar() {
  const supabase = createClientComponentClient();
  const { session, isLoading } = useSessionContext();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); // sidebar toggle

  useEffect(() => {
    if (!isLoading && session?.user) {
      const fetchUsername = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", session.user.id)
          .maybeSingle();

        if (data) {
          setUsername(data.username);
        } else {
          console.error("Failed to fetch username:", error?.message);
        }
      };

      fetchUsername();
      setUser(session.user);
    }
  }, [session, isLoading]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/external/login");
  };

  if (!session?.user) return null;

  const navItems = [
    {
      label: "Home",
      className: styles.navItem,
      icon: <HomeIcon size={20} color="white" />,
      href: "/dashboard",
    },
    {
      label: "Settings",
      className: styles.navItem,
      icon: <CogIcon size={20} />,
      href: "/dashboard/settings",
    },
    {
      label: "Regenerate",

      icon: <RefreshCwIcon size={20} />,
      onClick: () => {
        console.log("Regenerate clicked");
      },
    },
    {
      label: "Log Out",
      icon: <LogOutIcon size={20} />,
      onClick: handleLogout,
    },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        className={styles.hamburger2}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        {isOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
      </button>

      {/* Optional: overlay for mobile */}
      {isOpen && (
        <div
          className={`${styles.overlay} ${styles.overlayVisible}`}
          onClick={() => setIsOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
        onClick={() => {
          if (window.innerWidth < 768) setIsOpen(false);
        }} // auto-close on nav click
      >
        {/* Profile Section */}
        <div className={styles.profileSection}>
          <div className={styles.profileInfo}>
            <div className={styles.profileAvatar}>
              {username?.slice(0, 2).toUpperCase() || "US"}
            </div>
            <div className={styles.profileText}>
              <p className={styles.username}>{username ?? "User"}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {navItems.map(({ label, icon, href, onClick }) => {
            if (href) {
              return (
                <Link key={label} href={href} className={styles.navItem}>
                  {icon}
                  <span style={{ marginLeft: "0.75rem" }}>{label}</span>
                </Link>
              );
            } else {
              return (
                <button
                  key={label}
                  onClick={onClick}
                  className={styles.logoutButton}
                >
                  {icon}
                  <span style={{ marginLeft: "0.75rem" }}>{label}</span>
                </button>
              );
            }
          })}
        </nav>
      </aside>
    </>
  );
}
