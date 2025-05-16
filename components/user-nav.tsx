"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  ShoppingCart,
  SquareTerminal,
  Bot,
  MessageCircle,
  MapPinned,
  UserPen ,
  BadgeHelp 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useUserContext } from "@/components/dataLists/UserContext.tsx";
import { useRouter } from "next/navigation";

export function UserNav() {
  const router = useRouter();

  const { user, profile } = useUserContext();
  // Função para logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove o token do localStorage
    router.push("/auth");
    // Limpa todos os dados do usuário

  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/02.png" alt="@shadcn" />

            <AvatarFallback>...</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex flex-col items-center space-y-1">
              <img
                src={profile?.avatarUrl || "/avatars/01.png"}
                alt="Avatar"
                className="w-20 h-20 object-cover rounded-full mb-4"
              />
            </div>
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground p-1">{profile?.bio || 'Indisponível.'}</p>
            <div className="flex flex-roll items-center p-1">
              <MapPinned/>
              <p className="text-xs leading-none text-muted-foreground p-1">{profile?.location || 'Localização Indisponível'}</p>
            </div>

            <p className="text-xs leading-none text-muted-foreground p-1">
              {Array.isArray(user?.phone) && user.phone.length > 0 ? (
                user.phone.map((item, index) => (
                  <div key={index} className="flex flex-roll items-center p-1">
                    <MessageCircle />{item}
                  </div>
                ))
              ) : (
                <p>Nenhum telefone cadastrado.</p>
              )}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem><UserPen/>Perfil</DropdownMenuItem>
          <DropdownMenuItem><BadgeHelp/>Ajuda</DropdownMenuItem>
          <DropdownMenuItem><SquareTerminal/>Bugs</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuItem>
          <DropdownMenuShortcut>
            <p
              onClick={handleLogout}
              className=""
            >
              Desconectar
            </p>
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}