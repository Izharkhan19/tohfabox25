"use client";
import { useState } from "react";
import Link from "next/link";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  PaperAirplaneIcon
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { createCustomRequest } from "../../api-services/apiService";

export default function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderId: "",
    subject: "Order Inquiry",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const contactEmail = "tohfabox25@gmail.com";
  const contactPhone = "+917737510030";
  const contactPhoneDisplay = "+91 77375 10030";

  const faqs = [
    {
      q: "How long does it take to craft and deliver custom orders?",
      a: "Standard in-stock catalog products ship within 24–48 hours. Custom resin art typically takes 3–5 working days for personalized pouring, UV stabilization, and complete multi-layer curing. Hand-knit crochet orders require 2–4 days. Once dispatched, domestic courier transit takes 3–5 business days depending on your pincode."
    },
    {
      q: "Can I customize the colors, names, and photos in my gift?",
      a: "Yes! Every custom piece can be personalized with photos, names, dates, quotes, and custom color palettes. You can mention your customization notes during checkout, submit via our Custom Orders page, or chat directly with our design artisans on WhatsApp."
    },
    {
      q: "Do you offer luxury gift packaging and handwritten cards?",
      a: "Yes, every Artistary Crafts piece comes with complimentary premium gift wrapping, velvet/satin accents, and a custom handwritten greeting card. You can provide your greeting message at checkout."
    },
    {
      q: "How do I track my order status?",
      a: "As soon as your package is dispatched, tracking details with a direct tracking link are sent to your registered phone number (via WhatsApp & SMS) and email. You can also view live status under My Account & Orders on our website."
    },
    {
      q: "What is your return or replacement policy?",
      a: "We provide a 100% transit guarantee. If your handcrafted item arrives damaged or defective, please share an unboxing video within 48 hours of delivery to our support WhatsApp or email, and we will issue an immediate priority remake or refund."
    },
    {
      q: "What payment methods are supported?",
      a: "We support all major payment options across India: UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and partial Advance/Cash on Delivery (COD) via WhatsApp confirmation."
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setSubmitting(true);
    try {
      // Record inquiry in backend
      await createCustomRequest({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        details: `[Support Inquiry: ${formData.subject}] OrderID: ${formData.orderId || "N/A"} - Message: ${formData.message}`
      });

      setSubmitted(true);
      toast.success("Inquiry sent successfully! Our team will contact you shortly.");
    } catch {
      toast.info("Message noted! You can also chat directly with us on WhatsApp.");
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppChat = () => {
    const text = encodeURIComponent(
      `Hello Artistary Crafts Team!\nName: ${formData.name || "Customer"}\nInquiry: ${formData.subject}\nOrder ID: ${formData.orderId || "N/A"}\nMessage: ${formData.message || "I have an inquiry regarding your products."}`
    );
    window.open(`https://wa.me/917737510030?text=${text}`, "_blank");
  };

  return (
    <div className="bg-[#fdfbf9] min-h-screen text-[#12343b] selection:bg-[#e1b382]/30">
      {/* Hero Banner */}
      <section className="relative bg-[#12343b] text-white py-12 sm:py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#e1b382]/15 text-[#e1b382] border border-[#e1b382]/30 text-xs font-bold uppercase tracking-widest mb-4">
            <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" />
            24/7 Dedicated Assistance
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-serif tracking-tight mb-3 sm:mb-4 text-[#fdfbf9]">
            Customer Support &amp; Help Desk
          </h1>
          <p className="text-xs sm:text-base text-[#fdfbf9]/80 max-w-xl mx-auto leading-relaxed">
            Have a question about an order, custom gift design, or delivery timelines? Our artisan support team is here to assist you.
          </p>
        </div>
      </section>

      {/* Main Support Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Phone & WhatsApp */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-gray-100 hover:border-[#e1b382]/60 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <PhoneIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-serif text-[#12343b] mb-1">
                Call &amp; WhatsApp
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Direct helpline for instant custom consultations and urgent order updates.
              </p>
              <p className="text-sm font-bold text-[#12343b] tracking-wide">
                {contactPhoneDisplay}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">Mon – Sat: 9:00 AM – 8:00 PM IST</p>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center gap-2">
              <a
                href={`tel:${contactPhone}`}
                className="flex-1 text-center py-2 px-3 rounded-xl bg-[#12343b] text-white text-xs font-bold hover:bg-[#1a4a55] transition-colors"
              >
                Call Now
              </a>
              <button
                type="button"
                onClick={handleWhatsAppChat}
                className="flex-1 text-center py-2 px-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
              >
                WhatsApp
              </button>
            </div>
          </div>

          {/* Card 2: Email Support */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-gray-100 hover:border-[#e1b382]/60 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <EnvelopeIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-serif text-[#12343b] mb-1">
                Official Email
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Send us inquiries, photos for custom artwork, or bulk corporate gifting proposals.
              </p>
              <p className="text-sm font-bold text-[#12343b] break-all">
                {contactEmail}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">Average response: Under 2 hours</p>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-100">
              <a
                href={`mailto:${contactEmail}?subject=Support%20Inquiry%20-%20Artistary%20Crafts`}
                className="block text-center py-2 px-3 rounded-xl bg-[#12343b] text-white text-xs font-bold hover:bg-[#1a4a55] transition-colors"
              >
                Send Email &rarr;
              </a>
            </div>
          </div>

          {/* Card 3: Studio Location */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-gray-100 hover:border-[#e1b382]/60 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <MapPinIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-serif text-[#12343b] mb-1">
                Artisan Atelier
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Crafted with care in the Pink City and shipped safely across all pincodes in India.
              </p>
              <p className="text-sm font-bold text-[#12343b]">
                Jaipur, Rajasthan, India
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">Pan-India Courier &amp; Express Delivery</p>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-100">
              <Link
                href="/products"
                className="block text-center py-2 px-3 rounded-xl border border-gray-200 text-[#12343b] text-xs font-bold hover:border-[#12343b] transition-colors"
              >
                Browse Catalog &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Information Split */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <div className="mb-6">
              <span className="text-xs font-bold tracking-widest uppercase text-[#c89666]">
                Message Our Team
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#12343b] mt-1">
                Send Us an Inquiry
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Fill in the details below and we will get back to you promptly.
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-10 px-4 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-3">
                <CheckCircleIcon className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-gray-800">Thank You!</h3>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Your message has been received. Our team will review your inquiry and reach out via email or phone.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", phone: "", orderId: "", subject: "Order Inquiry", message: "" });
                    }}
                    className="text-xs font-bold text-[#12343b] underline"
                  >
                    Send another message
                  </button>
                  <button
                    type="button"
                    onClick={handleWhatsAppChat}
                    className="text-xs font-bold text-emerald-700 underline"
                  >
                    Chat on WhatsApp
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#12343b] focus:ring-1 focus:ring-[#12343b] outline-none transition text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#12343b] focus:ring-1 focus:ring-[#12343b] outline-none transition text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#12343b] focus:ring-1 focus:ring-[#12343b] outline-none transition text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Order ID (If Applicable)
                    </label>
                    <input
                      type="text"
                      value={formData.orderId}
                      onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                      placeholder="e.g. #ORD-1042"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#12343b] focus:ring-1 focus:ring-[#12343b] outline-none transition text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Subject / Topic
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#12343b] focus:ring-1 focus:ring-[#12343b] outline-none transition text-xs bg-white"
                  >
                    <option value="Order Inquiry">Order Status &amp; Tracking</option>
                    <option value="Custom Gift Design">Custom Gift Design Consultation</option>
                    <option value="Bulk / Corporate Gifting">Bulk / Corporate Gifting</option>
                    <option value="Returns / Replacement">Damaged Delivery / Replacement</option>
                    <option value="General Feedback">General Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry or custom gift requirements in detail..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#12343b] focus:ring-1 focus:ring-[#12343b] outline-none transition text-xs"
                  ></textarea>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#12343b] text-white text-xs font-bold shadow-md hover:bg-[#1a4a55] transition-all active:scale-95 disabled:opacity-50"
                  >
                    <PaperAirplaneIcon className="w-4 h-4" />
                    {submitting ? "Sending..." : "Submit Inquiry"}
                  </button>
                  <button
                    type="button"
                    onClick={handleWhatsAppChat}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700 transition-all active:scale-95"
                  >
                    Instant WhatsApp Chat &rarr;
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right FAQ Accordion (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#c89666]">
                Frequently Asked
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#12343b] mt-1 mb-2">
                Quick Answers
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Answers to common queries regarding ordering, personalization, and deliveries.
              </p>
            </div>

            <div className="space-y-2.5">
              {faqs.map((faq, idx) => (
                <div
                  key={faq.q}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-[#12343b] hover:bg-gray-50/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDownIcon
                      className={`w-4 h-4 text-[#c89666] shrink-0 transition-transform duration-200 ${
                        openFaq === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-3.5 pb-4 sm:px-4 text-xs text-gray-600 leading-relaxed border-t border-gray-50 pt-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Track & Order Banner */}
            <div className="p-4 rounded-2xl bg-[#12343b] text-white space-y-2 text-xs">
              <p className="font-bold text-sm text-[#e1b382]">Already placed an order?</p>
              <p className="text-gray-300">
                You can track package dispatch, view invoices, or re-order directly from your dashboard.
              </p>
              <Link
                href="/orders"
                className="inline-block mt-1 font-bold text-[#e1b382] hover:underline"
              >
                Go to My Orders &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

