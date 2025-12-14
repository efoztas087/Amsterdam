import { prisma } from "@/lib/prisma";

export default async function VacaturesAdminPage() {
  const vacatures = await prisma.vacancy.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1>Vacatures</h1>

      <a href="/admin/vacatures/nieuw">+ Nieuwe vacature</a>

      <ul>
        {vacatures.map((v) => (
          <li key={v.id}>
            <strong>{v.title}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}