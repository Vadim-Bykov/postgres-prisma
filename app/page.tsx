"use client";

import { PageLayout } from "@/app/_components/templates/PageLayout";
import { AboutMe } from "./_components/home-page/AboutMe";
import { HeaderContent } from "./_components/home-page/HeaderContent";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <HeaderContent />

      <PageLayout className="px-5 lg:px-20 py-10">
        <AboutMe />
      </PageLayout>
    </>
  );
}
