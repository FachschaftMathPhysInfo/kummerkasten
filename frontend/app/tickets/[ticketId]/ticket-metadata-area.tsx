import {format} from "date-fns";
import React from "react";
import {cn} from "@/lib/utils";

interface TicketMetadataArea {
  createdAt: Date
  lastModified: Date
}

export default function TicketMetadataArea({createdAt, lastModified}: TicketMetadataArea) {
  return (
    <div
      className={cn(
        "flex flex-col items-center w-full gap-1 py-5",
        "border-gray-600 text-muted-foreground border-t-gray-600 border-b border-t"
      )}
    >
      <div className="w-full flex justify-between items-center px-5">
        <span>Erstellt:</span>
        <div>{format(createdAt, "dd.MM.yy")}</div>
      </div>

      <div className="w-full flex justify-between items-center px-5">
        <span>Geändert:</span>
        <div>{format(lastModified, "dd.MM.yy")}</div>
      </div>
    </div>
  )
}