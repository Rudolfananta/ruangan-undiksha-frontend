import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from '@/lib/utils'
import { GroupIcon, HousePlusIcon } from 'lucide-react'
import { ModeToggle } from '../mode-toggle'

// This is sample data.
const data = {
    navigations: [
      {
        name: "Unit",
        url: "/admin/units",
        icon: GroupIcon,
      },
      {
        name: "Ruangan",
        url: "/admin/rooms",
        icon: HousePlusIcon,
      },
    ],
  }

export function AdminLayout({ className, children }: { className?: string,  children?: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar data={data} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <ModeToggle />
          </div>
        </header>
        <div className={cn('p-4 pt-0', className)}>
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}