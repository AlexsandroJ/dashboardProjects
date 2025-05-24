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
    const [botActiveState, setBotActiveState] = useState(false);
    const [botAIState, setBotAIState] = useState(false);
    const [clientState, setClientState] = useState(false);
    const [serverState, serServerState] = useState(false);

    const socketRef = useRef(null); // ✅ Usa useRef para manter uma única instância

    useEffect(() => {
        // ✅ Garante que só conecta uma vez
        if (!socketRef.current) {
            socketRef.current = io(process.env.NEXT_PUBLIC_APIBASEURL, {
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
            serServerState(false);
        });

        socket.on("atualizacao", (data) => {
            console.log("📥 Dados:", data);
            setDados(data);

            if (data.type === "conected") {
                if (!data.conectado && data.imageData) {
                    setImagemSrc(`data:image/png;base64,${data.imageData}`);
                }
                serServerState(data.serverState);
                setClientState(data.clientState);
                setConectado(data.conectado);
                setBotActiveState(data.botActiveState);
                setBotAIState(data.botAIState);

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

    const toggleBotsActivit = () => {
        const novoEstado = !botActiveState;

        const mensagem = {
            type: "setbotState",
            botActiveState: novoEstado,
            botAIState: botAIState,
            token: localStorage.getItem("token"),
            userId: localStorage.getItem("userId")
        };

        if (socketRef.current?.connected) {
            socketRef.current.emit("atualizacao", mensagem);
        } else {
            console.warn("❌ Socket não está conectado");
        }
    };

    const toggleBotsTipes = () => {
        const novoEstado = !botAIState;

        const mensagem = {
            type: "setbotState",
            botActiveState: botActiveState,
            botAIState: novoEstado,
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
        const novoEstado = !clientState;


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
        <div className="space-x-4 p-6 ">

            {serverState ? (
                <div className="flex flex-col items-center gap-4">
                    <p>✅​ Whatsapp Server Conectado</p>
                    <div className="flex flex-row items-center border rounded-lg  p-6 gap-6">
                        <div className="flex flex-col items-center border rounded-lg  p-6 ">
                            <div className="flex flex-row items-center bord gap-6">

                                <span
                                    style={{
                                        color: clientState ? '#f44336' : '#4CAF50',
                                    }}
                                >
                                    {clientState ? '🔴 Desconectar' : '🟢 Solicitar Conexão via QRCODE'}

                                </span>
                                <Switch
                                    checked={clientState}
                                    onCheckedChange={toggleSystem}
                                />


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
                        </div>
                        <div className="flex flex-col items-center border rounded-lg  p-6 ">
                            <p className="text-xs leading-none text-muted-foreground p-1">
                                CONEXÃO
                            </p>
                            <span
                                style={{
                                    color: clientState ? '#4CAF50' : '#f44336',
                                }}
                            >
                                {clientState ? '🟢 ON' : '🔴 OFF'}

                            </span>
                        </div>
                    </div>
                    {clientState ? (

                        <div>
                            {conectado ? (
                                <div className="flex flex-col items-center">
                                    <div className="flex flex-row items-center p-6">
                                        <MessageCircle />
                                        <h2>CONECTADO</h2>
                                    </div>

                                    <div className="flex flex-row border rounded-lg p-6 gap-6">
                                        <div className="flex flex-col justify-center items-center border rounded-lg p-2 size-40 gap-2">
                                            <span
                                                style={{
                                                    color: botActiveState ? '#4CAF50' : '#f44336',
                                                }}
                                            >
                                                {botAIState ? 'Modo Bot IA' : 'Modo Bot Menu'}
                                            </span>
                                            <div className="flex flex-row gap-6">
                                                <Switch
                                                    checked={botAIState}
                                                    onCheckedChange={toggleBotsTipes}
                                                />
                                                <HelpTooltip
                                                    title="Controle do tipo de bot"
                                                    description="Para clientes premiun existe a opção de bot com IA."
                                                    example={`Modo Bot Menu: Sistema Simples\nModo Bot IA: Uso de IA`}
                                                />
                                            </div>

                                            <span
                                                style={{
                                                    color: botActiveState ? 'yellow' : '#f44336',
                                                }}
                                            >
                                                {botAIState ? 'Modo Premiun' : ''}
                                            </span>
                                        </div>
                                        <div className="flex flex-col justify-center items-center border rounded-lg p-2 size-40 gap-2">
                                            <span
                                                style={{
                                                    color: botActiveState ? '#4CAF50' : '#f44336',
                                                }}
                                            >
                                                {botActiveState ? 'Bot ON' : 'Bot OFF'}
                                            </span>
                                            <div className="flex flex-row gap-6">
                                                <Switch
                                                    checked={botActiveState}
                                                    onCheckedChange={toggleBotsActivit}
                                                />
                                                <HelpTooltip
                                                    title="Controle ativação do bot"
                                                    description="Ligue ou desligue o bot quando for nescessario."
                                                    example={`ON\nOFF`}
                                                />
                                            </div>
                                        </div>
                                    </div>
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
                            <p>⏳ Aguardando inicio do sistema</p>
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