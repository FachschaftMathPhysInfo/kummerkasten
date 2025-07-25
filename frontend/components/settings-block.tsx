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
    dataCy?: string;
}

export function SettingsBlock({icon, title, children, onSave, hasTriedToSubmit, isValid, dataCy}: SettingsBlockProps) {
    const sizedIcon =
        icon && isValidElement(icon)
            ? cloneElement(icon as React.ReactElement<{ className?: string }>, {
                className: `w-7 h-7 ${(icon.props as { className?: string })?.className ?? ""}`.trim(),
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
                <Button type={"submit"} disabled={!isValid &&hasTriedToSubmit} data-cy={dataCy}>Speichern</Button>
            </CardFooter>

        </Card>
    )
}