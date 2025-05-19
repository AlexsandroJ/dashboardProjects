import { 
  Calendar, 
  Home, 
  Inbox, 
  Search, 
  Settings, 
  ShoppingCart, 
  SquareTerminal, 
  Bot, MessageCircle      } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Gerência",
    url: "/manage",
    icon: SquareTerminal  ,
  },
  {
    title: "Bot",
    url: "/bot",
    icon: Bot  ,
  },
  {
    title: "Planos",
    url: "/plan",
    icon: ShoppingCart ,
  },
  {
    title: "Configurações",
    url: "/config",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar  variant="sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
