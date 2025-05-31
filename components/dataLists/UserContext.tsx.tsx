// src/context/UserContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

// Tipos importados
import {
  Category,
  City,
  Profile,
  User,
  UserContextType,
} from "../../src/interfaces/interfaces";

// Definição do tipo para resposta da API
interface UserDataResponse {
  name: string | null;
  phone: string[];
}

interface ProfileDataResponse {
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  age: number | null;
}

// Criação do contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APIBASEURL,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const fetchData = async () => {
    const TokenAux = localStorage.getItem("token");
    const userIdAux = localStorage.getItem("userId");

    if (!TokenAux || !userIdAux) {
      setLoading(false);
      return;
    }

    setToken(TokenAux);
    setUserId(userIdAux);

    try {
      // Requisições paralelas
      const [userRes, profileRes, cityRes, categoryRes] = await Promise.all([
        api.get(`/api/users/${userIdAux}`, {
          headers: { Authorization: `Bearer ${TokenAux}` },
        }),
        api.get(`/api/profiles/${userIdAux}`, {
          headers: { Authorization: `Bearer ${TokenAux}` },
        }),
        api.get<{ cities: City[] }>(`/api/cities/${userIdAux}`, {
          headers: { Authorization: `Bearer ${TokenAux}` },
        }),
        api.get<{ categories: Category[] }>(`/api/category/${userIdAux}`, {
          headers: { Authorization: `Bearer ${TokenAux}` },
        }),
      ]);

      // Atualiza estados
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

      setCities(cityRes.data.cities || []);
      setCategories(categoryRes.data.categories || []);

    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
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
        qrCode,
        fetchData,
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