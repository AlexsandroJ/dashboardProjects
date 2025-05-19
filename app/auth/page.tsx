"use client"

import { useState, useEffect } from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-forms"
import { Button } from "@/components/ui/button"

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Detecta se é um dispositivo móvel
  useEffect(() => {
    const userAgent = navigator.userAgent
    const mobileUA = /iPhone|iPad|iPod|Android/i.test(userAgent)
    const mobileScreen = window.matchMedia("(max-width: 767px)").matches

    setIsMobile(mobileUA || mobileScreen)
  }, [])

  const toggleForm = () => {
    setIsLogin(!isLogin)
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Coluna da Logo - só exibe se NÃO for celular */}
      {!isMobile && (
        <div
          className={`relative hidden lg:flex items-center justify-center bg-muted transition-all duration-700 ${
            isLogin ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <img
            src="qwen.png"
            alt="Logo"
            className="h-40 w-auto object-contain dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      )}

      {/* Coluna do Formulário */}
      <div
        className={`flex flex-col gap-4 p-6 md:p-10 transition-all duration-700 ${
          !isMobile && isLogin ? "translate-x-0" : !isMobile && "-translate-x-full"
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

        {/* Botão de alternância */}
        <div className="mt-auto text-center">
          <Button variant="outline" onClick={toggleForm}>
            {isLogin ? "Registre-se" : "Faça login"}
          </Button>
        </div>
      </div>
    </div>
  )
}