"use client";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  CircleUserRound, Globe,
  LogOut,
  MessageCircleQuestionMark,
  Moon,
  SlidersVertical,
  Sun,
  Tags,
  Tickets,
  Users,
} from "lucide-react";
import { useUser } from "@/components/providers/user-provider";
import { UserRole } from "@/lib/graph/generated/graphql";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {useEffect, useRef} from "react";
import { clsx } from "clsx";
import Link from "next/link";
import {useTranslations} from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {setLocale} from "@/lib/cookies";
import {availableLanguages} from "@/components/language-switch";

export function ClientSidebar() {
  const t = useTranslations("Components.Sidebar.ClientSidebar")
  const tc = useTranslations("Commons")
  const { user, logout } = useUser();
  const router = useRouter();
  const { open, isMobile } = useSidebar();
  const userItems = [
    {
      title: t("tickets"),
      url: "/tickets",
      icon: Tickets,
      cypress: "sidebar-tickets",
    },
    {
      title: tc("words.labels"),
      url: "/labels",
      icon: Tags,
      cypress: "sidebar-labels",
    },
    {
      title: t("faqs"),
      url: "/faq",
      icon: MessageCircleQuestionMark,
      cypress: "sidebar-faq",
    },
  ];
  const adminItems = [
    {
      title: t("users"),
      url: "/users",
      icon: Users,
      cypress: "sidebar-users",
    },
    {
      title: t("app"),
      url: "/app-settings",
      icon: SlidersVertical,
      cypress: "sidebar-app-settings",
    },
  ];
  if (!user) return null;

  return (
    <>
      <SidebarContent>
        {!isMobile && (
          <SidebarTrigger
            data-cy="sidebar-trigger"
            className={clsx(
              "absolute transition-all z-1 hover:dark:bg-sidebar-accent",
              open ? "right-0 mr-4 mt-5 p-4.5" : "mt-5.5 p-4 left-1/2 -translate-x-1/2"
            )}
          />
        )}
        <SidebarGroup className={"h-full justify-center"}>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} data-cy={item.cypress}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {user?.role === UserRole.Admin &&
                adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} data-cy={item.cypress}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
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
            <SidebarThemeSwitch />
            <SidebarLanguageSwitch />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              data-cy={"sidebar-settings"}
              onClick={() => router.push("/account")}
              className={"flex items-center"}
            >
              <CircleUserRound /> {t("buttons.account")}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              data-cy={"sidebar-logout"}
              onClick={() => logout()}
              className={"flex items-center text-destructive"}
            >
              <LogOut className={"stroke-destructive"} /> {t("buttons.logout")}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

export function ClientSidebarTrigger() {
  const { user } = useUser();
  const { isMobile } = useSidebar();
  if (!user || !isMobile) return null;

  return <SidebarTrigger data-cy={"sidebar-trigger"} />;
}

function SidebarThemeSwitch() {
  const t = useTranslations("Components.Sidebar.ClientSidebar")
  const mounted = useRef(false);
  const { resolvedTheme, theme, setTheme } = useTheme();

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <SidebarMenuButton
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={"flex items-center"}
      data-cy={"sidebar-theme-toggle"}
    >
      {theme === "light" ? (
        <>
          <Sun />
          {t("buttons.light")}
        </>
      ) : (
        <>
          <Moon />
          {t("buttons.dark")}
        </>
      )}
    </SidebarMenuButton>
  );
}

function SidebarLanguageSwitch() {
  const t = useTranslations("Components.Sidebar.ClientSidebar")
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton><Globe/>{t("language")}</SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {availableLanguages.map(language => (
            <DropdownMenuItem key={language.localeKey} onClick={async() => await setLocale(language.localeKey)}>
              {language.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
