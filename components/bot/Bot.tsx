"use client"
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import {
    MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button";
export default function Home() {
    const [dados, setDados] = useState(null);
    const [imagemSrc, setImagemSrc] = useState(null);
    const [conectado, setConectado] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [botState, setBotState] = useState(false);
    const socket = io('http://localhost:3001');

    useEffect(() => {
        const socket = io('http://localhost:3001');
        socket.on('connect', () => {
            console.log('🔌 Conectado ao servidor WebSocket');
            const mensagem = {
                type: 'getStates',
            };
            socket.emit('atualizacao', mensagem);
        });

        socket.on('atualizacao', (data) => {
            setDados(data);
            console.log('📥 Dados recebidos:', data);
            if (data.type === 'conected') {
                if (!data.conectado) {
                    setImagemSrc(`data:image/png;base64,${data.imageData}`);
                }
                setConectado(data.conectado);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // Função chamada ao clicar no botão
    const toggleConexao = () => {
        const TokenAux = localStorage.getItem("token");
        const userIdAux = localStorage.getItem("userId");

        const novoEstado = !botState;
        setBotState(novoEstado);

        const mensagem = {
            type: 'botState',
            botState: novoEstado,
            token: TokenAux,
            userId: userIdAux
        };

        if (botState) {
            console.log('Bot: ✔️', botState);
        } else {
            console.log('Bot: ​❌', botState);
        }
        socket.emit('atualizacao', mensagem);
    };
    return (
        <div className="space-x-4 p-6">


            {conectado ? (
                <div className="flex flex-col items-center gap-4">
                    <MessageCircle />
                    <h2>CONECTADO</h2>
                    <div className="flex flex-roll items-center gap-2">
                        <h1>Bot</h1>
                        <h2
                            style={{
                                color: botState ? '#4CAF50' : '#f44336',
                            }}
                        >{botState ? 'ON' : 'OFF'}</h2>
                    </div>
                    <Button
                        onClick={toggleConexao}
                        style={{
                            //marginTop: '1rem',
                            //padding: '0.75rem 1.5rem',
                            //fontSize: '1rem',
                            //cursor: 'pointer',
                            //backgroundColor: botState ? '#f44336' : '#4CAF50',
                            
                            //border: 'none',
                            //borderRadius: '5px'
                        }}
                    >
                        {botState ? 'Desligar Bot' : 'Ligar Bot'}
                    </Button>
                </div>
            ) : (
                <div className="space-x-4 p-6">
                    {imagemSrc ? (
                        <div className="flex flex-col items-center space-x-4 p-6">
                            <h2>QR Code Recebido</h2>
                            <img
                                src={imagemSrc}
                                alt="QR Code recebido"
                                style={{ width: 'auto', height: '300px', border: '1px solid #ccc' }}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-x-4 p-6">
                            {conectado ? (
                                <div>
                                    <p>⏳ Esperando resposta do Servidor...</p>
                                </div>
                            ) : (
                                <div>
                                    <p>⏳ Aguardando QR Code...</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}