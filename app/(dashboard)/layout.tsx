'use client'

import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/app-sidebar"
import Navbar from "@/components/navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        {/* Left Sidebar */}
        <AppSidebar />

        {/* Main Area */}
        <div className="flex flex-1 flex-col">
          <Navbar />
          <main className="flex-1 overflow-auto p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}