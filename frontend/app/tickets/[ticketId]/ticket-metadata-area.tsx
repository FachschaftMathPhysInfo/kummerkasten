import {format} from "date-fns";
import React from "react";
import {cn} from "@/lib/utils";
import {useTranslations} from "next-intl";

interface TicketMetadataArea {
  createdAt: Date
  lastModified: Date
}

export default function TicketMetadataArea({createdAt, lastModified}: TicketMetadataArea) {
  const tc = useTranslations("Commons")

  return (
    <div
      className={cn(
        "flex flex-col items-center w-full gap-1 py-5",
        "border-gray-600 text-muted-foreground border-t-gray-600 border-b border-t"
      )}
    >
      <div className="w-full flex justify-between items-center px-5">
        <span>{tc("words.created")}:</span>
        <div>{format(createdAt, "dd.MM.yy")}</div>
      </div>

      <div className="w-full flex justify-between items-center px-5">
        <span>{tc("words.modified")}</span>
        <div>{format(lastModified, "dd.MM.yy")}</div>
      </div>
    </div>
  )
}