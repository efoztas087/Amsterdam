import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const vacancies = await prisma.vacancy.findMany();
  return NextResponse.json(vacancies);
}