"use client";

import React, {useState} from "react"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Eye, EyeOff} from "lucide-react"
import {cn} from "@/lib/utils";

function shouldShowToggle(): boolean {
  const ua = navigator.userAgent.toLowerCase()
  const isMac = ua.includes("macintosh") || ua.includes("mac os x")
  const isWaterfox = ua.includes("waterfox")
  return !(isMac && isWaterfox)
}

export default function PasswordInput(props: React.ComponentProps<typeof Input>) {
  const [visible, setVisible] = useState(false)
  const showToggle = shouldShowToggle()

  return (
    <div className="relative w-full">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className={cn(showToggle && "pr-10", props.className)}
      />
      {showToggle && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0.5 top-1/2 -translate-y-1/2 px-2"
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <EyeOff className="h-4 aspect-square"/> : <Eye className="h-4 aspect-square"/>}
        </Button>
      )}
    </div>
  )
}
