"use client";

import AboutSection from './form-about';
import FAQSection from './form-faq';
import FormUi from './form-ui'; 

export default function KummerkastenPage() {
  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8">

      <AboutSection />

     <div className="w-full max-w-2xl bg-gray-800 text-white rounded-lg p-6 my-8">
        <h2 className="text-xl font-semibold mb-4">Deine anonyme Nachricht</h2>
        <FormUi />
      </div>

      <FAQSection />
    </main>
  );
}
