"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav
      className={styles.navbar}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className={styles.navbarContainer}>
        <Link href="/" className={styles.logo} aria-label="Homepage">
          {/* <Image src={Logo} alt="ElevateU logo" width={32} height={32} /> */}
          <span className={styles.logo}>ElevateU</span>
        </Link>

        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>

        <div className={`${styles.menu} ${isOpen ? styles.menuOpen : ""}`}>
          <Link
            href="/external/about"
            className={styles.link}
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            href="/external/login"
            className={styles.link}
            onClick={() => setIsOpen(false)}
          >
            Log In
          </Link>
          <Link href="/external/signup" onClick={() => setIsOpen(false)}>
            <button className={styles.signupButton}>Sign Up</button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
