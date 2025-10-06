"use client";

import AboutSection from './form-about';
import FAQSection from './form-faq';
import FormUi from './form-ui';
import Image from 'next/image';
import ThemeSwitch from "@/components/theme-switch";
import {useTheme} from "next-themes";

export default function KummerkastenPage() {
  const {resolvedTheme} = useTheme();

  return (
    <main className={'min-h-screen w-full relative'}>
      <div
        className="flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 space-y-8">
        <ThemeSwitch
          className={'absolute top-1 left-1 mt-2 ml-2 lg:mt-4 lg:ml-4'}
        />

        <div className="flex items-center gap-5">
          <Image
            suppressHydrationWarning
            src={resolvedTheme === "dark" ? "/logo_dark.svg" :"/logo_light.svg"}
            alt="Kummerkasten Logo"
            width={512}
            height={512}
            className="w-16 h-16 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 mr-4"
          />
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-foreground"
          >
            Kummerkasten
          </h1>
        </div>

        <AboutSection/>

        <FormUi/>

        <FAQSection/>
      </div>
    </main>
  );
}
