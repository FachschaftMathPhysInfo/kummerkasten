import React, { isValidElement, cloneElement } from "react";
import {SeperatorVertical} from "@/components/seperator-vertical";


interface ManagementPageProps {
    title: string,
    description: string,
    iconNode?: React.ReactNode
    actionButton?: React.ReactNode
}

export function ManagementPageHeader({title, description, iconNode, actionButton}: ManagementPageProps) {
    const sizedIcon =
        iconNode && isValidElement(iconNode)
            ? cloneElement(iconNode as React.ReactElement<any>, {
                className: `w-10 h-10 ${(iconNode.props as any).className ?? ""}`.trim(),
            })
            : iconNode;

    return (
        <div className="p-5 space-y-4">
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