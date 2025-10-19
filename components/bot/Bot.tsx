"use client"
import { useEffect, useState, useRef } from 'react';
import { Switch } from "@/components/ui/switch"
import HelpTooltip from "../HelpTooltip"; // ajuste o caminho se necessário
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import {
    MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button";


import { useUserContext } from "../dataLists/UserContext.tsx";
import { use } from 'chai';

import {
    Category,
    City,
    Profile,
    User,
    UserContextType,
} from "../../src/interfaces/interfaces";

import { DeploymentData, ServiceData } from '../../src/interfaces/interfaces';


export default function Home() {

    const [dados, setDados] = useState<string | null>(null);
    const [imagemSrc, setImagemSrc] = useState<string | null>(null);;
    const [conectado, setConectado] = useState(false);
    const [botActiveState, setBotActiveState] = useState(false);
    const [botAIState, setBotAIState] = useState(false);
    const [clientState, setClientState] = useState(false);
    const [serverState, setServerState] = useState(false);
    const [loading, setLoading] = useState(false);

    const socketRef = useRef<Socket | null>(null); // ✅ Usa useRef para manter uma única instância


    const { userId, token, fetchData } = useUserContext() as {
        userId: string | null;
        token: string | null;
        fetchData: () => void;
    };


    const deploymentData: DeploymentData = {
        apiVersion: "apps/v1",
        kind: "Deployment",
        metadata: {
            name: `whatsap-${userId}`
        },
        spec: {
            replicas: 1,
            selector: {
                matchLabels: {
                    app: `whatsap-${userId}`
                }
            },
            template: {
                metadata: {
                    labels: {
                        app: `whatsap-${userId}`
                    }
                },
                spec: {
                    containers: [
                        {
                            name: `whatsap-${userId}`,
                            image: "alexsandrojsilva0/whatsap:latest",
                            ports: [
                                {
                                    containerPort: 5001
                                }
                            ],
                            env: [
                                {
                                    name: "TOKEN",
                                    value: token
                                },
                                {
                                    name: "USERID",
                                    value: userId
                                },
                                {
                                    name: "NODE_ENV",
                                    value: "production"
                                },
                                {
                                    name: "API_URL",
                                    value: process.env.NEXT_PUBLIC_APIBASEURL_ZAP
                                },
                                {
                                    name: "API_KEY_GROQ_AI",
                                    value: process.env.NEXT_PUBLIC_API_KEY_GROQ_AI
                                },
                                {
                                    name: "API_AI_LINK",
                                    value: process.env.NEXT_PUBLIC_API_AI_LINK
                                },
                                {
                                    name: "MODEL",
                                    value: process.env.NEXT_PUBLIC_MODEL
                                },
                                {
                                    name: "MAX_TOKENS",
                                    value: process.env.NEXT_PUBLIC_MAX_TOKENS
                                },
                                {
                                    name: "DEV",
                                    value: "false"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    };

    const serviceData: ServiceData = {
        apiVersion: "v1",
        kind: "Service",
        metadata: {
            name: `whatsap-${userId}`
        },
        spec: {
            type: "LoadBalancer",
            selector: {
                app: `whatsap-${userId}`
            },
            ports: [
                {
                    protocol: "TCP",
                    port: 5001,
                    targetPort: 5001
                }
            ]
        }
    };


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
            socket.emit("atualizacao", { type: "getStates", token: token, userId: userId });
        });

        socket.on("disconnect", () => {
            console.log("🔴 Servidor desconectado");
            setServerState(false);
        });

        socket.on("atualizacao", (data) => {

            if (data.userId === userId) {

                fetchData(); // Atualiza os dados do usuário

                console.log("📥 Dados:", data);

                setDados(data);

                if (!data.conectado && data.imageData) {
                    setImagemSrc(`data:image/png;base64,${data.imageData}`);
                }
                setServerState(data.serverState);
                setClientState(data.clientState);
                setConectado(data.conectado);
                setBotActiveState(data.botActiveState);
                setBotAIState(data.botAIState);


            }

            if (data.name.includes(userId) && data.reason === "SuccessfulCreate") {

                fetchData(); // Atualiza os dados do usuário
                console.log("Container Criado", data.reason);


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
            token: token,
            userId: userId
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
            token: token,
            userId: userId
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
            token: token,
            userId: userId,
            serverState: serverState,
            clientState: novoEstado,
            conectado: conectado,
            botActiveState: botActiveState,
            botAIState: botAIState,
            imageData: imagemSrc
        };

        if (socketRef.current?.connected) {
            socketRef.current.emit("atualizacao", mensagem);
        } else {
            console.warn("❌ Sistema offline - comando ignorado");
        }
    };

    // Função para criar deployment
    const createDeployment = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_APIBASEURL}/api/creat-deployments/${userId}`, {
                deployment: deploymentData
            });
            //alert('Deployment criado com sucesso!');
            return response.data;
        } catch (error) {
            // Verifica se é um erro do Axios (com .response)
            if (axios.isAxiosError(error)) {
                console.error('Erro ao criar deployment:', error.response?.data || error.message);
            } else if (error instanceof Error) {
                // É um erro nativo do JavaScript
                console.error('Erro ao criar deployment:', error.message);
            } else {
                // É algo inesperado (string, número, etc.)
                console.error('Erro ao criar deployment:', error);
            }
            throw error;
        }
    };

    // Função para expor serviço
    const exposeService = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_APIBASEURL}/api/expose-services/${userId}`, {
                service: serviceData
            });
            //alert('Serviço criado com sucesso!');
            return response.data;
        } catch (error) {
            // Verifica se é um erro do Axios (com .response)
            if (axios.isAxiosError(error)) {
                console.error('Erro ao expor serviço:', error.response?.data || error.message);
            } else if (error instanceof Error) {
                // É um erro nativo do JavaScript
                console.error('Erro ao expor serviço:', error.message);
            } else {
                // É algo inesperado (string, número, etc.)
                console.error('Erro ao expor serviço:', error);
            }
            throw error;
        }
    };
    const iniciar = async () => {
        // Cria o deployment
        await createDeployment();
        // Expõe o serviço
        await exposeService();
        fetchData();
        setLoading(true);
    }

    const fechar = async () => {
        try {
            await deletarServico();
            await deletarDeployment();
            setServerState(false);
            fetchData();
            setLoading(false);
        } catch (error) {
            // Verifica se é um erro do Axios (com .response)
            if (axios.isAxiosError(error)) {
                console.error('Erro ao criar deployment e serviço:', error.response?.data || error.message);
            } else if (error instanceof Error) {
                // É um erro nativo do JavaScript
                console.error('Erro ao criar deployment e serviço:', error.message);
            } else {
                // É algo inesperado (string, número, etc.)
                console.error('Erro ao criar deployment e serviço:', error);
            }
            throw error;

        }
    }

    const listDeployments = async () => {
        try {
            console.log(userId);
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_APIBASEURL}/api/list-deployments`);

            console.log(response.data);
        } catch (error) {
            // Verifica se é um erro do Axios (com .response)
            if (axios.isAxiosError(error)) {
                console.error('Erro ao listar deployments:', error.response?.data || error.message);
            } else if (error instanceof Error) {
                // É um erro nativo do JavaScript
                console.error('Erro ao listar deployments:', error.message);
            } else {
                // É algo inesperado (string, número, etc.)
                console.error('Erro ao listar deployments:', error);
            }

            throw error;
        }
    };
    const listServices = async () => {
        try {
            console.log(userId);
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_APIBASEURL}/api/list-services`);

            console.log(response.data);
        } catch (error) {

            // Verifica se é um erro do Axios (com .response)
            if (axios.isAxiosError(error)) {
                console.error('Erro ao listar serviços:', error.response?.data || error.message);
            } else if (error instanceof Error) {
                // É um erro nativo do JavaScript
                console.error('Erro ao listar serviços:', error.message);
            } else {
                // É algo inesperado (string, número, etc.)
                console.error('Erro ao listar serviços:', error);
            }
            throw error;
        }
    };
    const deletarDeployment = async () => {
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_APIBASEURL}/api/del-deployments/${userId}`);
            //alert('Deployment deletado com sucesso!');
            console.log(response.data);
        } catch (error) {
             // Verifica se é um erro do Axios (com .response)
            if (axios.isAxiosError(error)) {
                console.error('Erro ao deletar deployments:', error.response?.data || error.message);
            } else if (error instanceof Error) {
                // É um erro nativo do JavaScript
                console.error('Erro ao deletar deployments:', error.message);
            } else {
                // É algo inesperado (string, número, etc.)
                console.error('Erro ao deletar deployments:', error);
            }
            throw error;
        }
    };
    const deletarServico = async () => {
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_APIBASEURL}/api/del-services/${userId}`);
            //alert('Serviço deletado com sucesso!');
            console.log(response.data);
        } catch (error) {
              // Verifica se é um erro do Axios (com .response)
            if (axios.isAxiosError(error)) {
                console.error('Erro ao deletar serviços:', error.response?.data || error.message);
            } else if (error instanceof Error) {
                // É um erro nativo do JavaScript
                console.error('Erro ao deletar serviços:', error.message);
            } else {
                // É algo inesperado (string, número, etc.)
                console.error('Erro ao deletar serviços:', error);
            }
            throw error;
        }
    };
    return (
        <div className="space-x-4 p-6 ">
            <div className="flex flex-col items-center gap-4">

            </div>
            {serverState ? (
                <div className="flex flex-col items-center gap-4">

                    <p>✅​ Whatsapp Server Conectado</p>
                    <Button
                        onClick={fechar}
                    >Fechar</Button>
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
                                                {botAIState ? 'Modo IA' : 'Modo Menu'}
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
                            <p>⏳ Aguarde Liberação do QRCode</p>
                        </div>

                    )}


                </div>

            ) : (

                <div className="flex flex-col items-center gap-4 ">
                    <Button
                        onClick={iniciar}
                    >Iniciar Sistema</Button>
                    <span
                        style={{
                            color: loading ? '#f44336' : '#4CAF50',
                        }}
                    >
                        {loading ? '🔴 Sistema Iniciando...' : '🔴 Sistema Desconectado'}

                    </span>
                </div>
            )}

        </div>
    );
}