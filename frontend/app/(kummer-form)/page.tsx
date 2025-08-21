"use client";

import AboutSection from './form-about';
import FAQSection from './form-faq';
import FormUi from './form-ui';
import Image from 'next/image';

export default function KummerkastenPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8">

      <div className="flex items-center mb-6">
         <Image
          src="/logo.png"
          alt="Kummerkasten Logo"
          width={1024}
          height={1024}
          className="w-16 h-16   sm:w-16 sm:h-16 lg:w-24 lg:h-24 xl:w-30 xl:h-30 rounded-full mr-4" 
        />
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-foreground">Kummerkasten</h1>
      </div>
      
      <AboutSection />

      <FormUi />

      <FAQSection />
    </main>
  );
}
