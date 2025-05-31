"use client"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APIBASEURL,
  });
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Limpa erros anteriores
    setLoading(true);
    try {
      // Enviar credenciais para o backend (substitua a URL pelo seu endpoint)
      //const response = await fetch('http://localhost:3001/api/sessions/login', {
      //  method: 'POST',
      //  headers: { 'Content-Type': 'application/json' },
      //  body: JSON.stringify({ email, password }),
      // });
      const response = await api.post(`/api/sessions/login`,
        {
          email: email, password: password
        });
      //const data = await response.json();
      // Salvar o token no localStorage (ou cookies)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      //console.log(response.data.token, response.data.userId)
      window.location.href = '/manage'; // Redirecionar para o dashboard
    } catch (err) {
      setError('Erro ao processar a solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Entra em sua Conta</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Informe o Email e senha
        </p>
      </div>
      {/* Exibir mensagens de erro */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Esqueceu Sua Senha?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Entrando..." : "Login"}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Outras opções de login
          </span>
        </div>
        <Button variant="outline" className="w-full">
          
          Login com Google
        </Button>
      </div>
    </form>
  );
}