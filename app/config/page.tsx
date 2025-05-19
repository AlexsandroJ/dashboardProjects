import React, { Suspense } from "react";
// navigation components
import { UserNav } from "@/components/user-nav";
import { MainNav } from "@/components/main-nav";

import { ModeToggle } from "@/components/toggle_between_light_dark"

// high level components
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

import DataInterfaceContextTest from '@/components/dataLists/DataInterfaceContextTest';


import ProtectedComponent from "@/components/ProtectedComponent";
import { UserProvider } from "@/components/dataLists/UserContext.tsx";


// This is the main page of the app.
export default function Config() {

  return (

    <main className="flex min-h-screen flex-col items-center justify-between p-y-4">
      <ProtectedComponent>
        <SidebarProvider>
          <UserProvider>
            <AppSidebar />
            <SidebarTrigger />

            <div className="flex-col flex max-w-7xl w-full mx-auto">
              <div className="border-b">
                <div className="flex h-16 items-center px-4">
                  {/*<TeamSwitcher />*/}
                  <MainNav className="mx-6" />
                  <div className="ml-auto flex items-center space-x-4">
                    <ModeToggle />
                    {/*<Search />*/}
                    <UserNav />
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2 flex-wrap">

                  <div className="flex items-center space-x-2">

                  </div>
                </div>


              </div>
            </div>
          </UserProvider>
        </SidebarProvider>
      </ProtectedComponent>
    </main>
  );
}