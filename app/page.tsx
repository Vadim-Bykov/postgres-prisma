"use client";

import { AboutMe } from "./components/Home/AboutMe";
import { ConsultationList } from "./components/Home/ConsultationList";
import { HeaderContent } from "./components/Home/HeaderContent";
import { PageLayout } from "./components/templates/PageLayout";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <HeaderContent />

      <PageLayout className="px-10 md:px-20 py-10">
        <AboutMe />
        <ConsultationList />
      </PageLayout>
    </>
  );
}
