"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./Login.module.css";
import logo from "../../public/ElevateU2.png";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import toast from "react-hot-toast";
export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // const [rememberMe, setRememberMe] = useState(false);

  // useEffect(() => {
  //   const rememberedEmail = localStorage.getItem("rememberedEmail");
  //   if (rememberedEmail) {
  //     setEmail(rememberedEmail);
  //     setRememberMe(true);
  //   }
  // }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting login with email:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error("Login error:", error);
        setError(error.message);
        toast.error("Login failed: " + error.message);
      } else {
        console.log("Login successful:", data);
        toast.success("Logged in successfully!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error("Unexpected error during login:", err);
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    }

    setLoading(false);
  };
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <img src={logo.src} alt="Logo" className={styles.logo} />
        </div>
        <h2 className={styles.title}>Log in to your account</h2>
        <p className={styles.subtitle}>
          Or{" "}
          <a href="/external/signup" className={styles.link}>
            create a new account
          </a>
        </p>

        <div>
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email address"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/*           
          <div className={styles.rememberMeWrapper}>
            <label className={styles.rememberMeLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label> 
          </div> */}

          <div className={styles.buttonGroup}>
            <button
              onClick={handleLogin}
              disabled={loading}
              className={styles.button}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
