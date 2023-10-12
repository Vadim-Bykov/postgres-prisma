"use client";

import { UserRegistrationForm } from "@/components/users/UserRegistrationForm";
import Table from "@/components/users/table";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="flex min-h-screen min-w-full flex-col p-10">
      <UserRegistrationForm />
      <Table />
    </main>
  );
}
