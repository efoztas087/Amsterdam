"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import "./admin.css";

type Stats = {
  total: number;
  published: number;
  draft: number;
};

export default function AdminDashboardPage() {
  const supabase = createSupabaseBrowser();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, Stats>>({});
  
  async function getStats(table: string): Promise<Stats> {
    const { count: total } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true });

    const { count: published } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true })
      .eq("published", true);

    const { count: draft } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true })
      .eq("published", false);

    return {
      total: total ?? 0,
      published: published ?? 0,
      draft: draft ?? 0,
    };
  }

  useEffect(() => {
    async function loadAllStats() {
      setLoading(true);

      const result = {
        people: await getStats("people"),
        projects: await getStats("projects"),
        expertise: await getStats("expertise"),
        vacancies: await getStats("vacancies"),
        publications: await getStats("publications"),
      };

      setStats(result);
      setLoading(false);
    }

    loadAllStats();
  }, []);

  if (loading) return <p>Dashboard laden...</p>;

  return (
    <main className="admin-dashboard">
      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="dashboard-card">
            <h3>{key}</h3>
            <div className="dashboard-numbers">
              <div>
                <strong>{value.published}</strong>
                <span>Online</span>
              </div>
              <div>
                <strong>{value.draft}</strong>
                <span>Concept</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
