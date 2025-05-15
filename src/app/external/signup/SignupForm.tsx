"use client";
export const dynamic = "force-static";
export const revalidate = 0;

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "lib/supabase";

import styles from "./Signup.module.css";
import logo from "../../public/ElevateU2.png";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }
    const user = data.user;

    if (user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: user.id, // assuming 'id' is the primary key in your profile table and matches auth user ID
          username: username,
        },
      ]);

      if (profileError) {
        alert("Error creating profile: " + profileError.message);
        return;
      }
    }
    // ✅ After sign-up, Supabase will auto-login (if email verification is OFF)
    router.push("/external/survey");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <img src={logo.src} alt="Logo" className={styles.logo} />
        </div>
        <h1 className={styles.title}>Create an account</h1>
        <p className={styles.subtitle}>
          Or{" "}
          <a href="/login" className={styles.link}>
            log in to your account
          </a>
        </p>

        <form onSubmit={handleSignup} className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
