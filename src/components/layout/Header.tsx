import { Menu, Moon, Sun, Monitor, Globe } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { authService } from "@/services/auth"
import NotificationPopover from "./NotificationPopover"
import { useTranslation } from "react-i18next"
import { useThemeSettings } from "@/hooks/useThemeSettings"
import { Theme } from "@/types/preferences"

interface HeaderProps {
  onLogout: () => void
}

export default function Header({ onLogout }: HeaderProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const userData = authService.getUserData()
  const { theme, resolvedTheme } = useThemeSettings()

  const getUserInitials = () => {
    if (!userData?.name) return "U"
    return userData.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
  }

  const getLanguageDisplay = () => {
    return t("language") === "English" ? "EN" : "PT-BR"
  }

  const getThemeIcon = () => {
    switch (theme) {
      case Theme.LIGHT:
        return <Sun className="h-5 w-5" />
      case Theme.DARK:
        return <Moon className="h-5 w-5" />
      case Theme.SYSTEM:
        return <Monitor className="h-5 w-5" />
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case Theme.LIGHT:
        return <span>{t("theme.light")}</span>
      case Theme.DARK:
        return <span>{t("theme.dark")}</span>
      case Theme.SYSTEM:
        return <span>{t("theme.system")}</span>
    }
  }

  return (
    <header className="fixed top-0 left-0 w-full h-16 border-b flex items-center justify-between px-4 z-30">
      <div className="flex items-center gap-2">
        <SidebarTrigger>
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-muted/60 px-2 py-1 rounded text-xs mr-2">
          <Globe className="h-3 w-3 mr-1" />
          <span>{getLanguageDisplay()}</span>
        </div>

        <NotificationPopover />

        <div className="flex items-center bg-muted/60 px-2 py-1 rounded text-xs mr-2">
          {getThemeIcon()}
          <span className="ml-1">{getThemeLabel()}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 rounded-full"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="w-full">
                Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="w-full">
                Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Ajuda</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
