// signup-test.js
import React from "react";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://lqscabtunylcciwfgipx.supabase.co", // your Supabase URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxxc2NhYnR1bnlsY2Npd2ZnaXB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwOTA1NTgsImV4cCI6MjA2MjY2NjU1OH0.7gYBI1Ij-HtZR_YJmKtmhvZwU61F4qW-HXFsifbAa78" // From your Supabase project settings"
);

async function testSignup() {
  const { data, error } = await supabase.auth.signUp({
    email: "testuser@example.com",
    password: "test12345",
  });

  console.log("DATA:", data);
  console.log("ERROR:", error);
}

testSignup();
