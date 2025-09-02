import React, { isValidElement, cloneElement } from "react";
import {SeperatorVertical} from "@/components/seperator-vertical";


interface ManagementPageProps {
    title: string,
    description: string,
    icon?: React.ReactNode
    actionButton?: React.ReactNode
}

export function ManagementPageHeader({title, description, icon, actionButton}: ManagementPageProps) {
    const sizedIcon =
        icon && isValidElement(icon)
            ? cloneElement(icon as React.ReactElement<{ className?: string }>, {
                className: `w-7 h-7 ${(icon.props as { className?: string })?.className ?? ""}`.trim(),
            })
            : icon;

    return (
        <div className="my-8 mx-10 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-y-2">
                <div className="flex items-center">
                    {sizedIcon && <div className="mr-1">{sizedIcon}</div>}
                    <SeperatorVertical/>
                    <div className="ml-2">
                        <h1 className="text-2xl font-bold">{title}</h1>
                        <p className="text-sm text-muted-foreground mt-1">{description}</p>
                    </div>
                </div>
                {actionButton && <div className="ml-auto">{actionButton}</div>}
            </div>
        </div>
    )
}