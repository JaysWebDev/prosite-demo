import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendReviewRequest } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { data: appt } = await supabase.from("appointments").select("*").eq("id", id).single();
  if (!appt) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await supabase.from("appointments").update({
    status: "completed",
    review_requested_at: new Date().toISOString(),
  }).eq("id", id);

  await sendReviewRequest({
    customer_name: appt.customer_name,
    customer_email: appt.customer_email,
    service: appt.service,
  });

  return NextResponse.json({ success: true });
}
