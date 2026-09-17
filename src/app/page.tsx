"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Plane,
  ThermometerSnowflake,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Mail,
  MapPin,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Lock,
} from "lucide-react";
import { Header } from "@/components/Header";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryFilterBar, CategoryOption } from "@/components/CategoryFilterBar";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { QuickViewModal } from "@/components/QuickViewModal";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { PRODUCTS, Product, CATEGORIES } from "@/data/products";
import { playHapticClick } from "@/lib/sound";

const CATEGORY_OPTIONS: CategoryOption[] = [
  { id: "all", label: "All Formulations" },
  { id: "mother-baby", label: "Pediatric Care" },
  { id: "vitamins-supplements", label: "Longevity & Vitamins" },
  { id: "dermatological-skincare", label: "Clinical Dermatology" },
  { id: "senior-care-incontinence", label: "Senior Care & Incontinence" },
  { id: "medical-devices-diagnostic", label: "Medical Diagnostics" },
  { id: "daily-health-otc", label: "OTC & Daily Health" },
];

const TESTIMONIALS = [
  {
    id: "test-1",
    author: "Dr. Kazi Mahfuzur Rahman",
    role: "Consultant Pediatrician",
    location: "Baridhara DOHS, Dhaka",
    rating: 5,
    quote:
      "I routinely test patient-provided Aptamil canisters against European production batches. Mitavin is the only dispensary in Dhaka whose air freight records and seal integrity consistently pass clinical standards.",
  },
  {
    id: "test-2",
    author: "Farhana Chowdhury",
    role: "Mother of 6-Month Infant",
    location: "Gulshan 2, Dhaka",
    rating: 5,
    quote:
      "After encountering counterfeit Aveeno that triggered severe eczema, I was terrified to buy imported baby products online. Mitavin delivered authentic USA-sealed bottles within 3 hours. Completely life-changing peace of mind.",
  },
  {
    id: "test-3",
    author: "Engr. Monirul Islam",
    role: "Senior Project Director",
    location: "Uttara Sector 7, Dhaka",
    rating: 5,
    quote:
      "My father requires monthly VivaChek Ino glucose test strips and Giggles briefs. Every single delivery comes in tamper-sealed insulated boxes with valid 2028 expiry dates.",
  },
  {
    id: "test-4",
    author: "Samira Haque",
    role: "Architect & Mother",
    location: "Bashundhara R/A, Dhaka",
    rating: 5,
    quote:
      "Vitabiotics Pregnacare Plus Omega-3 hologram stickers verified instantly on the UK manufacturer portal. The 10x refund guarantee shows how serious Mitavin is about zero counterfeits.",
  },
];

