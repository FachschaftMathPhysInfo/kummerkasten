"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import {usePathname} from "next/navigation";
import {LogOut, Settings, Tags, Tickets, Users} from "lucide-react";
import {router} from "next/client";
import {toast} from "sonner";


export default function AppSidebar() {
  const pathname = usePathname()
  const basePath = "/" + pathname.split("/")[1];

  const userItems = [
    {
      title: "Tickets",
      url: basePath + "/tickets",
      icon: Tickets,
    },
    {
      title: "Labels",
      url: basePath + "/labels",
      icon: Tags,
    },
  ]

  const adminItems = [
    {
      title: "Users",
      url: basePath + "/users",
      icon: Users,
    }
  ]

  return (
    <Sidebar>
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
              {adminItems.map((item) => (
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

      <SidebarFooter >
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => router.push(basePath + "/profile")}
              className={'flex items-center'}
            >
              <Settings/> Einstellungen
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            {/*TODO: add logout*/}
            <SidebarMenuButton
              onClick={() => toast.info("Not yet implemented")}
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
