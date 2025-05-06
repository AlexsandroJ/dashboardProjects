
"use client"

import { useState } from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-forms"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)

  const toggleForm = () => {
    setIsLogin(!isLogin)
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Coluna da Logo - com animação */}
      <div
        className={`relative flex items-center justify-center bg-muted transition-all duration-700 transform ${
          isLogin ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <img
          src="qwen.png"
          alt="Logo"
          className="h-40 w-auto object-contain dark:brightness-[0.2] dark:grayscale"
        />
      </div>

      {/* Coluna do Formulário - com animação */}
      <div
        className={`flex flex-col gap-4 p-6 md:p-10 transition-all duration-700 transform ${
          isLogin ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Nome da empresa */}
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div>

        {/* Conteúdo central */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>

        {/* Botão de teste */}
        <div className="mt-auto text-center">
          <button
            onClick={toggleForm}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Teste
          </button>
        </div>
      </div>
    </div>
  )
}
