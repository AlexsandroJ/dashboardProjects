// components/hooks/useAuth.ts
"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APIBASEURL,
  });
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      console.log("Token: ",token)
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        router.push('/auth');
        return;
      }

      try {
        const res = await api.post('/api/sessions/check-token', {}, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          setIsAuthenticated(true);
        } else {
          console.log('Error');
          throw new Error();
        }
      } catch (error) {
        setIsAuthenticated(false);
        console.log('Error', error);
        router.push('/auth');

      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { isAuthenticated, loading };
};