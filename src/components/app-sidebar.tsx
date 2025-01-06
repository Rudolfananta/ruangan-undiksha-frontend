import * as React from "react"

import { NavList } from "@/components/nav-list"
import { NavUser } from "@/components/nav-user"
import { AppName } from "@/components/app-name"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  data: {
    navigations: any
  }
}

export function AppSidebar({ data, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppName />
      </SidebarHeader>
      <SidebarContent>
        <NavList label="Navigasi" navigations={data.navigations} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
