import { createClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase/server";

export type AdminUser = { id: string; email: string } | null;

/**
 * Attempt to resolve the effective admin user for incoming requests.
 * Strategy: 1) auth.getUser() via server client (cookies)
 *           2) Authorization: Bearer <token> header
 *           3) fallback parse sb auth cookie (dev)
 */
export async function getEffectiveAdminUser(req?: Request): Promise<AdminUser> {
  try {
    const userSupabase = await createSupabaseServer();
    const { data: { user } } = await userSupabase.auth.getUser();
    if (user) return { id: user.id, email: user.email ?? "" };
  } catch (e) {
    // ignore and continue to header fallback
  }

  if (req) {
    try {
      const authHeader = req.headers.get('authorization') || req.headers.get('Authorization') || '';
      if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice('Bearer '.length);
        try {
          const tmp = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
            global: { headers: { Authorization: `Bearer ${token}` } }
          });
          const { data } = await tmp.auth.getUser();
          const u = data?.user ?? null;
          if (u) return { id: u.id, email: u.email ?? "" };
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // fallback: try to parse sb auth cookie server-side via next/headers
  try {
    const c = await (await import('next/headers')).cookies();
    const tokenCookie = (c.getAll() || []).find((ck: any) => ck.name.includes('auth-token') || ck.name.includes('sb-'));
    if (tokenCookie?.value) {
      const raw = tokenCookie.value;
      const prefix = 'base64-';
      const b64 = raw.startsWith(prefix) ? raw.slice(prefix.length) : raw;
      const decoded = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
      const u = decoded?.user ?? null;
      if (u) return { id: u.id, email: u.email ?? "" };
    }
  } catch (e) {
    // ignore
  }

  return null;
}

export function isAdminEmail(email: string | undefined | null) {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS || "").split(',').map(s => s.trim()).filter(Boolean);
  return list.includes(email);
}
