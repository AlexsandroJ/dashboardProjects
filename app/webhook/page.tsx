"use client"
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function Home() {
  const [dados, setDados] = useState(null);
  const [imagemSrc, setImagemSrc] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:3001');

    socket.on('connect', () => {
      console.log('🔌 Conectado ao servidor WebSocket');
    });

    socket.on('atualizacao', (data) => {
      console.log('📥 Dados recebidos:', data.imageData);
      setDados(data);

      // Se tiver imagem em base64
      if (data.imageData) {
        setImagemSrc(`data:image/png;base64,${data.imageData}`);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Função chamada ao clicar no botão
  const handleEnviarAtualizacao = () => {
    const mensagem = {
      type: 'atualizacao_manual',
      valor: Math.random() * 100,
      timestamp: new Date().toISOString()
    };

    console.log('📤 Enviando evento "atualizacao" para o servidor:', mensagem);

    const socket = io('http://localhost:3001');
    socket.emit('atualizacao', mensagem);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dados Recebidos:</h1>
      <pre>{dados ? JSON.stringify(dados, null, 2) : 'Aguardando dados...'}</pre>

      {/* Botão para emitir evento */}
      <button
        onClick={handleEnviarAtualizacao}
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          cursor: 'pointer',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        }}
      >
        Enviar Atualização
      </button>

      {/* Exibe a imagem recebida */}
      {imagemSrc && (
        <div style={{ marginTop: '2rem' }}>
          <h2>QR Code Recebido</h2>
          <img
            src={imagemSrc}
            alt="QR Code recebido"
            style={{ width: 'auto', height: '300px', border: '1px solid #ccc' }}
          />
        </div>
      )}
    </div>
  );
}