"use client"
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import {LogOut, Moon, Settings, Sun, Tags, Tickets, Users} from "lucide-react";
import {useUser} from "@/components/providers/user-provider";
import {UserRole} from "@/lib/graph/generated/graphql";
import {useRouter} from "next/navigation";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";
import {clsx} from "clsx";

export function ClientSidebar() {
  const {user, logout} = useUser()
  const router = useRouter()
  const {open, isMobile} = useSidebar()
  const userItems = [
    {
      title: "Tickets",
      url: "/tickets",
      icon: Tickets,
      cypress: "sidebar-tickets"
    },
    {
      title: "Labels",
      url: "/labels",
      icon: Tags,
      cypress: "sidebar-labels"
    },
  ]
  const adminItems = [
    {
      title: "Users",
      url: "/users",
      icon: Users,
      cypress: "sidebar-users"
    }
  ]
  if (!user) return null

  return (
    <>
      <SidebarContent>
        {!isMobile && (
          <SidebarTrigger
            data-cy="sidebar-trigger"
            className={clsx(
              "absolute top-0 mt-5 transition-all",
              open ? "right-0 mr-5" : "left-1/2 -translate-x-1/2"
            )}
          />
        )}
        <SidebarGroup className={'h-full justify-center'}>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} data-cy={item.cypress}>
                      <item.icon/>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {user?.role === UserRole.Admin && adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} data-cy={item.cypress}>
                      <item.icon/>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ThemeSwitch/>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              data-cy={'sidebar-settings'}
              onClick={() => router.push("/account")}
              className={'flex items-center'}
            >
              <Settings/> Einstellungen
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              data-cy={'sidebar-logout'}
              onClick={() => logout()}
              className={'flex items-center text-destructive'}
            >
              <LogOut className={'stroke-destructive'}/> Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );

}

export function ClientSidebarTrigger() {
  const {user} = useUser();
  const {isMobile} = useSidebar()
  if (!user || !isMobile) return null;
  return <SidebarTrigger data-cy={'sidebar-trigger'}/>
}

function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const {resolvedTheme, theme, setTheme} = useTheme()
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) {
    return null
  }
  return (
    <SidebarMenuButton
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={'flex items-center'}
      data-cy={'sidebar-theme-toggle'}
    >
      {theme === "light" ? (
        <><Sun/>Hell</>
      ) : (
        <><Moon/>Dunkel</>
      )}
    </SidebarMenuButton>
  )
}