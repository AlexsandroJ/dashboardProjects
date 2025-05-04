// components/ProtectedRoute.js
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function ProtectedRoute({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Carregando...</p>;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return children;
}