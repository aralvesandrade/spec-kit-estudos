import { Sun, Moon } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { useTheme } from "./theme-provider.tsx"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
    >
      {theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  )
}
