import React from "react";
import clsx from "clsx";

interface SeperatorHorizontalProps {
    className?: string;
}

export function SeperatorHorizontal({className}: SeperatorHorizontalProps) {
    return (
        <div
            className={clsx(
                "h-px max-w bg-neutral-400 dark:bg-white/30 mx-5",
                className
            )}
        />
    );
}