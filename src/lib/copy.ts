/**
 * Mitavin Editorial Luxury Copywriting Ledger
 * Poetic, provocative, anti-corporate health and longevity narratives.
 */

export const EDITORIAL_COPY = {
  hero: {
    eyebrow: "Authenticity Without Compromise — Est. Dhaka 2024",
    headlinePart1: "The pure science",
    headlinePart2: "of living longer.",
    subheading:
      "Mitavin cures Bangladesh's counterfeit crisis through temperature-tracked air freight, pharmaceutical chain-of-custody, and uncompromising verified sourcing from the UK, USA, and Australia.",
    primaryCta: "Explore Genuine Catalog",
    secondaryCta: "Verify Batch Origin",
  },

  trustPillars: [
    {
      code: "01",
      title: "Direct Air Import Only",
      tag: "Zero Sea Freight Heat Exposure",
      description:
        "Standard container shipping exposes sensitive lipids and infant vitamins to 55°C Indian Ocean holds. Mitavin flies exclusively via temperature-logged air freight.",
    },
    {
      code: "02",
      title: "100% Tamper Verification",
      tag: "Individual Barcode Traceability",
      description:
        "Every canister of Aptamil, bottle of Kirkland Minoxidil, and box of Vitabiotics carries verified manufacturer lot stamps verifiable directly on brand portals.",
    },
    {
      code: "03",
      title: "24-Hour Dhaka Cold Route",
      tag: "Climate-Controlled Delivery",
      description:
        "Insulated transit bags shield probiotics, infant formulas, and diagnostics against tropical humidity straight to your doorstep in Gulshan, Banani, and Dhanmondi.",
    },
    {
      code: "04",
      title: "Physician & Pharmacist Supervised",
      tag: "Clinical Standards",
      description:
        "No grey market uncertified batches. Every SKU in our dispensary is vetted by clinical pharmacists for formulation integrity and genuine provenance.",
    },
  ],

  scarcity: {
    lowStockWarning: "High Demand — Limited verified air shipment remaining in Dhaka hub",
    freeDeliveryUnlocked: "Free Climate-Controlled Delivery to Dhaka Metro Unlocked",
    freeDeliveryPrompt: (remainingBDT: number) =>
      `Add ৳${remainingBDT.toLocaleString("en-BD")} more to unlock Free Climate-Controlled Delivery across Dhaka`,
  },

  guarantee: {
    badge: "The Mitavin Authenticity Seal",
    pledge:
      "If any formulation purchased from Mitavin is proven counterfeit by laboratory verification, we provide a 10x refund guarantee. Health is non-negotiable.",
  },
};
