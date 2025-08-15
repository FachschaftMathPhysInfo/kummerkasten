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
          className="w-24 h-24 rounded-full mr-4"
        />
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-100">Kummerkasten</h1>
      </div>
      
      <AboutSection />

      <FormUi />

      <FAQSection />
    </main>
  );
}
