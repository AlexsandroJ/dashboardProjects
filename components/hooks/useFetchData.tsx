// hooks/useFetchData.tsx
import { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APIBASEURL,
});

export const useFetchData = (email: string | null, password: string | null) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState({
    categories: [] as any[],
    cities: [] as any[],
    name: null as string | null,
    phone: [] as string[],
    bio: null as string | null,
    avatarUrl: null as string | null,
    location: null as string | null,
    age: null as number | null,
    userId: null as string | null,
    token: null as string | null,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!email || !password) {
        setLoading(false);
        return;
      }

      try {
        const sessionRes = await api.post("/api/sessions/login", {
          email,
          password,
        });

        const token = sessionRes.data.token;
        const userId = sessionRes.data.userId;

        const cityRes = await api.get(`/api/cities/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const categoryRes = await api.get(`/api/category/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userRes = await api.get(`/api/users/${userId}`);
        const profileRes = await api.get(`/api/profiles/${userId}`);

        setData({
          categories: categoryRes.data.categories || [],
          cities: cityRes.data.cities || [],
          name: userRes.data.name || null,
          phone: userRes.data.phone || [],
          bio: profileRes.data.bio || null,
          avatarUrl: profileRes.data.avatarUrl || null,
          location: profileRes.data.location || null,
          age: profileRes.data.age || null,
          userId: userId,
          token: token,
        });

        localStorage.setItem("token", token);
        setLoading(false);
      } catch (err: any) {
        setError(err);
        setLoading(false);
        console.error("useFetchData: Erro ao buscar dados:", err.message);
      }
    };

    fetchData();
  }, [email, password]);

  return { data, loading, error };
};