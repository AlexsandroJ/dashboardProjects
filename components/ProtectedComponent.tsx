"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APIBASEURL,
});

export default function ProtectedComponent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        router.push("/auth");
        return;
      }

      try {
        const res = await api.post(
          "/api/sessions/check-token",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push("/auth");
        }
      } catch (error) {
        console.error("Erro ao validar token:", error);
        setIsAuthenticated(false);
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return null; // ou uma mensagem de erro, se quiser
  }

  return <>{children}</>;
}