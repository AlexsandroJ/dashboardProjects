"use client";
import { useEffect, useState } from 'react';
import axios from "axios";

export default function AuthTest() {
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [phone, setPhone] = useState<string[] | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [age, setAge] = useState<number | null>(null);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APIBASEURL,
  });

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setAuthStatus('Não autenticado');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_APIBASEURL}/api/sessions/check-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          const user = await api.get(`/api/users/${data.userId}`);
          const perfil = await api.get(`/api/profiles/${data.userId}`);

          setUserId(data.userId);
          setName(user.data.name || null);
          setPhone(user.data.phone || []);
          setBio(perfil.data.bio || null);
          setAvatarUrl(perfil.data.avatarUrl || null);
          setAge(perfil.data.age || null);
          setLocation(perfil.data.location || null);
          setAuthStatus('Autenticado');
        } else {
          setAuthStatus('Token inválido ou expirado.');
        }
      } catch (error) {
        setAuthStatus('Erro ao verificar autenticação.');
      }
    };

    checkAuthentication();
  }, []);

  // Função para logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove o token do localStorage
    setAuthStatus('Não autenticado');
    // Limpa todos os dados do usuário
    setUserId(null);
    setName(null);
    setPhone([]);
    setBio(null);
    setAvatarUrl(null);
    setLocation(null);
    setAge(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Teste de Autenticação</h1>

      {authStatus === "Autenticado" ? (
        <div>
          <p>{authStatus}</p>
          <h1>Name: {name}</h1>
          <h1>Idade: {age ?? 'Não informada'}</h1>

          <h2>Telefones:</h2>
          {Array.isArray(phone) && phone.length > 0 ? (
            phone.map((item, index) => (
              <div key={index} className="p-2">
                {item}
              </div>
            ))
          ) : (
            <p>Nenhum telefone cadastrado.</p>
          )}

          <h2>Bio: {bio || 'Nenhuma bio disponível.'}</h2>

          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-20 h-20 object-cover rounded-full mb-4"
            />
          )}

          <h2>Cidade: {location || 'Localização não informada'}</h2>

          {/* Botão de Logout */}
          <button
            onClick={handleLogout}
            className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Sair
          </button>
        </div>
      ) : (
        <p>{authStatus || 'Faça login para continuar.'}</p>
      )}
    </div>
  );
}