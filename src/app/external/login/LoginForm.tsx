"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import styles from "./Login.module.css";
import logo from "../../public/ElevateU2.png";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const user = authData?.user;
    if (!user) {
      setError("Login failed: No user returned.");
      setLoading(false);
      return;
    }

    // ✅ Check if user has completed the survey
    const { data: surveyData, error: surveyError } = await supabase
      .from("survey_responses")
      .select("id")
      .eq("user_id", user.id);

    if (surveyError) {
      setError("Error checking survey status.");
      setLoading(false);
      return;
    }

    // ✅ Redirect based on whether survey exists
    if (surveyData.length === 0) {
      router.push("/auth-check");
    } else {
      router.push("/dashboard");
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
