"use client";

import { useState } from "react";

const PHONE = "(555) 280-9274";
const EMAIL = "jays.website.dev@gmail.com";
const BUSINESS = "Jay's Pro Wash";

const SERVICES = [
  {
    icon: "🏠",
    title: "House Soft Washing",
    desc: "Safe low-pressure cleaning removes mold, mildew, and algae from siding, stucco, and brick without damage.",
    price: "From $175",
  },
  {
    icon: "🛣️",
    title: "Driveway & Walkway",
    desc: "High-pressure concrete and paver cleaning that removes years of staining, oil, and embedded grime.",
    price: "From $99",
  },
  {
    icon: "🪵",
    title: "Deck & Fence Restoration",
    desc: "Wood-safe washing that preps surfaces for staining or sealing, removing gray weathering and green algae.",
    price: "From $149",
  },
  {
    icon: "🏪",
    title: "Commercial Cleaning",
    desc: "Storefronts, parking lots, and building exteriors. Scheduled maintenance contracts available.",
    price: "Custom quote",
  },
];

const REVIEWS = [
  {
    name: "Sarah M.",
    stars: 5,
    text: "My house looks brand new. Jay's crew was on time, professional, and the results were incredible. Already booked them for next spring.",
    city: "Local homeowner",
  },
  {
    name: "Tom R.",
    stars: 5,
    text: "They did my driveway, front walk, and back patio in one visit. Price was fair and they cleaned up completely before leaving.",
    city: "Local homeowner",
  },
  {
    name: "Linda K.",
    stars: 5,
    text: "I was skeptical a power wash could get my deck that clean without damaging the wood. I was wrong. Stunning difference.",
    city: "Local homeowner",
  },
];

function Stars({ n }: { n: number }) {
  return <span className="text-yellow-400 text-sm">{"★".repeat(n)}</span>;
}

const TIME_SLOTS = ["7:00 AM","8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"];
const TODAY = new Date().toISOString().split("T")[0];

function BookingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", phone: "", email: "", service: "",
    date: "", time: "", address: "", notes: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please call us directly.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Request received!</h3>
        <p className="text-gray-600">
          We'll reach out within 2 hours to confirm your appointment.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          required
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          required
          type="tel"
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <input
        required
        type="email"
        placeholder="Email address"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        required
        value={form.service}
        onChange={(e) => setForm({ ...form, service: e.target.value })}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select a service...</option>
        <option>House Soft Washing</option>
        <option>Driveway &amp; Walkway</option>
        <option>Deck &amp; Fence Restoration</option>
        <option>Commercial Cleaning</option>
      </select>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Preferred Date</label>
          <input
            required
            type="date"
            min={TODAY}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Preferred Time</label>
          <select
            required
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select time...</option>
            {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <input
        placeholder="Property address (optional)"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        rows={2}
        placeholder="Anything else we should know? (optional)"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Request Free Quote"}
      </button>
      <p className="text-xs text-gray-400 text-center">
        No spam. We reply within 2 hours during business hours.
      </p>
    </form>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur border-b border-gray-100 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-bold text-blue-700 text-lg">{BUSINESS}</span>
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#services" className="hover:text-blue-600 transition-colors">
              Services
            </a>
            <a href="#reviews" className="hover:text-blue-600 transition-colors">
              Reviews
            </a>
            <a href="#book" className="hover:text-blue-600 transition-colors">
              Book
            </a>
          </div>
          <a
            href={`tel:${PHONE}`}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {PHONE}
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white">
        <div className="max-w-5xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span>⭐</span> 5.0 rating · 200+ jobs completed
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Professional Power Washing You Can Trust
            </h1>
            <p className="text-blue-100 text-lg md:text-xl mb-8 leading-relaxed">
              Licensed, insured, and locally owned. We restore driveways, siding,
              decks, and more — delivering results that last.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#book"
                className="bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl text-center hover:bg-blue-50 transition-colors"
              >
                Get a Free Quote
              </a>
              <a
                href={`tel:${PHONE}`}
                className="border border-white/40 text-white font-semibold px-8 py-3.5 rounded-xl text-center hover:bg-white/10 transition-colors"
              >
                Call Us Now
              </a>
            </div>
          </div>
        </div>
        {/* Stats bar */}
        <div className="bg-blue-800/40 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">200+</div>
              <div className="text-blue-200 text-sm">Jobs Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold">5.0★</div>
              <div className="text-blue-200 text-sm">Average Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold">Same Day</div>
              <div className="text-blue-200 text-sm">Quotes Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What We Clean</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Every job is fully insured. We use the right technique for every surface
              — low pressure where it's needed, high pressure where it isn't.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">{s.title}</h3>
                  <span className="text-blue-600 font-semibold text-sm whitespace-nowrap ml-2">
                    {s.price}
                  </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Homeowners Choose Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                🛡️
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Fully Insured</h3>
              <p className="text-gray-500 text-sm">
                $2M liability coverage on every job. Your home is protected.
              </p>
            </div>
            <div>
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                ⚡
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Fast Response</h3>
              <p className="text-gray-500 text-sm">
                Free quote within 2 hours. Most jobs scheduled within the week.
              </p>
            </div>
            <div>
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                ✅
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Satisfaction Guaranteed</h3>
              <p className="text-gray-500 text-sm">
                Not happy? We come back and make it right. No questions asked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What Customers Say</h2>
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
              <Stars n={5} /> <span>5.0 average from 200+ reviews</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {REVIEWS.map((r) => (
              <div
                key={r.name}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
              >
                <Stars n={r.stars} />
                <p className="text-gray-600 text-sm leading-relaxed mt-3 mb-4">
                  "{r.text}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{r.name}</div>
                  <div className="text-gray-400 text-xs">{r.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="book" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Get Your Free Quote
              </h2>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Fill out the form and we'll get back to you within 2 hours with a
                firm price — no vague estimates, no surprises on invoice day.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-blue-500 font-bold">✓</span> Free,
                  no-obligation quote
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-blue-500 font-bold">✓</span> Same-week
                  scheduling available
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-blue-500 font-bold">✓</span> Pay after
                  the job is done
                </div>
              </div>
              <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-sm font-semibold text-gray-700 mb-1">
                  Prefer to call?
                </div>
                <a
                  href={`tel:${PHONE}`}
                  className="text-blue-600 font-bold text-lg hover:underline"
                >
                  {PHONE}
                </a>
                <div className="text-gray-400 text-xs mt-1">Mon–Sat 7am–6pm</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="font-bold text-lg mb-2">{BUSINESS}</div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Licensed &amp; insured power washing. Locally owned and operated.
              </p>
            </div>
            <div>
              <div className="font-semibold mb-3">Services</div>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>House Soft Washing</li>
                <li>Driveway &amp; Walkway</li>
                <li>Deck &amp; Fence</li>
                <li>Commercial</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-3">Contact</div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href={`tel:${PHONE}`}
                    className="hover:text-white transition-colors"
                  >
                    {PHONE}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="hover:text-white transition-colors"
                  >
                    {EMAIL}
                  </a>
                </li>
                <li className="text-gray-500">Mon–Sat 7am–6pm</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
            <span>
              © {new Date().getFullYear()} {BUSINESS}. All rights reserved.
            </span>
            <span>Licensed · Insured · Locally Owned</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
