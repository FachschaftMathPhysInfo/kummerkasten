import React, {cloneElement, isValidElement} from "react";
import {Card, CardContent, CardFooter, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {PageLoader} from "@/components/page-loader";
import {useTranslations} from "next-intl";

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
  const t = useTranslations("Components.SettingsBlock")
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
            <PageLoader compact message={t("loaders.fetching")}/>
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
            <PageLoader compact={true} message={t("loaders.saving")}/>
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
          {t("buttons.submit")}
        </Button>
      </CardFooter>
    </Card>
  )
}