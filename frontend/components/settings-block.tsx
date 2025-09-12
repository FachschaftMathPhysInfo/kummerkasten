import React, {cloneElement, isValidElement} from "react";
import {Card, CardContent, CardFooter, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {PageLoader} from "@/components/page-loader";

type SettingsBlockProps = {
  icon: React.ReactNode,
  title: string,
  children: React.ReactNode,
  hasTriedToSubmit?: boolean;
  isSaving?: boolean;
  isLoading?: boolean;
  isValid?: boolean;
  isDirty?: boolean;
  dataCy?: string;
}

export function SettingsBlock({
                                icon,
                                title,
                                children,
                                hasTriedToSubmit,
                                isSaving,
                                isLoading,
                                isValid,
                                isDirty,
                                dataCy
                              }: SettingsBlockProps) {
  const sizedIcon =
    icon && isValidElement(icon)
      ? cloneElement(icon as React.ReactElement<{ className?: string }>, {
        className: `w-7 h-7 ${(icon.props as { className?: string })?.className ?? ""}`.trim(),
      })
      : icon;

  if (isLoading) {
    return (
      <Card className="m-8">
        <CardTitle className="flex items-center ml-6">
          <div className="mr-4">{sizedIcon}</div>
          <h2 className="text-lg font-semibold">{title}</h2>
        </CardTitle>
        <CardContent>
          <div className="py-8 flex justify-center">
            <PageLoader compact message="Daten werden geladen..."/>
          </div>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className="m-8">
      <CardTitle className="flex items-center ml-6">
        <div className="mr-4">{sizedIcon}</div>
        <h2 className="text-lg font-semibold">{title}</h2>
      </CardTitle>
      <CardContent>
        {isSaving ? (
          <div className="py-8 flex justify-center">
            <PageLoader compact={true} message="Speichern..."/>
          </div>
        ) : (
          <div className="space-y-4">
            {children}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end px-6">
        <Button
          type={"submit"}
          disabled={!isDirty || !isValid && hasTriedToSubmit}
          data-cy={dataCy}
        >
          Speichern
        </Button>
      </CardFooter>
    </Card>
  )
}