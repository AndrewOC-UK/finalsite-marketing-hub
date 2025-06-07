
import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  MessageSquare, 
  Settings as SettingsIcon,
  Menu,
  X,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import FinalsiteLogo from '@/components/FinalsiteLogo'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut, user } = useAuth()

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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo and Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {sidebarOpen && <FinalsiteLogo className="h-8" />}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-[#0072b8]"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <li key={item.name}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        isActive 
                          ? 'bg-[#0072b8] text-white hover:bg-[#005a94]' 
                          : 'text-gray-600 hover:text-[#0072b8] hover:bg-gray-100'
                      }`}
                      onClick={() => navigate(item.href)}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {sidebarOpen && item.name}
                    </Button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            {sidebarOpen && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 truncate">{user?.email}</p>
              </div>
            )}
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-3" />
              {sidebarOpen && 'Sign Out'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
