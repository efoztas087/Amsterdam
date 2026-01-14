import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    const vacancyId = formData.get("vacancyId") as string | null;
    const cvFile = formData.get("cv") as File | null;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Ontbrekende velden" },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY ontbreekt");
      return NextResponse.json(
        { error: "Mailservice niet geconfigureerd" },
        { status: 500 }
      );
    }

    const supabase = await createSupabaseServer();
    const resend = new Resend(process.env.RESEND_API_KEY);

    // 1️⃣ Opslaan in database
    const { error: insertError } = await supabase
      .from("applications")
      .insert({
        name,
        email,
        message,
        vacancy_id: vacancyId || null,
      });

    if (insertError) {
      console.error(insertError);
      return NextResponse.json(
        { error: "Database fout" },
        { status: 500 }
      );
    }

    // 2️⃣ CV attachment
    const attachments: any[] = [];

    if (cvFile) {
      const buffer = Buffer.from(await cvFile.arrayBuffer());
      attachments.push({
        filename: cvFile.name,
        content: buffer,
      });
    }

    // 3️⃣ Mail versturen
    await resend.emails.send({
      from: "Sollicitaties <onboarding@resend.dev>",
      to: ["37388@ma-web.nl"],
      subject: "Nieuwe sollicitatie ontvangen",
      html: `
        <h2>Nieuwe sollicitatie</h2>
        <p><strong>Naam:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Vacature:</strong> ${vacancyId ?? "Open sollicitatie"}</p>
        <p><strong>Motivatie:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
      attachments,
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}