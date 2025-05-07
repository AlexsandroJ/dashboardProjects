// components/ProtectedLayout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

async function isAuthenticated() {
  const token = cookies().get("token")?.value;
  
  if (!token) return false;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APIBASEURL}/api/sessions/check-token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Resposta da API:", res.status); // Debug
    return res.ok;
  } catch (error) {
    return false;
  }
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await isAuthenticated();

  if (!auth) {
    redirect("/auth");
  }

  return <>{children}</>;
}