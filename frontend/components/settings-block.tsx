import React, {cloneElement, isValidElement} from "react";
import {Card, CardContent, CardFooter, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

type SettingsBlockProps = {
    icon: React.ReactNode,
    title: string,
    children: React.ReactNode,
    onSave?: () => void;
    hasTriedToSubmit?: boolean;
    isValid?: boolean;
}

export function SettingsBlock({icon, title, children, onSave, hasTriedToSubmit, isValid}: SettingsBlockProps) {
    const sizedIcon =
        icon && isValidElement(icon)
            ? cloneElement(icon as React.ReactElement<any>, {
                className: `w-7 h-7 ${(icon.props as any).className ?? ""}`.trim(),
            })
            : icon;


    return (
        <Card className="m-8">
            <CardTitle className="flex items-center ml-6">
                <div className="mr-4">{sizedIcon}</div>
                <h2 className="text-lg font-semibold">{title}</h2>
            </CardTitle>
            <CardContent>
                {children}
            </CardContent>
            <CardFooter className="justify-end px-6">
                <Button onClick={onSave} type={"submit"} disabled={!isValid &&hasTriedToSubmit}>Speichern</Button>
            </CardFooter>
        </Card>
    )
}