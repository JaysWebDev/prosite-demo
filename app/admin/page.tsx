"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Appointment = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  address: string | null;
  notes: string | null;
  status: string;
  invoice_amount: number | null;
  stripe_payment_link: string | null;
  paid_at: string | null;
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-purple-100 text-purple-800",
  invoiced: "bg-orange-100 text-orange-800",
  paid: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [invoiceAmounts, setInvoiceAmounts] = useState<Record<string, string>>({});
  const [working, setWorking] = useState<Record<string, boolean>>({});

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false });
    setAppointments(data || []);
    setLoading(false);
  }

  function checkKey() {
    if (key === "prosite2026") { setAuthed(true); load(); }
    else alert("Wrong key");
  }

  async function confirm(id: string) {
    setWorking({ ...working, [id]: true });
    await supabase.from("appointments").update({ status: "confirmed" }).eq("id", id);
    await load();
    setWorking({ ...working, [id]: false });
  }

  async function markComplete(id: string) {
    setWorking({ ...working, [id]: true });
    await fetch("/api/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    await load();
    setWorking({ ...working, [id]: false });
  }

  async function sendInvoice(id: string) {
    const amount = parseFloat(invoiceAmounts[id] || "0");
    if (!amount || amount <= 0) { alert("Enter invoice amount first"); return; }
    setWorking({ ...working, [id]: true });
    const res = await fetch("/api/invoice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, amount }) });
    const data = await res.json();
    if (data.payment_link && data.payment_link !== "#") {
      window.open(data.payment_link, "_blank");
    }
    await load();
    setWorking({ ...working, [id]: false });
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl border p-8 w-80 shadow-sm">
          <h1 className="font-bold text-gray-900 text-lg mb-4">Admin Access</h1>
          <input
            type="password"
            placeholder="Admin key"
            value={key}
            onChange={e => setKey(e.target.value)}
            onKeyDown={e => e.key === "Enter" && checkKey()}
            className="w-full border rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={checkKey} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold">
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-gray-900">Jay's Pro Wash — Admin</h1>
          <p className="text-gray-500 text-sm">{appointments.length} appointments</p>
        </div>
        <button onClick={load} className="text-sm text-blue-600 hover:underline">Refresh</button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <p className="text-gray-500 text-center py-12">Loading...</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No appointments yet.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map(appt => (
              <div key={appt.id} className="bg-white rounded-xl border p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-bold text-gray-900">{appt.customer_name}</h2>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[appt.status] || "bg-gray-100"}`}>
                        {appt.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{appt.service} · {appt.preferred_date} at {appt.preferred_time}</p>
                  </div>
                  <p className="text-xs text-gray-400">{new Date(appt.created_at).toLocaleDateString()}</p>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm mb-4">
                  <p><span className="text-gray-400">Email:</span> <a href={`mailto:${appt.customer_email}`} className="text-blue-600">{appt.customer_email}</a></p>
                  <p><span className="text-gray-400">Phone:</span> <a href={`tel:${appt.customer_phone}`} className="text-blue-600">{appt.customer_phone}</a></p>
                  {appt.address && <p><span className="text-gray-400">Address:</span> {appt.address}</p>}
                  {appt.notes && <p><span className="text-gray-400">Notes:</span> {appt.notes}</p>}
                  {appt.invoice_amount && <p><span className="text-gray-400">Invoice:</span> <strong>${appt.invoice_amount}</strong></p>}
                  {appt.stripe_payment_link && appt.stripe_payment_link !== "#" && (
                    <p><a href={appt.stripe_payment_link} target="_blank" className="text-blue-600 text-xs">View payment link ↗</a></p>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {appt.status === "pending" && (
                    <button onClick={() => confirm(appt.id)} disabled={working[appt.id]}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-lg font-medium disabled:opacity-50">
                      Confirm Appointment
                    </button>
                  )}
                  {(appt.status === "pending" || appt.status === "confirmed") && (
                    <button onClick={() => markComplete(appt.id)} disabled={working[appt.id]}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-1.5 rounded-lg font-medium disabled:opacity-50">
                      Mark Complete + Send Review Request
                    </button>
                  )}
                  {(appt.status === "completed" || appt.status === "confirmed") && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        placeholder="Amount"
                        value={invoiceAmounts[appt.id] || ""}
                        onChange={e => setInvoiceAmounts({ ...invoiceAmounts, [appt.id]: e.target.value })}
                        className="border rounded-lg px-3 py-1.5 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button onClick={() => sendInvoice(appt.id)} disabled={working[appt.id]}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1.5 rounded-lg font-medium disabled:opacity-50">
                        Send Invoice
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
