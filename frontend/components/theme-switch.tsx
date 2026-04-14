"use client"

import {useEffect, useRef} from "react";
import {useTheme} from "next-themes";
import {Button} from "@/components/ui/button";
import {Moon, Sun} from "lucide-react";
import {cn} from "@/lib/utils";

export default function ThemeSwitch({className}: { className?: string }) {
  const mounted = useRef(false);
  const {resolvedTheme, theme, setTheme} = useTheme()

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
    <Button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      variant={"ghost"}
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