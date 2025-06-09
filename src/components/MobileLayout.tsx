
import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  MessageSquare, 
  Settings as SettingsIcon,
  Menu,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
  SidebarFooter,
  SidebarInset
} from '@/components/ui/sidebar'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'

const MobileLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut, user } = useAuth()
  const isMobile = useIsMobile()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Content Agent', href: '/content-agent', icon: MessageSquare },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
  ]

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      })
    } else {
      navigate('/login')
    }
  }

  const handleNavigate = (href: string) => {
    navigate(href)
    if (isMobile) {
      setMobileMenuOpen(false)
    }
  }

  const AppSidebar = () => (
    <Sidebar variant="inset">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center px-4 py-2">
          <img 
            src="/lovable-uploads/e8643f93-e236-4374-b873-aa473567bf66.png" 
            alt="UbiQ" 
            className="h-6 w-auto"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  onClick={() => handleNavigate(item.href)}
                  isActive={isActive}
                  className="w-full"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-border">
        <div className="p-2">
          <div className="mb-2 px-2">
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          </div>
          <SidebarMenuButton
            onClick={handleSignOut}
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  )

  const MobileHeader = () => (
    <div className="bg-background border-b border-border px-4 py-3 flex justify-between items-center lg:hidden">
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center px-4 py-4 border-b border-border">
              <img 
                src="/lovable-uploads/e8643f93-e236-4374-b873-aa473567bf66.png" 
                alt="UbiQ" 
                className="h-6 w-auto"
              />
            </div>
            <div className="flex-1 p-4">
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <Button
                      key={item.name}
                      variant={isActive ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleNavigate(item.href)}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </Button>
                  )
                })}
              </nav>
            </div>
            <div className="p-4 border-t border-border">
              <div className="mb-3">
                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      <img 
        src="/lovable-uploads/e8643f93-e236-4374-b873-aa473567bf66.png" 
        alt="UbiQ" 
        className="h-8 w-auto"
      />
    </div>
  )

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="ml-auto">
              <img 
                src="/lovable-uploads/e8643f93-e236-4374-b873-aa473567bf66.png" 
                alt="UbiQ" 
                className="h-8 w-auto"
              />
            </div>
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default MobileLayout
