export type AdminMenuItemId = "clientes"

export type AdminMenuItem = {
  id: AdminMenuItemId
  label: string
  to: "/clientes"
  matches: (pathname: string) => boolean
}

function isCustomersSection(pathname: string) {
  return pathname === "/clientes" || pathname.startsWith("/clientes/")
}

export const adminMenuItems: AdminMenuItem[] = [
  {
    id: "clientes",
    label: "Clientes",
    to: "/clientes",
    matches: isCustomersSection,
  },
]
