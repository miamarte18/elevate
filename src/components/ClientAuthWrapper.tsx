// src/components/ClientAuthWrapper.tsx
"use client";

import { useAuthSurveyCheck } from "@/app/dashboard/hooks/useAuthSurveyCheck";

export default function ClientAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthSurveyCheck();
  return <>{children}</>;
}
