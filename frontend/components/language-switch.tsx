"use client"

import {useEffect, useRef} from "react";
import {Button} from "@/components/ui/button";
import {Globe} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {setLocale} from "@/lib/cookies";
import {AVAILABLE_LANGUAGES} from "@/lib/constants/languages";


export default function LanguageSwitch({className}: { className?: string }) {
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
        <Button className={className} variant="ghost"><Globe/></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {AVAILABLE_LANGUAGES.map(language => (
            <DropdownMenuItem key={language.localeKey} onClick={async() => await setLocale(language.localeKey)}>
              {language.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}