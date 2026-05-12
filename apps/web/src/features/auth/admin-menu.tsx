import { NavLink, useLocation } from "react-router-dom"
import { adminMenuItems } from "./admin-menu-items.ts"

export function AdminMenu() {
  const location = useLocation()

  return (
    <nav aria-label="Menu admin">
      <ul className="space-y-1">
        {adminMenuItems.map((item) => {
          const isActive = item.matches(location.pathname)

          return (
            <li key={item.id}>
              <NavLink
                to={item.to}
                aria-current={isActive ? "page" : undefined}
                className={({ isActive: navLinkActive }) =>
                  [
                    "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive || navLinkActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
