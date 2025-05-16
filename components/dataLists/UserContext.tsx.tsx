// src/context/UserContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import {
  Category,
  City,
  Profile,
  User,
  UserState,
  UserContextType
} from "../../src/interfaces/interfaces"; // Importando os tipos

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APIBASEURL,
  });

  const fetchData = async () => {

    const TokenAux = localStorage.getItem("token");
    const userIdAux = localStorage.getItem("userId");

    setToken(TokenAux);
    setUserId(userIdAux);
    try {
      // Login
      /*
      const sessionRes = await api.post("/api/sessions/login", {
        email,
        password,
      });
      */
      // Busca dados
      const user = await api.get(`/api/users/${userIdAux}`, {
        headers: { Authorization: `Bearer ${TokenAux}` },
      });

      const userRes = await api.get(`/api/users/${userIdAux}`);
      const profileRes = await api.get(`/api/profiles/${userIdAux}`);

      setUser({
        name: userRes.data.name || null,
        phone: userRes.data.phone || [],
      });
      setProfile({
        bio: profileRes.data.bio || null,
        avatarUrl: profileRes.data.avatarUrl || null,
        location: profileRes.data.location || null,
        age: profileRes.data.age || null,
      });

      const cityRes = await api.get<{ cities: City[] }>(`/api/cities/${userIdAux}`, {
        headers: { Authorization: `Bearer ${TokenAux}` },
      });

      const categoryRes = await api.get<{ categories: Category[] }>(
        `/api/category/${userIdAux}`,
        {
          headers: { Authorization: `Bearer ${TokenAux}` },
        }
      );

      setCategories(categoryRes.data.categories);
      setCities(cityRes.data.cities);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <UserContext.Provider
      value={{
        categories,
        cities,
        userId,
        user,
        profile,
        token,
        loading,
        fetchData, // <-- Disponibilizando a função no contexto
      }}
    >
      {!loading && children}
    </UserContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext deve ser usado dentro de um UserProvider");
  }
  return context;
};