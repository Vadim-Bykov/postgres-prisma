"use client";

import { UserList } from "@/app/components/users/UserList";
import { UserRegistrationForm } from "@/app/components/users/UserRegistrationForm";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="flex min-h-screen min-w-full flex-col p-10">
      <UserRegistrationForm />
      <UserList />
    </main>
  );
}
