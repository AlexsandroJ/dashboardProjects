"use client";
import { useEffect, useState } from 'react';
import axios from "axios";

export default function AuthTest() {
  const [authStatus, setAuthStatus] = useState<string | null>(null); // Estado para armazenar o status da autenticação
  const [userId, setUserId] = useState();
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null); // Novo campo: Bio
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // Novo campo: Avatar URL
  const [location, setLocation] = useState<string | null>(null); // Novo campo: Localização
  const [age, setAge] = useState(); // Novo campo: Idade

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APIBASEURL, // URL do backend
  });

  useEffect(() => {
    // Função para verificar a autenticação

    const checkAuthentication = async () => {
      try {
        // Recupera o token do localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          setAuthStatus('Token não encontrado. Faça login novamente.');
          return;
        }

        // Faz a chamada à API para verificar o token
        const response = await fetch(`${process.env.NEXT_PUBLIC_APIBASEURL}/api/sessions/check-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Envia o token no cabeçalho Authorization
          },
        });

        if (response.ok) {
          const data = await response.json();

          const user = await api.get(`/api/users/${data.userId}`);
          const perfil = await api.get(`/api/profiles/${data.userId}`);
          setUserId(user.data.userId);
          setName(user.data.name);
          setBio(perfil.data.bio);
          setAvatarUrl(perfil.data.avatarUrl);
          setAge(perfil.data.age);
          setLocation(perfil.data.location);

          setAuthStatus(`Autenticado`);

        } else {
          setAuthStatus('Não autenticado. Token inválido ou expirado.');
        }
      } catch (error) {
        setAuthStatus('Erro ao verificar autenticação.');
      }
    };

    checkAuthentication();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Teste de Autenticação</h1>
      {authStatus === "Autenticado" ? (
        <div>
          <p>{authStatus}</p>
          <h1>Name: {name}</h1>
          <h1>Idade:{age}</h1>
          <h1>{bio}</h1>
          <img
            src={avatarUrl!}

            className="w-20 h-20 object-cover rounded-md"
          />
          <h1>{location}</h1>
        </div>

      ) : (
        <p>Não autenticado</p>
      )}
    </div>
  );
}