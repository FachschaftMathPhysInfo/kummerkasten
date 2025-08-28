"use client";

import React from 'react';
import {Card, CardContent, CardTitle} from "@/components/ui/card";

export default function AboutSection () {
  return (
      <Card className="flex flex-col items-center justify-center bg-kummerkasten-highlight-bg border-kummerkasten-highlight-bg text-foreground rounded-lg shadow-lg max-w-4xl mx-auto p-6 my-4">
        <CardTitle className='text-3xl text-center font-semibold text-foreground mb-2'>Was ist der Kummerkasten?</CardTitle>
        <CardContent>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
            eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
            At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
            no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
            consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
            dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
            dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet.
          </p>
        </CardContent>
      </Card>
  );
};
