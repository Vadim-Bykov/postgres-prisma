export const dynamic = "force-dynamic";

export default function Consultation({ params }: { params: { id: string } }) {
  return (
    <main className="flex min-h-screen min-w-full flex-col p-10">
      <h2 className="text-3xl font-semibold mb-5">
        Consultation id: {params?.id}
      </h2>
    </main>
  );
}
