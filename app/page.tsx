"use client";

import { UserRegistrationForm } from "@/app/components/users/UserRegistrationForm";
import { UserList } from "@/app/components/users/UserList";
import { useAuthenticationQuery } from "@/store/features/api/apiSlice";

export const dynamic = "force-dynamic";

export default function Home() {
  const { data } = useAuthenticationQuery();
  // console.log({ data });

  return (
    <main className="flex min-h-screen min-w-full flex-col p-10">
      <UserRegistrationForm />
      <UserList />
    </main>
  );
}
