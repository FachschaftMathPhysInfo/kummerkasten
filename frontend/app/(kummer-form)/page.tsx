"use client";

import AboutSection from './form-about';
import FAQSection from './form-faq';

export default function KummerkastenPage() {
  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8">

      <AboutSection />

     {/*hier dann noch kummerform*/}

      <FAQSection />
    </main>
  );
}
