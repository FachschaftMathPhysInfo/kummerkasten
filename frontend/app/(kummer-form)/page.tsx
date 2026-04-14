"use client";

import AboutSection from './form-about';
import FAQSection from './form-faq';
import FormUi from './form-ui';
import Image from 'next/image';
import ThemeSwitch from "@/components/theme-switch";
import LanguageSwitch from "@/components/language-switch"
import {useTheme} from "next-themes";
import {useTranslations} from "next-intl";

export default function KummerkastenPage() {
  const {resolvedTheme} = useTheme();
  const t = useTranslations("KummerkastenPage.Root")

  return (
    <main className={'min-h-screen w-full relative'}>
      <div
        className="flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 space-y-8">
        <div className={' w-full flex flex-row items-center justify-start m-0'}>
          <ThemeSwitch/>
          <LanguageSwitch/>
        </div>


        <div className="flex items-center gap-5">
          <Image
            suppressHydrationWarning
            src={resolvedTheme === "dark" ? "/logo_dark.svg" : "/logo_light.svg"}
            alt={t("logoAlt")}
            width={512}
            height={512}
            className="w-16 h-16 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 mr-4"
          />
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-foreground"
          >
            {t("title")}
          </h1>
        </div>

        <AboutSection/>

        <FormUi/>

        <FAQSection/>
      </div>
    </main>
  );
}
