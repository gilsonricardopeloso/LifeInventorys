import React, { useState, useEffect } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
  useNavigate,
} from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import Header from "@/components/layout/Header"
import AppSidebar from "@/components/layout/Sidebar"
import Dashboard from "./pages/Dashboard"
import Habits from "./pages/Habits"
import NotFound from "./pages/NotFound"
import CalendarPage from "./pages/Calendar"
import Profile from "./pages/Profile"
import Statistics from "./pages/Statistics"
import Achievements from "./pages/Achievements"
import Settings from "./pages/Settings"
import Landing from "./pages/Landing"
import Users from "./pages/Users"
import { authService } from "@/services/auth"
//import { useThemeSettings } from "@/hooks/useThemeSettings"
import "./i18n"

const queryClient = new QueryClient()

const ProtectedLayout = (props: { onLogout: () => void }) => (
  <SidebarProvider>
    <div className="min-h-screen flex flex-col w-full">
      <Header onLogout={props.onLogout} />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  </SidebarProvider>
)

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    authService.isAuthenticated()
  )
  const navigate = useNavigate()
  const location = useLocation()
  // const { theme } = useThemeSettings()

  // Inicializa autenticação apenas no mount
  useEffect(() => {
    const isAuth = authService.isAuthenticated()
    setIsAuthenticated(isAuth)

    // Se houver usuário autenticado, redireciona para o dashboard
    if (isAuth && location.pathname === "/") {
      navigate("/dashboard")
    }
  }, [navigate, location.pathname])

  // Redireciona para dashboard se autenticado e na página inicial
  useEffect(() => {
    if (isAuthenticated && location.pathname === "/") {
      navigate("/dashboard")
    }
  }, [isAuthenticated, location.pathname, navigate])

  const handleLogout = () => {
    authService.logout()
    setIsAuthenticated(false)
    navigate("/")
  }

  const handleLogin = () => {
    setIsAuthenticated(true)
    navigate("/dashboard")
  }

  return (
    <TooltipProvider>
      <Routes>
        {/* Landing sempre em / */}
        <Route path="/" element={<Landing onLogin={handleLogin} />} />

        {/* Rotas protegidas */}
        {isAuthenticated && (
          <Route element={<ProtectedLayout onLogout={handleLogout} />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="habits" element={<Habits />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="settings" element={<Settings />} />
            <Route path="users" element={<Users />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        )}

        {/* Se não autenticado e tentar acessar rota protegida, redireciona para / */}
        {!isAuthenticated && (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
