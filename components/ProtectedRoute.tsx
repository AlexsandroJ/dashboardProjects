// components/ProtectedRoute.tsx
"use client";
import { useRouter } from 'next/navigation';
import { useAuth } from './hooks/useAuth'
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
}