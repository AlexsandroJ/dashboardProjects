// hooks/useFetchData.js
import { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APIBASEURL,
});

export const useFetchData = (email, password) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    categories: [],
    cities: [],
    name: null,
    phone: [],
    bio: null,
    avatarUrl: null,
    location: null,
    age: null,
    userId: null,
    token: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await api.post(`/api/sessions/login`, {
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
          userId,
          token,
        });

        localStorage.setItem("token", token);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error("Erro ao buscar dados:", err.message);
      }
    };

    fetchData();
  }, [email, password]);

  return { data, loading, error };
};