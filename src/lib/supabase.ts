import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lqscabtunylcciwfgipx.supabase.co"; // Make sure this matches your actual Supabase URL
const supabaseAnonKey =
  " eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxxc2NhYnR1bnlsY2Npd2ZnaXB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwOTA1NTgsImV4cCI6MjA2MjY2NjU1OH0.7gYBI1Ij-HtZR_YJmKtmhvZwU61F4qW-HXFsifbAa78"; // From your Supabase project settings

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
