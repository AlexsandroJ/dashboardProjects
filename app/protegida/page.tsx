"use client";
import { useEffect, useState } from 'react';
import axios from "axios";

export default function AuthTest() {
  const [authStatus, setAuthStatus] = useState<string | null>(null);; // Estado para armazenar o status da autenticação
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
        const response = await fetch('http://localhost:3001/api/sessions/check-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Envia o token no cabeçalho Authorization
          },
        });

        if (response.ok) {
          const data = await response.json();

          const user = await api.get(`/api/users/${data.userId}`);
          const perfil = await api.get(`/api/perfiles/${data.userId}`);

          setAuthStatus(`Autenticado! UserID: ${data.userId} name: ${user.data.name}\nIdade: ${user.data.age}`);
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
      {authStatus === null ? (
        <p>Verificando autenticação...</p>
      ) : (
        <p>{authStatus}</p>
      )}
    </div>
  );
}