export default function MitavinStorefrontPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Filter products by active category and search term
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCat =
        selectedCategory === "all" || product.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.importOrigin.toLowerCase().includes(q) ||
        product.summary.toLowerCase().includes(q) ||
        product.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Compute product count per category
  const categoriesWithCounts = useMemo(() => {
    return CATEGORY_OPTIONS.map((cat) => {
      if (cat.id === "all") {
        return { ...cat, count: PRODUCTS.length };
      }
      const count = PRODUCTS.filter((p) => p.category === cat.id).length;
      return { ...cat, count };
    });
  }, []);

  const handleNextTestimonial = () => {
    playHapticClick(0.06);
    setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrevTestimonial = () => {
    playHapticClick(0.06);
    setTestimonialIndex((prev) =>
      prev === 0 ? TESTIMONIALS.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-primary selection:bg-brand-emerald-light selection:text-ink-primary relative pb-20 md:pb-0">
      {/* 1. Trust Bar & Sticky Navigation */}
      <Header
        onCategorySelect={(slug) => setSelectedCategory(slug)}
        onSearchClick={() => {
          const searchInput = document.querySelector(
            "#catalog-section input"
          ) as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
        }}
      />

      {/* 2. Editorial Organic Hero */}
      <HeroBanner />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-20 flex-1 w-full">
        {/* 3. Category Filter & Live Search Bar */}
        <section className="space-y-6">
          <CategoryFilterBar
            categories={categoriesWithCounts}
            activeCategoryId={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalFilteredCount={filteredProducts.length}
          />

          {/* 4. Responsive Product Catalog Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-3 bg-card rounded-3xl border border-whisper p-8">
              <Sparkles className="w-8 h-8 text-ink-faint mx-auto" />
              <h3 className="font-serif text-xl font-bold text-ink-primary">
                No matching verified products found
              </h3>
              <p className="text-xs text-ink-muted max-w-sm mx-auto">
                Try searching for general keywords like &quot;Aptamil&quot;, &quot;Vitabiotics&quot;, &quot;Minoxidil&quot;, or reset your category filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="px-5 py-2.5 rounded-full bg-ink-primary text-white text-xs font-semibold hover:bg-black transition-all"
              >
                Reset Catalog Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* 5. Sourcing Transparency Section (Counterfeit Crisis vs. Mitavin Protocol) */}
        <section className="rounded-[2.5rem] bg-card border border-whisper p-8 sm:p-12 space-y-10 shadow-elevation overflow-hidden relative">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-emerald-subtle border border-brand-emerald/20 text-brand-emerald text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>The Mitavin Cold-Chain Standard</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ink-primary tracking-tight">
              Why Direct Air Freight Sourcing Saves Lives
            </h2>
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-light">
              Over 60% of imported baby formulas and clinical skincare in Bangladesh suffer from thermal degradation during 45-day sea freight transit in humid 55°C cargo holds. Here is how Mitavin eliminates the danger.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* The Grey Market Danger Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-red-50/40 border border-red-200/80 space-y-4">
              <div className="flex items-center gap-2.5 text-scarcity-crimson font-bold text-sm">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>The Unregulated Grey Market Sea Route</span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-ink-muted">
                <li className="flex items-start gap-2">
                  <span className="text-scarcity-crimson font-bold text-base leading-none">✕</span>
                  <span>
                    <strong>55°C Cargo Hold Baking:</strong> 6-8 weeks inside steel shipping containers cooks essential DHA, active probiotics, and infant milk fats into rancidity.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-scarcity-crimson font-bold text-base leading-none">✕</span>
                  <span>
                    <strong>Untraceable Barcodes:</strong> Scraped lot numbers and counterfeit duplicate labels sold through open marketplaces with zero laboratory accountability.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-scarcity-crimson font-bold text-base leading-none">✕</span>
                  <span>
                    <strong>No Temperature Logs:</strong> Zero cold-chain data loggers to prove temperature stability between customs clearance and your home.
                  </span>
                </li>
              </ul>
            </div>

            {/* The Mitavin Authentic Air Protocol */}
            <div className="p-6 sm:p-8 rounded-3xl bg-brand-emerald-subtle/80 border border-brand-emerald/30 space-y-4 shadow-whisper">
              <div className="flex items-center gap-2.5 text-brand-emerald font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>The Mitavin Verified Air Protocol</span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-emerald-950">
                <li className="flex items-start gap-2">
                  <span className="text-brand-emerald font-bold text-base leading-none">✓</span>
                  <span>
                    <strong>Direct Passenger & Cargo Air Freight:</strong> 48-hour flight from London Heathrow or JFK directly into Dhaka with sealed thermal telemetry.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-emerald font-bold text-base leading-none">✓</span>
                  <span>
                    <strong>Tamper Hologram Verification:</strong> Every box of Vitabiotics, Aptamil, or CeraVe carries authentic brand barcodes verifiable on official manufacturer portals.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-emerald font-bold text-base leading-none">✓</span>
                  <span>
                    <strong>10x Authenticity Refund Guarantee:</strong> If any formulation from Mitavin is proven counterfeit by laboratory analysis, we refund ten times the purchase price.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Customer & Physician Testimonials Carousel */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-widest text-brand-champagne">
                Clinical Endorsements & Real Families
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-ink-primary">
                Trusted by Dhaka&apos;s Leading Physicians
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevTestimonial}
                className="p-3 rounded-full border border-whisper bg-card text-ink-muted hover:text-ink-primary hover:border-brand-emerald active:scale-95 transition-all shadow-whisper"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextTestimonial}
                className="p-3 rounded-full border border-whisper bg-card text-ink-muted hover:text-ink-primary hover:border-brand-emerald active:scale-95 transition-all shadow-whisper"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative rounded-[2.5rem] bg-card border border-whisper p-8 sm:p-12 shadow-whisper overflow-hidden">
            <Quote className="w-16 h-16 text-brand-emerald/10 absolute -bottom-2 right-6 pointer-events-none" />

            <div className="max-w-3xl space-y-6">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(TESTIMONIALS[testimonialIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              <blockquote className="text-lg sm:text-2xl font-serif italic text-ink-primary leading-relaxed">
                &ldquo;{TESTIMONIALS[testimonialIndex].quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-brand-emerald text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {TESTIMONIALS[testimonialIndex].author[0]}
                </div>
                <div>
                  <div className="font-bold text-sm text-ink-primary">
                    {TESTIMONIALS[testimonialIndex].author}
                  </div>
                  <div className="text-xs text-ink-muted">
                    {TESTIMONIALS[testimonialIndex].role} • {TESTIMONIALS[testimonialIndex].location}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 7. Comprehensive Luxury Dispensary Footer */}
      <footer className="bg-card border-t border-whisper pt-16 pb-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Col 1: Brand & Authenticity */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-ink-primary">
                  MITAVIN
                </span>
                <span className="flex h-2 w-2 rounded-full bg-brand-emerald" />
              </div>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-light max-w-sm">
                Mitavin is Bangladesh’s premier clinical longevity and verified healthcare dispensary. All formulas are temperature-tracked and directly air-freighted from British and American laboratories.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-900 font-semibold">
                <ShieldCheck className="w-4 h-4 text-brand-emerald" />
                <span>10x Authenticity Refund Guarantee Enforced</span>
              </div>
            </div>

            {/* Col 2: Curated Categories */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
                Formulation Sectors
              </h4>
              <ul className="space-y-2 text-xs text-ink-muted">
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory("mother-baby");
                      document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="hover:text-brand-emerald transition-colors"
                  >
                    Pediatric Nutrition & Care
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory("vitamins-supplements");
                      document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="hover:text-brand-emerald transition-colors"
                  >
                    Longevity & Multivitamins
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory("dermatological-skincare");
                      document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="hover:text-brand-emerald transition-colors"
                  >
                    Clinical Dermatology
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory("senior-care-incontinence");
                      document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="hover:text-brand-emerald transition-colors"
                  >
                    Senior Care & Diapers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory("medical-devices-diagnostic");
                      document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="hover:text-brand-emerald transition-colors"
                  >
                    Diabetic & Diagnostics
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Direct Pharmacist Consultation */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
                Clinical Helpdesk
              </h4>
              <ul className="space-y-2.5 text-xs text-ink-muted">
                <li className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-brand-emerald" />
                  <a href="tel:+8801978303867" className="hover:text-ink-primary font-mono">
                    +880 1978 303867
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-brand-emerald" />
                  <a href="mailto:care@mitavin.com" className="hover:text-ink-primary">
                    care@mitavin.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-emerald flex-shrink-0 mt-0.5" />
                  <span>House 12, Road 4, Gulshan-1, Dhaka 1212, Bangladesh</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Verified Payment Rails */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
                Fulfillment & Payments
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                Same-day insulated cold delivery inside Dhaka Metro. Guaranteed cash on delivery or encrypted mobile payment.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-md bg-canvas border border-whisper text-[10px] font-bold text-pink-700">
                  bKash
                </span>
                <span className="px-2.5 py-1 rounded-md bg-canvas border border-whisper text-[10px] font-bold text-orange-600">
                  Nagad
                </span>
                <span className="px-2.5 py-1 rounded-md bg-canvas border border-whisper text-[10px] font-bold text-blue-700">
                  VISA
                </span>
                <span className="px-2.5 py-1 rounded-md bg-canvas border border-whisper text-[10px] font-bold text-red-600">
                  Mastercard
                </span>
                <span className="px-2.5 py-1 rounded-md bg-canvas border border-whisper text-[10px] font-bold text-emerald-800">
                  COD
                </span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-whisper flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-faint">
            <div>
              &copy; {new Date().getFullYear()} Mitavin Healthcare Laboratories Ltd. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1 text-ink-muted">
                <Lock className="w-3 h-3 text-brand-emerald" />
                256-Bit SSL Encrypted Healthcare Fulfillment
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* 8. Global Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <QuickViewModal />

      {/* 9. Mobile Bottom Dock */}
      <MobileBottomNav
        onCategoryClick={() => {
          document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
        }}
        onSearchClick={() => {
          document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
          const input = document.querySelector("#catalog-section input") as HTMLInputElement;
          if (input) input.focus();
        }}
      />
    </div>
  );
}
