
'use client'

import { useTenant } from "@/hooks/use-tenant"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function Navbar() {
  const { tenant } = useTenant()
  const [user, setUser] = useState<any>(null)
  const [supabase] = useState(() => {
    try {
      return createClient()
    } catch (e) {
      return null
    }
  })

  useEffect(() => {
    if (!supabase) return
    
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }
    fetchUser()
  }, [supabase])

  const handleLogout = async () => {
    if (!supabase) return
    try {
      await supabase.auth.signOut()
      window.location.href = "/auth/login"
    } catch (error) {
      console.error("Error signing out:", error)
      window.location.href = "/auth/login"
    }
  }

  return (
    <header className="h-14 border-b bg-background px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1">
        <span className="font-medium">Dashboard</span>
        {tenant && (
          <Badge variant="outline" className="text-xs">
            {tenant.name}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm hidden md:block">{user.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}