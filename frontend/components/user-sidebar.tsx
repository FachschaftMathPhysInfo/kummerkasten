"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import {LogOut, Settings, Tags, Tickets, Users} from "lucide-react";
import {useUser} from "@/components/providers/user-provider";
import {UserRole} from "@/lib/graph/generated/graphql";
import {useRouter} from "next/navigation";


export function UserSidebar() {
  const {user, logout} = useUser()
  const router = useRouter()

  const userItems = [
    {
      title: "Tickets",
      url: "/tickets",
      icon: Tickets,
    },
    {
      title: "Labels",
      url: "/labels",
      icon: Tags,
    },
  ]

  const adminItems = [
    {
      title: "Users",
      url: "/users",
      icon: Users,
    }
  ]

  if (!user) return null

  return (
    <Sidebar className={'relative'} collapsible={"icon"}>
      <SidebarContent className={'pr-10'}>
        <SidebarGroup className={'h-full justify-center'}>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon/>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {user?.role === UserRole.Admin && adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
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
            <SidebarMenuButton
              onClick={() => router.push("/profile")}
              className={'flex items-center'}
            >
              <Settings/> Einstellungen
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => logout()}
              className={'flex items-center text-destructive'}
            >
              <LogOut className={'stroke-destructive'}/> Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );

}

export function UserSidebarTrigger() {
  const {user} = useUser();
  if (!user) return null;
  return <SidebarTrigger/>
}
