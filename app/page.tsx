"use client";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="flex min-h-screen min-w-full flex-col p-10">
      <h2 className="text-3xl font-semibold ">О мне:</h2>
      <p className="text-lg">
        Меня зовут <span className="font-semibold">Татьяна</span>. Я -{" "}
        <span className="font-semibold">астролог</span> по финансам +
        <span className="font-semibold">профориентолог</span>.
      </p>
      <p className="text-lg italic">
        Я помогаю клиенту профессионально реализовать себя и найти нишу, которая
        будет приносить деньги.
      </p>
    </main>
  );
}
