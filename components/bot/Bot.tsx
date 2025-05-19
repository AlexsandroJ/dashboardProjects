"use client"
import { useEffect, useState, useRef } from 'react';
import { Switch } from "@/components/ui/switch"
import HelpTooltip from "../HelpTooltip"; // ajuste o caminho se necessário

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
    const [systemState, setSystemState] = useState(false);
    const [serveState, setServeState] = useState(false);

     const socketRef = useRef(null); // ✅ Usa useRef para manter uma única instância

  useEffect(() => {
    // ✅ Garante que só conecta uma vez
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3001", {
        reconnection: true,
        reconnectionAttempts: Infinity,
        randomizationFactor: 0.5,
        transports: ["websocket"] // Opcional: evita polling em ambientes onde só quer usar WebSocket
      });
    }

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("🔌 Conectado ao servidor");
      
      
      // Solicita estados iniciais
      socket.emit("atualizacao", { type: "getStates" });
    });

    socket.on("disconnect", () => {
      console.log("🔴 Servidor desconectado");
      setServeState(false);
    });

    socket.on("atualizacao", (data) => {
      console.log("📥 Dados recebidos:", data);
      setDados(data);

      if (data.type === "conected") {
        if (!data.conectado && data.imageData) {
          setImagemSrc(`data:image/png;base64,${data.imageData}`);
        }
        setServeState(data.whatsappWebServer);
        setSystemState(data.serveState);
        setConectado(data.conectado);
        setBotState(data.botState);
        
      }
    });

    return () => {
      // ✅ Desconecta no unmount
      if (socket.connected) {
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const toggleConexao = () => {
    const novoEstado = !botState;
    setBotState(novoEstado);

    const mensagem = {
      type: "setBotState",
      botState: novoEstado,
      token: localStorage.getItem("token"),
      userId: localStorage.getItem("userId")
    };

    if (socketRef.current?.connected) {
      socketRef.current.emit("atualizacao", mensagem);
    } else {
      console.warn("❌ Socket não está conectado");
    }
  };

  const toggleSystem = () => {
    const novoEstado = !systemState;
    setSystemState(novoEstado);

    const mensagem = {
      type: "system",
      comand: novoEstado
    };

    if (socketRef.current?.connected) {
      socketRef.current.emit("atualizacao", mensagem);
    } else {
      console.warn("❌ Sistema offline - comando ignorado");
    }
  };

    return (
        <div className="space-x-4 p-6">

            {serveState ? (
                <div className="flex flex-col items-center  gap-4">
                    <p>✅​ Whatsapp Server Conectado</p>

                    <div className="flex flex-roll items-center gap-6">
                       
                        <span
                            style={{
                                color: systemState ? '#4CAF50' : '#f44336',
                            }}
                        >
                            {systemState ? '🔴 Reiniciar Conexão' : '🟢 Conectar'}

                        </span>
                        <Switch
                            checked={systemState}
                            onCheckedChange={toggleSystem}
                        />
                        <span
                            style={{
                                color: systemState ? '#4CAF50' : '#f44336',
                            }}
                        >
                            {systemState ? '🟢 ON' : '🔴 OFF'}

                        </span>
                        <HelpTooltip
                            title="Controle do sistema"
                            description="❗ Atenção: Sempre que houver auterações da conexão do sistema pelo botão, será nescessário a releitura do qrCode."
                            example={`Ligue o sistema\nLeia novamente o qrCode\nQuando estiver Disponivel`}
                        />
                    </div>
                            <div>
                                <p className="text-xs leading-none text-muted-foreground p-1">
                                    ❗ Atenção: 👆🏻​ botão após desligado é nescessário releitura do qrCode
                                </p>
                                            
                            </div>
                    {systemState ? (

                        <div>
                            {conectado ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="flex flex-roll items-center gap-2">
                                        <MessageCircle />
                                        <h2>CONECTADO</h2>
                                    </div>
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
                    ) : (
                        <div className="flex flex-col items-center space-x-4 p-6">
                            <p>⏳ Aguardando inicio do systema</p>
                        </div>

                    )}


                </div>

            ) : (
                <div className="flex flex-col items-center space-x-4 p-6">
                    <p>⏳ Aguardando Conexão com o servidor...</p>
                </div>
            )}
        </div>
    );
}