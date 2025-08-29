import {Label} from "@/lib/graph/generated/graphql";
import {Badge} from "lucide-react";
import {calculateFontColor} from "@/lib/calculate-colors";
import React from "react";

interface LabelBadgeProps {
  label: Label
}

export default function LabelBadge({label}: LabelBadgeProps) {
  return (
    <Badge
      key={label.id}
      className="flex-shrink-0 justify-center px-3 py-1 md:w-full"
      style={{backgroundColor: label.color, color: calculateFontColor(label.color)}}
      data-cy={`label-badge-${label.id}`}
    >
      {label.name}
    </Badge>
  )
}