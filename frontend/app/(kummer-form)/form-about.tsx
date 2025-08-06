"use client";

import React from 'react';
import Image from 'next/image';

interface AboutSectionProps {}

const AboutSection: React.FC<AboutSectionProps> = () => {
  return (
    <section className="flex flex-col items-center justify-center p-8 bg-gray-800 text-white rounded-lg shadow-lg max-w-4xl mx-auto my-8">
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

      <div className="text-center mt-6">
        <h2 className="text-3xl font-semibold text-gray-200 mb-4">Was ist der Kummerkasten?</h2>
        <p className="text-lg text-gray-300 leading-relaxed text-muted-foreground">
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy 
          eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. 
          At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, 
          no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, 
          consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et 
          dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo 
          dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est 
          Lorem ipsum dolor sit amet.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
