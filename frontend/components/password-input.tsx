"use client";

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import {cn} from "@/lib/utils";

export default function PasswordInput(props: React.ComponentProps<typeof Input>) {
  const [visible, setVisible] = useState(false)
  const [showToggle, setShowToggle] = useState(true)

  // On MacOs + Waterfox the vendor implements its own toggle.
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase()
    const isMac = ua.includes("macintosh") || ua.includes("mac os x")
    const isWaterfox = ua.includes("waterfox")

    if (isMac && isWaterfox) {
      setShowToggle(false)
    }
  }, [])

  return (
    <div className="relative w-full">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className={cn(showToggle && "pr-10")}
      />
      {showToggle && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 px-2"
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      )}
    </div>
  )
}
