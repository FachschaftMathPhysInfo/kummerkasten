import React from "react";
import clsx from "clsx";

interface SeperatorVerticalProps {
  className?: string;
}

export function SeperatorVertical({className}: SeperatorVerticalProps) {
  return (
    <div
      className={clsx(
        "h-14 w-px bg-neutral-400 dark:bg-white/30 mx-2",
        className
      )}
    />
  );
}