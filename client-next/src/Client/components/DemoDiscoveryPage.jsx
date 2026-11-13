"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  SparklesIcon,
  ShoppingBagIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftIcon,
  HeartIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function DemoDiscoveryPage() {
  const router = useRouter();

  const discoveryFeatures = [
    {
      title: "Handcrafted Catalog",
      description: "Browse our entire collection of resin art, crochet designs, and personalized gift boxes.",
      href: "/products",
      icon: ShoppingBagIcon,
      badge: "Full Store",
      color: "from-teal-50 to-emerald-50",
      accent: "text-[#12343b]",
    },
    {
      title: "Artisan Gallery",
      description: "Explore our visual gallery of finished custom commissions and inspiring showcase designs.",
      href: "/gallery",
      icon: PhotoIcon,
      badge: "Art Showcase",
      color: "from-amber-50 to-orange-50",
      accent: "text-[#c89666]",
    },
    {
      title: "Bespoke Custom Orders",
      description: "Have a unique idea? Tell us your vision and we'll handcraft a personalized piece for you.",
      href: "/custom-orders",
      icon: SparklesIcon,
      badge: "Personalized",
      color: "from-stone-50 to-amber-50",
      accent: "text-[#12343b]",
    },
    {
      title: "Artisan Support Desk",
      description: "Need help or have questions? Get instant assistance via WhatsApp or phone with our team.",
      href: "/contact",
      icon: ChatBubbleLeftRightIcon,
      badge: "Direct Help",
      color: "from-emerald-50 to-teal-50",
      accent: "text-emerald-700",
    },
  ];

  const popularPills = [
    { name: "Resin Art", href: "/products" },
    { name: "Crochet Bags", href: "/products" },
    { name: "Gift Hampers", href: "/products" },
    { name: "Photo Frames", href: "/products" },
    { name: "Anniversary Gifts", href: "/products" },
    { name: "Birthday Specials", href: "/products" },
  ];

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center py-8 sm:py-14 px-4 sm:px-6">
      <div className="max-w-3xl w-full text-center space-y-6">
        {/* Floating Artisan Emblem */}
        <div className="inline-flex items-center justify-center p-3 sm:p-4 rounded-3xl bg-gradient-to-br from-[#12343b] to-[#0f2c32] shadow-xl ring-4 ring-[#e1b382]/30 animate-bounce duration-1000">
          <SparklesIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#e1b382]" />
        </div>

        {/* Heading */}
        <div className="space-y-2.5">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#e1b382]/20 text-[#12343b] border border-[#e1b382]/40">
            Artisan Studio Discovery
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#12343b] tracking-tight">
            Looking for Something Special?
          </h1>
          <p className="text-stone-600 text-xs sm:text-base max-w-xl mx-auto leading-relaxed">
            This creation link or page is being handcrafted in our artisan workshop or has moved.
            Don&apos;t worry &mdash; our complete collection of handmade resin treasures and custom gifts is ready for you!
          </p>
        </div>

        {/* Popular Tags */}
        <div className="pt-1 flex flex-wrap justify-center items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
            <HeartIcon className="w-3.5 h-3.5 text-[#c89666]" /> Popular:
          </span>
          {popularPills.map((pill) => (
            <Link
              key={pill.name}
              href={pill.href}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-white border border-stone-200 hover:border-[#e1b382] hover:text-[#12343b] transition shadow-sm active:scale-95"
            >
              {pill.name}
            </Link>
          ))}
        </div>

        {/* Quick Discovery Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-4 text-left">
          {discoveryFeatures.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group relative p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 hover:border-[#e1b382] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${item.color} ${item.accent} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-[#12343b] text-base sm:text-lg group-hover:text-[#c89666] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-stone-500 text-xs sm:text-sm mt-1 leading-snug">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-stone-100 flex items-center text-xs font-bold text-[#12343b] group-hover:text-[#c89666] transition-colors">
                  <span>Explore Now</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#12343b] hover:bg-[#0e272d] text-[#e1b382] border border-[#e1b382]/40 font-semibold px-6 py-3 rounded-xl shadow-md text-sm active:scale-95 transition"
          >
            <ArrowLeftIcon className="w-4 h-4 text-[#e1b382]" />
            <span>Return to Storefront</span>
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 font-semibold px-6 py-3 rounded-xl shadow-sm text-sm active:scale-95 transition"
          >
            <span>Need Help? Contact Artisan Support</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
