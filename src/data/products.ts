export interface Review {
  id: string;
  userName: string;
  userLocation: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  itemCount: number;
  featuredImage: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  categoryName: string;
  priceBDT: number;
  originalPriceBDT?: number;
  inStock: boolean;
  stockCount: number;
  importOrigin: "UK Import" | "USA Sourced" | "Australia" | "Germany" | "EU Import" | "Official Bangladesh";
  rating: number;
  reviewCount: number;
  verifiedBadge: boolean;
  coldChainMonitored?: boolean;
  featured?: boolean;
  tags: string[];
  summary: string;
  description: string;
  specifications: Record<string, string>;
  image: string;
  gallery: string[];
  reviews: Review[];
}

export const CATEGORIES: Category[] = [
  {
    id: "cat-mother-baby",
    name: "Mother & Baby",
    slug: "mother-baby",
    description: "Pediatrician-trusted infant formulas, gentle oatmeal washes, and organic newborn essentials.",
    itemCount: 24,
    featuredImage: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-vitamins-supplements",
    name: "Vitamins & Supplements",
    slug: "vitamins-supplements",
    description: "Clinically formulated multinutrients, pure omega-3 fatty acids, and cellular health capsules.",
    itemCount: 38,
    featuredImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-clinical-skincare",
    name: "Dermatological Skincare",
    slug: "dermatological-skincare",
    description: "Ceramide barrier repair serums, mineral broad-spectrum sunscreens, and pure retinol actives.",
    itemCount: 42,
    featuredImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-senior-wellness",
    name: "Senior Care & Incontinence",
    slug: "senior-care-incontinence",
    description: "Breathable anti-leak adult pull-up briefs, barrier repair creams, and joint comfort formulas.",
    itemCount: 16,
    featuredImage: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-home-diagnostics",
    name: "Medical Devices & Diagnostic",
    slug: "medical-devices-diagnostic",
    description: "Hospital-grade blood glucose meters, clinical lancets, and digital health monitoring instruments.",
    itemCount: 19,
    featuredImage: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-otc-healthcare",
    name: "Daily Health & OTC",
    slug: "daily-health-otc",
    description: "Fast-absorption paracetamol, electrolyte rehydration solutions, and herbal respiratory elixirs.",
    itemCount: 29,
    featuredImage: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "mitavin-aveeno-wash-354",
    slug: "aveeno-baby-daily-moisture-wash-shampoo",
    name: "Aveeno Baby Daily Moisture Gentle Wash & Shampoo",
    brand: "Aveeno Baby",
    category: "mother-baby",
    categoryName: "Mother & Baby",
    priceBDT: 1450,
    originalPriceBDT: 1650,
    inStock: true,
    stockCount: 42,
    importOrigin: "USA Sourced",
    rating: 4.9,
    reviewCount: 128,
    verifiedBadge: true,
    coldChainMonitored: false,
    featured: true,
    tags: ["Pediatrician Recommended", "Hypoallergenic", "Tear-Free"],
    summary: "Formulated with natural colloidal oatmeal extract to nourish sensitive newborn skin and scalp without stripping moisture.",
    description: "Specially engineered for sensitive infant dermal barriers, Aveeno Baby Daily Moisture Wash & Shampoo combines soothing oat extract with micro-lathering cleansers. Formulated without sulfates, parabens, phthalates, or phenoxyethanol, it cleanses without dehydrating delicate skin, making it gentle enough for everyday use from birth onwards.",
    specifications: {
      "Volume": "354 ml (12 fl oz)",
      "Formulation": "Tear-free gentle gel with natural oat extract",
      "Skin Compatibility": "Pediatrician & Dermatologist tested for eczema-prone skin",
      "Authenticity Protocol": "Batch-verified USA barcode 381370036647",
      "Storage Condition": "Store below 25°C away from direct sunlight"
    },
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      {
        id: "rev-101",
        userName: "Farhana Chowdhury",
        userLocation: "Gulshan 2, Dhaka",
        rating: 5,
        date: "14 Feb 2026",
        comment: "Completely authentic USA bottle. My baby's dry patches disappeared within 3 days. Rapid delivery in Dhaka.",
        verifiedPurchase: true
      },
      {
        id: "rev-102",
        userName: "Syed Tanvir Ahmed",
        userLocation: "Uttara Sector 4, Dhaka",
        rating: 5,
        date: "02 Feb 2026",
        comment: "Checked the batch code on CheckFresh and it verified immediately. Excellent seal integrity from Mitavin.",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "mitavin-aveeno-lotion-227",
    slug: "aveeno-baby-daily-moisture-body-lotion",
    name: "Aveeno Baby Daily Moisture Fragrance-Free Body Lotion",
    brand: "Aveeno Baby",
    category: "mother-baby",
    categoryName: "Mother & Baby",
    priceBDT: 1350,
    originalPriceBDT: 1550,
    inStock: true,
    stockCount: 35,
    importOrigin: "USA Sourced",
    rating: 4.8,
    reviewCount: 94,
    verifiedBadge: true,
    coldChainMonitored: false,
    featured: false,
    tags: ["24-Hour Hydration", "Non-Greasy", "Steroid-Free"],
    summary: "Infused with prebiotic colloidal oatmeal and rich emollients to protect and fortify baby's delicate cutaneous mantle for 24 hours.",
    description: "Aveeno Baby Daily Moisture Lotion contains soothing prebiotic colloidal oatmeal and dimethicone skin protectant to prevent chafed, chapped, or cracked dermal surfaces. Quickly absorbed with zero residue, this clinical formula is non-comedogenic and hypoallergenic.",
    specifications: {
      "Net Weight": "227 g (8 oz)",
      "Key Actives": "Natural Prebiotic Colloidal Oatmeal (1.2% Dimethicone)",
      "Fragrance": "100% Fragrance-Free, Dye-Free",
      "Origin Assurance": "Direct USA Distributor shipment with protective tamper shrink band"
    },
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      {
        id: "rev-103",
        userName: "Nusrat Jahan",
        userLocation: "Dhanmondi, Dhaka",
        rating: 5,
        date: "28 Jan 2026",
        comment: "Original quality. In Bangladesh so many stores sell fake Aveeno, but Mitavin's sealed product is 100% genuine.",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "mitavin-aptamil-gold-stage-1",
    slug: "aptamil-gold-plus-stage-1-infant-formula",
    name: "Aptamil Gold+ Stage 1 Infant Formula (0-6 Months)",
    brand: "Aptamil",
    category: "mother-baby",
    categoryName: "Mother & Baby",
    priceBDT: 4200,
    originalPriceBDT: 4600,
    inStock: true,
    stockCount: 18,
    importOrigin: "Australia",
    rating: 5.0,
    reviewCount: 164,
    verifiedBadge: true,
    coldChainMonitored: true,
    featured: true,
    tags: ["Cold-Chain Monitored", "Pronutra+ Biotik", "Air Freight Direct"],
    summary: "Premium nutritionally complete infant milk formula with scGOS/lcFOS prebiotics, DHA omega-3, and key immunonutrients.",
    description: "Aptamil Gold+ Stage 1 is an advanced nutritionally complete infant formula designed specifically for babies from birth up to 6 months. Developed with over 50 years of early life nutrition research by Nutricia scientists, it contains scientifically verified prebiotics (scGOS/lcFOS), zinc, iron, and long-chain polyunsaturated fatty acids (LCPs) including DHA.",
    specifications: {
      "Net Weight": "900 g Tin Canister with security seal",
      "Age Range": "Birth to 6 Months",
      "DHA & ARA Ratio": "Clinically aligned 1:1 ratio for neuro-visual maturation",
      "Logistics Protocol": "Air-freighted with temperature logging to prevent nutrient denaturation",
      "Country of Manufacture": "New Zealand / Australia Distribution"
    },
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      {
        id: "rev-104",
        userName: "Dr. Kazi Mahfuzur Rahman",
        userLocation: "Baridhara DOHS, Dhaka",
        rating: 5,
        date: "20 Jan 2026",
        comment: "As a physician, formula cold-chain authenticity is my highest priority. Mitavin provided verified air-import documentation on request.",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "mitavin-aptamil-gold-stage-2",
    slug: "aptamil-gold-plus-stage-2-follow-on-formula",
    name: "Aptamil Gold+ Stage 2 Follow-on Formula (6-12 Months)",
    brand: "Aptamil",
    category: "mother-baby",
    categoryName: "Mother & Baby",
    priceBDT: 4100,
    originalPriceBDT: 4500,
    inStock: true,
    stockCount: 22,
    importOrigin: "Australia",
    rating: 4.9,
    reviewCount: 88,
    verifiedBadge: true,
    coldChainMonitored: true,
    featured: false,
    tags: ["Immune Support", "Iron Fortified", "Stage 2 Weaning"],
    summary: "Nutritional matrix tailored to complement the introduction of solids, providing progressive zinc, iodine, and vitamins A, C & D.",
    description: "Aptamil Gold+ Stage 2 is scientifically designed to meet the increasing nutritional requirements of infants from 6 to 12 months as they transition onto solid foods. Includes scGOS/lcFOS prebiotics to support healthy gut microflora balance and strong natural immune defense.",
    specifications: {
      "Net Weight": "900 g Canister",
      "Age Range": "6 to 12 Months",
      "Key Nutrients": "Iron, Vitamin C, Zinc, scGOS/lcFOS 9:1 prebiotic blend",
      "Packaging": "Hermetically sealed tin with tamper-evident plastic overcap"
    },
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      {
        id: "rev-105",
        userName: "Tahmina Akter",
        userLocation: "Banani, Dhaka",
        rating: 5,
        date: "11 Feb 2026",
        comment: "Transitioned my son from stage 1 to stage 2 smoothly. No gas, no colic. Very trustworthy store.",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "mitavin-aptamil-gold-stage-3",
    slug: "aptamil-gold-plus-stage-3-toddler-milk",
    name: "Aptamil Gold+ Stage 3 Toddler Nutritional Supplement (1+ Years)",
    brand: "Aptamil",
    category: "mother-baby",
    categoryName: "Mother & Baby",
    priceBDT: 3950,
    originalPriceBDT: 4300,
    inStock: true,
    stockCount: 26,
    importOrigin: "Australia",
    rating: 4.9,
    reviewCount: 75,
    verifiedBadge: true,
    coldChainMonitored: true,
    featured: false,
    tags: ["Cognitive Development", "Toddler Health", "Zinc & Iodine"],
    summary: "Formulated for active toddlers aged 1 year and older whose normal dietary intake may benefit from supplementary micronutrients.",
    description: "Aptamil Gold+ Stage 3 Toddler Milk contains 16 essential vitamins and minerals including zinc, iodine, and vitamin B6 to support energy metabolism and physical growth in energetic toddlers.",
    specifications: {
      "Net Weight": "900 g",
      "Serving Size": "200ml prepared drink (4 scoops + 100ml water)",
      "Key Minerals": "Calcium, Magnesium, Phosphorus, Iron & Zinc"
    },
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    reviews: []
  },
  {
    id: "mitavin-similac-gold-stage-3",
    slug: "similac-gold-stage-3-hmo-toddler-formula",
    name: "Similac 3-HMO Gold Stage 3 Growing-Up Formula (1-3 Years)",
    brand: "Abbott Similac",
    category: "mother-baby",
    categoryName: "Mother & Baby",
    priceBDT: 3850,
    originalPriceBDT: 4200,
    inStock: true,
    stockCount: 19,
    importOrigin: "EU Import",
    rating: 4.8,
    reviewCount: 62,
    verifiedBadge: true,
    coldChainMonitored: true,
    featured: false,
    tags: ["2'-FL HMO", "Eye-Q Plus System", "Natural Vitamin E"],
    summary: "Pioneering formula enriched with human milk oligosaccharide (2'-FL HMO) and Abbott's signature Eye-Q system for cognitive milestones.",
    description: "Similac Gold Stage 3 features 2'-fucosyllactose (2'-FL HMO) structurally identical to the immune-nourishing component in mother's milk. Paired with lutein, natural vitamin E, and DHA to support healthy neural connectivity.",
    specifications: {
      "Net Weight": "800 g Sealed Metal Tin",
      "Specialty": "Zero Palm Olein Oil, High Calcium Absorption",
      "Batch Verification": "Abbott Global Batch QR Verified"
    },
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    reviews: []
  },
  {
    id: "mitavin-giggles-adult-diapers-l",
    slug: "giggles-premium-adult-diapers-extra-soft-large",
    name: "Giggles Premium Adult Diapers Extra Soft (Large, 30 Pcs)",
    brand: "Giggles",
    category: "senior-care-incontinence",
    categoryName: "Senior Care & Incontinence",
    priceBDT: 2350,
    originalPriceBDT: 2600,
    inStock: true,
    stockCount: 31,
    importOrigin: "Official Bangladesh",
    rating: 4.7,
    reviewCount: 53,
    verifiedBadge: true,
    coldChainMonitored: false,
    featured: true,
    tags: ["High Absorbency Core", "Wetness Indicator", "Anti-Leak Barriers"],
    summary: "Medical-grade adult incontinence brief with ultra-absorbent Japanese SAP polymer, textile backsheet, and aloe vera anti-rash lining.",
    description: "Engineered for bedridden patients and active seniors experiencing moderate to heavy bladder sensitivity. Giggles Large features dual-action re-fastenable side tabs, elastic leg barriers, and an ergonomic anatomical core that locks moisture away from skin within seconds.",
    specifications: {
      "Waist Size Range": "100 cm – 150 cm (40\" – 59\")",
      "Quantity": "30 Diapers / Pack",
      "Absorbency Level": "Heavy Nighttime Protection (2800ml fluid capacity)",
      "Surface Material": "Hydrophilic Non-Woven Top Layer with Aloe Vera extract"
    },
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    reviews: [
      {
        id: "rev-106",
        userName: "Rezaul Karim",
        userLocation: "Mirpur DOHS, Dhaka",
        rating: 5,
        date: "05 Feb 2026",
        comment: "Essential monthly supply for my elderly father. No skin irritation and delivery is always on time with discreet packaging.",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "mitavin-giggles-pull-up-pants-m",
    slug: "giggles-adult-incontinence-pull-up-pants-medium",
    name: "Giggles Adult Incontinence Pull-Up Pants (Medium, 10 Pcs)",
    brand: "Giggles",
    category: "senior-care-incontinence",
    categoryName: "Senior Care & Incontinence",
    priceBDT: 1150,
    originalPriceBDT: 1300,
    inStock: true,
    stockCount: 40,
    importOrigin: "Official Bangladesh",
    rating: 4.8,
    reviewCount: 38,
    verifiedBadge: true,
    coldChainMonitored: false,
    featured: false,
    tags: ["Underwear Comfort", "Odor Neutralizer", "Discreet Fit"],
    summary: "Anatomic pull-up underwear designed for mobile adults seeking discreet dignity, breathability, and reliable day protection.",
    description: "Giggles Pull-Up Pants slip on and off like regular cotton underwear. Features 360-degree elastic waistband, micro-pores for cutaneous transpiration, and instant odor-locking gel pearls.",
    specifications: {
      "Waist Size": "80 cm – 120 cm (31\" – 47\")",
      "Quantity": "10 Briefs / Pack",
      "Absorbency": "Medium Day Protection (1600ml)"
    },
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    reviews: []
  },
  {
    id: "mitavin-pregnacare-plus-omega-3",
    slug: "pregnacare-plus-omega-3-dual-pack",
    name: "Vitabiotics Pregnacare Plus Omega-3 Dual Pack (56 Tablets/Capsules)",
    brand: "Vitabiotics",
    category: "vitamins-supplements",
    categoryName: "Vitamins & Supplements",
    priceBDT: 2850,
    originalPriceBDT: 3200,
    inStock: true,
    stockCount: 28,
    importOrigin: "UK Import",
    rating: 5.0,
    reviewCount: 145,
    verifiedBadge: true,
    coldChainMonitored: false,
    featured: true,
    tags: ["UK's No.1 Pregnancy Brand", "400mcg Folic Acid", "300mg Pure DHA"],
    summary: "Dual-pack formulation providing 19 essential prenatal micronutrients alongside pure pharmaceutical-grade marine DHA for fetal brain and retinal health.",
    description: "Vitabiotics Pregnacare Plus Omega-3 is the gold standard prenatal care system trusted by obstetricians worldwide. The multivitamin tablet supplies the exact 400mcg L-methylfolate equivalent recommended by the UK Department of Health, alongside moderate iron, zinc, and vitamin D. The separate lipid capsule provides high-purity fish oil rigorously certified for zero heavy metals.",
    specifications: {
      "Contents": "28 Prenatal Micronutrient Tablets + 28 High Purity Omega-3 Capsules",
      "Key Actives": "400µg Folic Acid, 10µg Vitamin D3, 17mg Iron, 300mg DHA, 60mg EPA",
      "Batch Origin": "Manufactured in Great Britain (Vitabiotics London NW2 7JR)",
      "Halal Certification": "Certified Halal by HMC UK"
    },
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      {
        id: "rev-107",
        userName: "Samira Haque",
        userLocation: "Bashundhara R/A, Dhaka",
        rating: 5,
        date: "09 Feb 2026",
        comment: "Prescribed by my gynaecologist at Square Hospital. The hologram sticker and foil seal were pristine. Five stars.",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "mitavin-wellman-original-30",
    slug: "wellman-original-multivitamin-for-men",
    name: "Vitabiotics Wellman Original Comprehensive Multivitamins (30 Tablets)",
    brand: "Vitabiotics",
    category: "vitamins-supplements",
    categoryName: "Vitamins & Supplements",
    priceBDT: 1850,
    originalPriceBDT: 2100,
    inStock: true,
    stockCount: 45,
    importOrigin: "UK Import",
    rating: 4.9,
    reviewCount: 112,
    verifiedBadge: true,
    coldChainMonitored: false,
    featured: false,
    tags: ["Energy Metabolism", "Immune Defense", "Siberian Ginseng"],
    summary: "Advanced 29-nutrient bio-active complex specifically balanced for men's metabolic rate, physical endurance, and cardiovascular vitality.",
    description: "Wellman Original has been developed by British pharmaceutical researchers to provide comprehensive daily support. Features Siberian Ginseng, CoQ10, L-Carnitine, zinc for normal testosterone levels, and B-complex vitamins for sustained mental and physical resilience.",
    specifications: {
      "Pack Size": "30 One-a-Day Tablets (1 Month Supply)",
      "Key Ingredients": "Co-Enzyme Q10, L-Carnitine, Siberian Ginseng Extract, Bioflavonoids",
      "Free From": "Gluten, artificial colors, preservatives, yeast"
    },
    image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    reviews: []
  },
  {
    id: "mitavin-wellwoman-70-plus",
    slug: "wellwoman-70-plus-comprehensive-health-support",
    name: "Vitabiotics Wellwoman 70+ Comprehensive Health & Vitality (30 Tablets)",
    brand: "Vitabiotics",
    category: "vitamins-supplements",
    categoryName: "Vitamins & Supplements",
    priceBDT: 2150,
    originalPriceBDT: 2450,
    inStock: true,
    stockCount: 17,
    importOrigin: "UK Import",
    rating: 4.8,
    reviewCount: 39,
    verifiedBadge: true,
    coldChainMonitored: false,
    featured: false,
    tags: ["Cognitive Function", "Heart & Circulation", "Vision Support"],
    summary: "Expertly balanced micronutrients tailored for women aged 70 and above, featuring lutein, alpha lipoic acid, and vitamin D3.",
    description: "Formulated specifically for the physiological changes associated with mature longevity. Supports heart rhythm, mental sharpness, bone mineral density, and immune cellular homeostasis.",
    specifications: {
      "Quantity": "30 Tablets",
      "Special Nutrients": "Lutein Esters, Phosphatidylcholine, Co-Q10, ALA"
    },
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    reviews: []
  },
  {
    id: "mitavin-kirkland-minoxidil-5",
    slug: "kirkland-signature-minoxidil-5-hair-regrowth-treatment",
    name: "Kirkland Signature Minoxidil 5% Extra Strength Hair Regrowth Solution",
    brand: "Kirkland Signature",
    category: "dermatological-skincare",
    categoryName: "Dermatological Skincare",
    priceBDT: 1750,
    originalPriceBDT: 1950,
    inStock: true,
    stockCount: 50,
    importOrigin: "USA Sourced",
    rating: 4.9,
    reviewCount: 210,
    verifiedBadge: true,
    coldChainMonitored: false,
    featured: true,
    tags: ["FDA Approved Active", "Clinically Proven", "Calibrated Dropper"],
    summary: "Topical 5% minoxidil solution clinically validated to reactivate dormant hair follicles and reverse male pattern androgenetic thinning.",
    description: "Kirkland Minoxidil 5% Extra Strength is the benchmark FDA-approved topical treatment for hair follicle revitalization. Designed for men with thinning vertex scalp hair, it dilates micro-capillaries around dermal papillae, stimulating nutrient flow and extending the anagen growth phase.",
    specifications: {
      "Volume": "60 ml (2 fl oz) Single Bottle with Precision Graduated Dropper",
      "Active Concentration": "Minoxidil USP 5% w/v",
      "Vehicle": "Alcohol, Propylene Glycol, Purified Water",
      "Authenticity": "100% Genuine USA Costco distribution with bottom lot stamp"
    },
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      {
        id: "rev-108",
        userName: "Shakil Anwar",
        userLocation: "Uttara, Dhaka",
        rating: 5,
        date: "12 Feb 2026",
        comment: "Tested the amber liquid crystallization to verify genuineness — 100% real Kirkland minoxidil. In 2 months visible baby hairs have sprouted.",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "mitavin-cerave-mineral-sunscreen-50",
    slug: "cerave-hydrating-mineral-sunscreen-spf50-face",
    name: "CeraVe Hydrating 100% Mineral Sunscreen SPF 50 Face Lotion",
    brand: "CeraVe",
    category: "dermatological-skincare",
    categoryName: "Dermatological Skincare",
    priceBDT: 2450,
    originalPriceBDT: 2750,
    inStock: true,
    stockCount: 25,
    importOrigin: "USA Sourced",
    rating: 4.8,
    reviewCount: 89,
    verifiedBadge: true,
    coldChainMonitored: false,
    featured: true,
    tags: ["100% Mineral UV Filters", "3 Essential Ceramides", "Reef Friendly"],
    summary: "Broad-spectrum physical SPF 50 barrier with titanium dioxide and zinc oxide, enriched with ceramides to lock in moisture without stinging eyes.",
    description: "Developed with dermatologists, CeraVe Hydrating Mineral Sunscreen Face Lotion provides broad-spectrum UVA/UVB protection using purely non-chemical zinc oxide and titanium dioxide physical reflections. Formulated with 3 essential ceramides (1, 3, 6-II) and hyaluronic acid, it has been awarded the National Eczema Association Seal of Acceptance.",
    specifications: {
      "Volume": "75 ml (2.5 fl oz)",
      "Active Filters": "Titanium Dioxide 9%, Zinc Oxide 7%",
      "Finish": "Sheer tinted hydration suitable for tropical humidity",
      "Certification": "Skin Cancer Foundation Daily Use Recommended"
    },
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    reviews: []
  },
  {
    id: "mitavin-cerave-resurfacing-retinol",
    slug: "cerave-resurfacing-retinol-serum-niacinamide",
    name: "CeraVe Resurfacing Retinol Serum with Encapsulated Retinol & Niacinamide",
    brand: "CeraVe",
    category: "dermatological-skincare",
    categoryName: "Dermatological Skincare",
    priceBDT: 2650,
    originalPriceBDT: 2950,
    inStock: true,
    stockCount: 30,
    importOrigin: "USA Sourced",
    rating: 4.9,
    reviewCount: 104,
    verifiedBadge: true,
    coldChainMonitored: false,
    featured: false,
    tags: ["Encapsulated Retinol", "Licorice Root Extract", "Pore Refining"],
    summary: "Gentle post-acne resurfacing treatment with micro-encapsulated time-release retinol to smooth texture without disrupting epidermal lipids.",
    description: "Formulated to reduce the appearance of post-inflammatory marks and visible pore dilation. Encapsulated retinol gently encourages cellular turnover, while soothing niacinamide calms inflammation and licorice root extract brightens post-blemish shadows.",
    specifications: {
      "Volume": "30 ml (1 fl oz) Airtight Opaque Pump Dispenser",
      "Actives": "Encapsulated Retinol, Ceramides 1, 3 & 6-II, Niacinamide, Dipotassium Glycyrrhizate",
      "Application": "Apply in evening routines before barrier moisturizer"
    },
    image: "https://images.unsplash.com/photo-1608248597359-5972846187ee?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    reviews: []
  },
  {
    id: "mitavin-panadol-advance-24",
    slug: "panadol-advance-500mg-paracetamol-fast-relief",
    name: "Panadol Advance 500mg Optizorb Technology Paracetamol (24 Tablets)",
    brand: "GSK Panadol",
    category: "daily-health-otc",
    categoryName: "Daily Health & OTC",
    priceBDT: 480,
    originalPriceBDT: 550,
    inStock: true,
    stockCount: 95,
    importOrigin: "UK Import",
    rating: 4.9,
    reviewCount: 310,
    verifiedBadge: true,
    coldChainMonitored: false,
    featured: false,
    tags: ["Optizorb Absorption", "Gentle on Stomach", "GSK UK Genuine"],
    summary: "Patented Optizorb formula engineered to disintegrate within 5 minutes for significantly faster pain relief than standard paracetamol.",
    description: "Panadol Advance with Optizorb Technology is an advanced paracetamol formulation manufactured in the United Kingdom by GlaxoSmithKline. Unlike standard tablets that dissolve slowly, Optizorb granules accelerate gastric dispersion, providing fast systemic analgesic relief for headaches, fever, and musculoskeletal discomfort while remaining exceptionally gentle on the stomach lining.",
    specifications: {
      "Active Ingredient": "Paracetamol BP 500mg per tablet",
      "Packaging": "24 Film-Coated Tablets in tamper-proof blister pack",
      "Disintegration Rate": "5x faster initial tablet breakdown",
      "Country of Origin": "United Kingdom (GSK Dungarvan / Brentford)"
    },
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    reviews: [
      {
        id: "rev-109",
        userName: "M. A. Hashem",
        userLocation: "Mohakhali DOHS, Dhaka",
        rating: 5,
        date: "01 Feb 2026",
        comment: "The real UK Optizorb formulation. Works within 15 minutes for migraines without causing heartburn.",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "mitavin-vivachek-ino-strips-50",
    slug: "vivachek-ino-blood-glucose-test-strips-50",
    name: "VivaChek Ino Blood Glucose Diagnostic Test Strips (Pack of 50)",
    brand: "VivaChek Medical",
    category: "medical-devices-diagnostic",
    categoryName: "Medical Devices & Diagnostic",
    priceBDT: 1250,
    originalPriceBDT: 1450,
    inStock: true,
    stockCount: 65,
    importOrigin: "Germany",
    rating: 4.9,
    reviewCount: 180,
    verifiedBadge: true,
    coldChainMonitored: true,
    featured: true,
    tags: ["ISO 15197:2013 Compliant", "8-Electrode Precision", "0.5µL Micro-Sample"],
    summary: "Clinical grade blood glucose test strips equipped with 8 gold-plated electrodes and advanced hematocrit interference compensation.",
    description: "VivaChek Ino Test Strips meet the rigorous global accuracy requirements of ISO 15197:2013 standards. Utilizing an 8-electrode sensor architecture with Glucose Dehydrogenase (FAD-GDH) enzyme chemistry, they deliver accurate readings unaffected by oxygen variations or non-glucose sugars.",
    specifications: {
      "Pack Quantity": "50 Test Strips in desiccant-lined vial",
      "Sample Volume": "0.5 µL capillary whole blood",
      "Reaction Time": "5 Seconds",
      "Measurement Range": "10 - 600 mg/dL (0.6 - 33.3 mmol/L)",
      "Quality Standard": "CE 0197, ISO 15197:2013 certified"
    },
    image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    reviews: [
      {
        id: "rev-110",
        userName: "Engr. Monirul Islam",
        userLocation: "Uttara Sector 7, Dhaka",
        rating: 5,
        date: "10 Feb 2026",
        comment: "Consistent readings verified against BIRDEM laboratory blood draw. Vials are properly sealed with 2027 expiry dates.",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "mitavin-vivachek-ino-meter-kit",
    slug: "vivachek-ino-blood-glucose-monitoring-starter-kit",
    name: "VivaChek Ino Blood Glucose Monitoring Complete Starter System",
    brand: "VivaChek Medical",
    category: "medical-devices-diagnostic",
    categoryName: "Medical Devices & Diagnostic",
    priceBDT: 1950,
    originalPriceBDT: 2300,
    inStock: true,
    stockCount: 22,
    importOrigin: "Germany",
    rating: 4.8,
    reviewCount: 47,
    verifiedBadge: true,
    coldChainMonitored: false,
    featured: false,
    tags: ["Complete System", "Memory 900 Tests", "No Coding Required"],
    summary: "All-in-one diabetic home monitoring system with auto-ejection lancing device, 10 sterile lancets, and hard shell protective carrying folio.",
    description: "The VivaChek Ino glucometer features a wide backlit LCD screen, strip ejector to eliminate biological contamination, 900-test memory with 7, 14, and 30-day glycemic averages, and pre/post meal categorization markers.",
    specifications: {
      "Included Accessories": "VivaChek Ino Meter, 10 Test Strips, Lancing Device, 10 Sterile Lancets, CR2032 Battery, Case",
      "Memory": "900 test results with timestamped date and meal markers",
      "Warranty": "Lifetime Replacement Warranty via Mitavin Healthcare"
    },
    image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    reviews: []
  },
  {
    id: "mitavin-sambucol-black-elderberry",
    slug: "sambucol-black-elderberry-liquid-extra-defence",
    name: "Sambucol Black Elderberry Original Formula Liquid Immune Support (120ml)",
    brand: "Sambucol",
    category: "daily-health-otc",
    categoryName: "Daily Health & OTC",
    priceBDT: 1850,
    originalPriceBDT: 2150,
    inStock: true,
    stockCount: 34,
    importOrigin: "UK Import",
    rating: 4.9,
    reviewCount: 97,
    verifiedBadge: true,
    coldChainMonitored: false,
    featured: true,
    tags: ["High Antioxidant", "Black Elderberry", "Family Immune Shield"],
    summary: "Natural Haschberg black elderberry elixir enriched with vitamin C and zinc to fortify mucosal and cellular respiratory defense.",
    description: "Sambucol is the original Black Elderberry brand developed by a world-renowned virologist. Using a proprietary extraction method that preserves the high polyphenol and anthocyanin bio-flavonoids of premium European Haschberg berries, it provides strong daily immune support for the entire family.",
    specifications: {
      "Volume": "120 ml Liquid Syrupy Elixir",
      "Key Actives": "Standardized Black Elderberry Juice (Sambucus nigra), Vitamin C, Zinc",
      "Suitability": "Adults and children aged 3+",
      "Manufacture": "United Kingdom (PharmaCare Europe)"
    },
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    reviews: []
  }
];

export const ALL_PRODUCTS = PRODUCTS;
