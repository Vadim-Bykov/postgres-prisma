"use client";

import { AboutMe } from "./components/Home/AboutMe";
import { HeaderContent } from "./components/Home/HeaderContent";
import { PageLayout } from "./components/templates/PageLayout";

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
