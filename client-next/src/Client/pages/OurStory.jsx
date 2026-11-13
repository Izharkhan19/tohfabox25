"use client";
import Link from "next/link";
import {
  SparklesIcon,
  HeartIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowRightIcon,
  GiftIcon
} from "@heroicons/react/24/outline";

export default function OurStory() {
  const pillars = [
    {
      icon: SparklesIcon,
      title: "Handcrafted With Soul",
      desc: "Every single piece — from floral resin clocks to delicate crochet creations — is individually sculpted and poured with obsessive attention to detail."
    },
    {
      icon: HeartIcon,
      title: "Preserving Cherished Memories",
      desc: "We turn ephemeral moments, wedding varmalas, newborn keepsakes, and personalized messages into timeless heirlooms that last lifetimes."
    },
    {
      icon: ShieldCheckIcon,
      title: "Archival Quality Materials",
      desc: "We formulate with UV-resistant, non-yellowing crystalline resin and high-grade combed yarns to ensure vibrant longevity and enduring beauty."
    },
    {
      icon: GiftIcon,
      title: "Luxury Unboxing Experience",
      desc: "Gifting should feel extraordinary from the first touch. Every order arrives impeccably packaged with customized handwritten greeting cards."
    }
  ];

  const milestones = [
    {
      step: "01",
      title: "The Spark of Inspiration",
      desc: "Founded in Jaipur, the cultural capital of Indian craft, Artistary Crafts (Tohfabox) began as an intimate atelier dedicated to reviving handcrafted luxury in a world of mass production."
    },
    {
      step: "02",
      title: "Mastering the Dual Mediums",
      desc: "We blended two distinct artisanal disciplines: the fluid, glass-like alchemy of crystalline resin art with the tactile, comforting warmth of handmade crochet."
    },
    {
      step: "03",
      title: "Personalized for Every Celebration",
      desc: "From birthdays and anniversaries to wedding hampers and corporate tokens, over 5,000+ happy customers have trusted us to craft gifts that speak louder than words."
    },
    {
      step: "04",
      title: "Our Continuing Promise",
      desc: "We pledge to keep every creation authentic, ethical, and tailored to your unique love stories. No factory shortcuts — just pure passion and genuine craftsmanship."
    }
  ];

  return (
    <div className="bg-[#fdfbf9] min-h-screen text-[#12343b] selection:bg-[#e1b382]/30">
      {/* Hero Section */}
      <section className="relative bg-[#12343b] text-white py-12 sm:py-20 md:py-28 overflow-hidden">
        {/* Subtle decorative background ambient glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#e1b382]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#c89666]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#e1b382]/15 text-[#e1b382] border border-[#e1b382]/30 text-xs font-bold uppercase tracking-widest mb-4">
            <SparklesIcon className="w-3.5 h-3.5" />
            Our Story & Heritage
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-black font-serif tracking-tight leading-tight md:leading-tight mb-4 sm:mb-6 text-[#fdfbf9]">
            Where Passion Meets <span className="text-[#e1b382]">Artistry</span> &amp; Meaningful Gifting
          </h1>
          <p className="text-xs sm:text-base md:text-lg text-[#fdfbf9]/80 max-w-2xl mx-auto leading-relaxed">
            The story of <strong>Artistary Crafts</strong> (Tohfabox) — transforming delicate threads and crystalline resin into heirloom gifts that capture your most treasured moments in perfect clarity.
          </p>
        </div>
      </section>

      {/* Origin Story Narrative */}
      <section className="py-10 sm:py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div className="space-y-4 sm:space-y-6">
            <span className="text-xs font-bold tracking-widest uppercase text-[#c89666]">
              A Craft Born From Passion
            </span>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black font-serif text-[#12343b] leading-snug">
              Every creation starts with an emotion and a blank canvas.
            </h2>
            <div className="space-y-3.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
              <p>
                In a world crowded with impersonal, factory-stamped items, we set out to build something that feels deeply human. What began in an artisan home studio in Jaipur has blossomed into a bespoke gifting atelier cherished by people across the country.
              </p>
              <p>
                Whether it&apos;s encapsulating wedding petals inside a glass-finish resin clock, hand-weaving a cozy crochet bouquet that never wilts, or designing custom wooden nameplates, each order is treated as a masterwork.
              </p>
              <p className="font-medium text-[#12343b] italic border-l-2 border-[#e1b382] pl-3">
                &ldquo;A truly memorable gift is not defined by its price tag, but by the love and mindfulness poured into its making.&rdquo;
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#12343b] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#1a4a55] transition-all active:scale-95"
              >
                Explore Gallery
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                href="/custom-orders"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#12343b]/20 bg-white text-[#12343b] text-xs sm:text-sm font-bold shadow-sm hover:border-[#12343b] transition-all active:scale-95"
              >
                Request Custom Design
              </Link>
            </div>
          </div>

          {/* Visual Showcase Collage */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-md aspect-[4/5] bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80"
                  alt="Handmade gift crafting"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md aspect-square bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800&q=80"
                  alt="Custom gift hamper"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8">
              <div className="rounded-2xl overflow-hidden shadow-md aspect-square bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80"
                  alt="Resin and crochet art"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md aspect-[4/5] bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"
                  alt="Artisan at work"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values & Pillars */}
      <section className="bg-white border-y border-gray-100 py-10 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
            <span className="text-xs font-bold tracking-widest uppercase text-[#c89666]">
              Our Guiding Principles
            </span>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black font-serif text-[#12343b] mt-1 mb-2">
              The Artisan Standard
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Why thousands of patrons trust Artistary Crafts to celebrate their life&apos;s most defining moments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="bg-[#fdfbf9] border border-gray-100 hover:border-[#e1b382]/50 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#12343b] text-[#e1b382] flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform">
                  <pillar.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold font-serif text-[#12343b] mb-1.5">
                  {pillar.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-10 sm:py-16 md:py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-[#c89666]">
            The Journey
          </span>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-black font-serif text-[#12343b] mt-1">
            How We Bring Ideas to Life
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {milestones.map((item) => (
            <div
              key={item.step}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:border-[#e1b382]/40 transition-colors"
            >
              <span className="text-2xl sm:text-3xl font-black text-[#e1b382] font-serif shrink-0">
                {item.step}
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#12343b] mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-12 sm:py-16 bg-[#12343b] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
          <h2 className="text-xl sm:text-3xl font-black font-serif text-[#fdfbf9]">
            Have a custom idea in mind?
          </h2>
          <p className="text-xs sm:text-sm text-[#fdfbf9]/80 max-w-xl mx-auto leading-relaxed">
            Our artisan team collaborates directly with you to turn your vision into an unforgettable bespoke creation.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/custom-orders"
              className="px-6 py-2.5 rounded-full bg-[#e1b382] text-[#12343b] font-bold text-xs sm:text-sm shadow-lg hover:bg-[#c89666] transition-colors active:scale-95"
            >
              Start Your Custom Order
            </Link>
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-full bg-white/10 text-white font-bold text-xs sm:text-sm hover:bg-white/20 transition-colors border border-white/20"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

