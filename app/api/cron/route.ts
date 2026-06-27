import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendRebookingReminder } from "@/lib/email";

// Vercel cron: runs monthly — finds paid appointments ~6 months old that haven't been re-contacted
export async function GET() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("status", "paid")
    .is("rebooking_sent_at", null)
    .lt("paid_at", sixMonthsAgo.toISOString());

  if (!appointments?.length) return NextResponse.json({ sent: 0 });

  let sent = 0;
  for (const appt of appointments) {
    await sendRebookingReminder({
      customer_name: appt.customer_name,
      customer_email: appt.customer_email,
      service: appt.service,
    });
    await supabase.from("appointments").update({
      rebooking_sent_at: new Date().toISOString(),
    }).eq("id", appt.id);
    sent++;
  }

  return NextResponse.json({ sent });
}
