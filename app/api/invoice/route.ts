import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendInvoice } from "@/lib/email";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const { id, amount } = await req.json();
  if (!id || !amount) return NextResponse.json({ error: "Missing id or amount" }, { status: 400 });

  const { data: appt, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !appt) return NextResponse.json({ error: "Appointment not found" }, { status: 404 });

  let paymentLink = "#";

  if (process.env.STRIPE_SECRET_KEY) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const price = await stripe.prices.create({
      currency: "usd",
      unit_amount: Math.round(amount * 100),
      product_data: { name: `${appt.service} — ${process.env.BUSINESS_NAME}` },
    });
    const link = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      after_completion: { type: "redirect", redirect: { url: `${process.env.NEXT_PUBLIC_SITE_URL}/thank-you` } },
    });
    paymentLink = link.url;
  }

  await supabase.from("appointments").update({
    status: "invoiced",
    invoice_amount: amount,
    stripe_payment_link: paymentLink,
  }).eq("id", id);

  await sendInvoice({
    customer_name: appt.customer_name,
    customer_email: appt.customer_email,
    service: appt.service,
    invoice_amount: amount,
    stripe_payment_link: paymentLink,
  });

  return NextResponse.json({ success: true, payment_link: paymentLink });
}
