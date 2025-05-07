"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function RegisterForm({ className, ...props }) {
  // Estados para os campos do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState(""); // Novo campo: Bio
  const [avatarUrl, setAvatarUrl] = useState(""); // Novo campo: Avatar URL
  const [location, setLocation] = useState(""); // Novo campo: Localização
  const [age, setAge] = useState(""); // Novo campo: Idade
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar se as senhas coincidem
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Enviar os dados para o backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_APIBASEURL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password

        }),
      });
      // Verificar a resposta do backend
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Register-forms: Erro ao registrar usuário");
      }
      const data = await response.json();

      const userId = data.userId;
      
      const respon = await fetch(`${process.env.NEXT_PUBLIC_APIBASEURL}/api/profiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          bio: bio,
          avatarUrl: avatarUrl,
          location: location,
          //age: age,
        }),
      });

      // Verificar a resposta do backend
      if (!respon.ok) {
        const errorData = await respon.json();
        throw new Error(errorData.message || "Register-forms: Erro ao registrar perfil");
      }

      
      console.log("Usuário registrado com sucesso:", data);

      // Redirecionar ou exibir mensagem de sucesso
      alert("Cadastro realizado com sucesso! Verifique seu email para confirmar.");
      window.location.href = "/login"; // Redireciona para a página de login
    } catch (err) {
      setError(err.message || "Register-forms: Erro ao processar o cadastro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Cadastro</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Insira seu Nome, Email, Senha e informações adicionais sobre seu perfil.
        </p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="grid gap-6">
        {/* Campo de Nome */}
        <div className="grid gap-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            type="text"
            placeholder="Jonas"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Campo de Email */}
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

        {/* Campo de Bio */}
        <div className="grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Input
            id="bio"
            type="text"
            placeholder="Fale um pouco sobre você..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Campo de Avatar URL */}
        <div className="grid gap-2">
          <Label htmlFor="avatar-url">URL do Avatar</Label>
          <Input
            id="avatar-url"
            type="url"
            placeholder="https://example.com/avatar.jpg"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
        </div>

        {/* Campo de Localização */}
        <div className="grid gap-2">
          <Label htmlFor="location">Localização</Label>
          <Input
            id="location"
            type="text"
            placeholder="São Paulo, Brasil"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Campo de Idade */}
        <div className="grid gap-2">
          <Label htmlFor="age">Idade</Label>
          <Input
            id="age"
            type="text"
            placeholder="25"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        {/* Campo de Senha */}
        <div className="grid gap-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Confirmação de Senha */}
        <div className="grid gap-2">
          <Label htmlFor="password-check">Confirme sua Senha</Label>
          <Input
            id="password-check"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {/* Botão de Envio */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Button>

        {/* Outras formas de cadastro */}
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Outras formas de cadastro
          </span>
        </div>
        <Button variant="outline" className="w-full">

          Cadastre-se com Google
        </Button>
      </div>

      <div className="text-center text-sm">
        Relate erros ou bugs{" "}
        <a href="#" className="underline underline-offset-4">
          Aqui
        </a>
      </div>
    </form>
  );
}