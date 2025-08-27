import {Label} from "@/lib/graph/generated/graphql";
import {Badge} from "@/components/ui/badge";
import React from "react";

interface LabelAreaProps {
  labels: Label[]
}

export default function LabelArea({labels}: LabelAreaProps) {
  return (
    <div className="flex flex-col gap-2 overflow-y-scroll grow items-end">
      {labels.map((label) => (
        <Badge
          key={label.id}
          className="text-white max-w-full px-1"
          style={{backgroundColor: label.color}}
          data-cy={`ticket-label-${label.id}`}
        >
          <span className="truncate max-w-full px-1">{label.name}</span>
        </Badge>
      ))}
    </div>

  )
}