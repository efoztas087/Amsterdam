import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email en wachtwoord zijn verplicht" },
      { status: 400 }
    );
  }

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    return NextResponse.json(
      { error: "Ongeldige inloggegevens" },
      { status: 401 }
    );
  }

  const valid = await bcrypt.compare(password, admin.password);

  if (!valid) {
    return NextResponse.json(
      { error: "Ongeldige inloggegevens" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });

  // simpele session cookie
  res.cookies.set("admin", admin.id, {
    httpOnly: true,
    path: "/",
  });

  return res;
}