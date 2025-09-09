"use client"

import {useEffect, useState} from "react";
import {useTheme} from "next-themes";
import {Button} from "@/components/ui/button";
import {Moon, Sun} from "lucide-react";
import {cn} from "@/lib/utils";

export default function ThemeSwitch({className}: {className?: string}) {
  const [mounted, setMounted] = useState(false)
  const {resolvedTheme, theme, setTheme} = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn('flex items-center aspect-square m-0', className)}
      data-cy={'theme-toggle'}
    >
      {theme === "light" ? (
        <Sun/>
      ) : (
        <Moon/>
      )}
    </Button>
  )
}