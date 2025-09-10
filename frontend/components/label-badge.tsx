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
      className="px-3 py-1 max-w-full"
      style={{backgroundColor: label.color, color: calculateFontColor(label.color)}}
      data-cy={`label-badge-${label.id}`}
    >
      <span className={'block truncate'} title={label.name}>{label.name}</span>
    </Badge>
  )
}