import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendBookingConfirmation, sendOwnerNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, email, service, date, time, address, notes } = body;

  if (!name || !phone || !email || !service || !date || !time) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      service,
      preferred_date: date,
      preferred_time: time,
      address: address || null,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json({ error: "Failed to save appointment" }, { status: 500 });
  }

  await Promise.all([
    sendBookingConfirmation({ customer_name: name, customer_email: email, service, preferred_date: date, preferred_time: time, address }),
    sendOwnerNotification({ id: data.id, customer_name: name, customer_email: email, customer_phone: phone, service, preferred_date: date, preferred_time: time, address, notes }),
  ]);

  return NextResponse.json({ success: true, id: data.id });
}
