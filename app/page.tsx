"use client";

import { AboutMe } from "./components/Home/AboutMe";
import { ConsultationList } from "./components/Home/ConsultationList";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="flex min-h-screen min-w-full flex-col py-10 px-10 md:px-20 1 gap-10 md:gap-20">
      <AboutMe />
      <ConsultationList />
    </main>
  );
}
