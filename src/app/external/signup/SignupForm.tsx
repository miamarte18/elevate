"use client";

export const revalidate = 0;

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import styles from "./Signup.module.css";
import logo from "../../public/ElevateU2.png";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password || !username) {
      alert("Please enter both email and password.");
      return;
    }

    // ✅ Check if username is already taken BEFORE signing up
    const { data: existingUser, error: fetchError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (fetchError) {
      alert("Error checking username: " + fetchError.message);
      return;
    }

    if (existingUser) {
      alert("Username is already taken. Please choose another.");
      return;
    }

    // 🔐 Now sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    console.log("Sign up result:", data, error);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;
    if (user) {
      // Create the profile immediately since email confirmation is disabled
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        username,
        email,
      });

      if (profileError) {
        alert(profileError.message);
      } else {
        toast.success("Account created successfully! Please log in.");
        router.push("/external/login");
      }
    } else {
      alert("No user returned — something went wrong.");
    }

    setLoading(false);
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
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
