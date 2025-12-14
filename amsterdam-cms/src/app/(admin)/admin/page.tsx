import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const [projects, vacancies, people, publications, expertises] = await Promise.all([
    prisma.project.count(),
    prisma.vacancy.count(),
    prisma.person.count(),
    prisma.publication.count(),
    prisma.expertise.count(),
  ]);

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header-inner">
          <img
            src="/gemeenteamsterdam.png"
            alt="Gemeente Amsterdam"
            className="admin-logo"
          />
          <nav className="admin-nav">
            <a href="/admin">Dashboard</a>
            <a href="/admin/mensen">Mensen</a>
            <a href="/admin/vacatures">Vacatures</a>
            <a href="/admin/projecten">Projecten</a>
            <a href="/admin/publicaties">Publicaties</a>
            <a href="/admin/expertise">Expertise</a>
          </nav>
        </div>
      </header>

      <main className="admin-content">
        <h1>Dashboard</h1>

        <div className="admin-stats">
          <div className="admin-stat">
            <span className="admin-stat-number">{projects}</span>
            <span className="admin-stat-label">Projecten</span>
          </div>

          <div className="admin-stat">
            <span className="admin-stat-number">{vacancies}</span>
            <span className="admin-stat-label">Vacatures</span>
          </div>

          <div className="admin-stat">
            <span className="admin-stat-number">{people}</span>
            <span className="admin-stat-label">Mensen</span>
          </div>

          <div className="admin-stat">
            <span className="admin-stat-number">{publications}</span>
            <span className="admin-stat-label">Publicaties</span>
          </div>

          <div className="admin-stat">
            <span className="admin-stat-number">{expertises}</span>
            <span className="admin-stat-label">Expertises</span>
          </div>
        </div>
      </main>
    </div>
  );
}