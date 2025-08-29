import {Label} from "@/lib/graph/generated/graphql";
import {calculateFontColor} from "@/lib/calculate-colors";
import React from "react";
import {Badge} from "@/components/ui/badge";

interface LabelBadgeProps {
  label: Label
}

export default function LabelBadge({label}: LabelBadgeProps) {
  return (
    <Badge
      key={label.id}
      className="flex-shrink-0 justify-center px-3 py-1"
      style={{backgroundColor: label.color, color: calculateFontColor(label.color)}}
      data-cy={`label-badge-${label.id}`}
    >
      {label.name}
    </Badge>
  )
}