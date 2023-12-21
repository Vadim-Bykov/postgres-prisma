"use client";

import { UserList } from "../components/users/UserList";

export const dynamic = "force-dynamic";

export default function AdminPanel() {
  return (
    <main className="flex min-h-screen min-w-full flex-col p-10">
      <h2 className="text-3xl font-semibold mb-5">Admin panel</h2>
      <UserList />
    </main>
  );
}
