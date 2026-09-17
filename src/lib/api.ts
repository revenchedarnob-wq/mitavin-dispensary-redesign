import { Product, PRODUCTS, Category, CATEGORIES } from "@/data/products";

export interface OrderItemPayload {
  productId: string;
  productName: string;
  unitPriceBDT: number;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  phoneNumber: string;
  email?: string;
  addressLine1: string;
  areaOrThana: string;
  city: string; // e.g. "Dhaka", "Chittagong", "Sylhet"
  deliveryNotes?: string;
}

export interface OrderPayload {
  customer: CustomerDetails;
  items: OrderItemPayload[];
  paymentMethod: "cash_on_delivery" | "bkash" | "nagad" | "visa_mastercard";
  subtotalBDT: number;
  deliveryFeeBDT: number;
  totalBDT: number;
}

export interface OrderResponse {
  success: boolean;
  orderId: string;
  estimatedDeliveryDays: string;
  message: string;
  timestamp: string;
}

/**
 * Base URL for optional remote Laravel REST API or Supabase Edge Functions.
 * When undefined or unreachable, the adapter transparently falls back to
 * zero-latency in-memory authentic data.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

/**
 * Simulated network delay helper to mimic asynchronous wire transfer
 */
const simulateLatency = (ms = 100): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retrieve product catalog with optional category slug filter and search term
 */
export async function getProducts(
  category?: string,
  search?: string
): Promise<Product[]> {
  if (API_BASE_URL) {
    try {
      const queryParams = new URLSearchParams();
      if (category && category !== "all") queryParams.append("category", category);
      if (search) queryParams.append("q", search);

      const res = await fetch(`${API_BASE_URL}/api/products?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (res.ok) {
        const json = await res.json();
        return (json.data || json) as Product[];
      }
    } catch {
      // Fall through to local fallback
    }
  }

  // Local simulated API engine
  await simulateLatency(100);

  let filtered = [...PRODUCTS];

  if (category && category !== "all") {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search && search.trim().length > 0) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.summary.toLowerCase().includes(q)
    );
  }

  return filtered;
}

/**
 * Retrieve single product by unique ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${encodeURIComponent(id)}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (res.ok) {
        const json = await res.json();
        return (json.data || json) as Product;
      }
    } catch {
      // Fall through to local
    }
  }

  await simulateLatency(80);
  const found = PRODUCTS.find((p) => p.id === id);
  return found || null;
}

/**
 * Retrieve single product by URL slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/slug/${encodeURIComponent(slug)}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (res.ok) {
        const json = await res.json();
        return (json.data || json) as Product;
      }
    } catch {
      // Fall through to local
    }
  }

  await simulateLatency(80);
  const found = PRODUCTS.find((p) => p.slug === slug);
  return found || null;
}

/**
 * Retrieve list of all curated categories
 */
export async function getCategories(): Promise<Category[]> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        const json = await res.json();
        return (json.data || json) as Category[];
      }
    } catch {
      // Fall through to local
    }
  }

  await simulateLatency(60);
  return CATEGORIES;
}

/**
 * Retrieve featured products for spotlight carousels
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  await simulateLatency(80);
  return PRODUCTS.filter((p) => p.featured);
}

/**
 * Submit verified checkout order
 * Dispatches to Laravel REST API `/api/orders` or simulates instant order ID generation.
 */
export async function submitOrder(orderData: OrderPayload): Promise<OrderResponse> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const json = await res.json();
        return json as OrderResponse;
      }
    } catch {
      // Fall through to local simulator
    }
  }

  // Local simulated checkout order processing
  await simulateLatency(250);

  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  const generatedOrderId = `MTV-${new Date().getFullYear()}-${randomDigits}`;

  const isDhaka = orderData.customer.city.toLowerCase().includes("dhaka");
  const estimatedDeliveryDays = isDhaka ? "24-48 Hours (Same-day Express in Dhaka Metro)" : "48-72 Hours";

  return {
    success: true,
    orderId: generatedOrderId,
    estimatedDeliveryDays,
    message: `Order successfully placed with Mitavin authentic healthcare fulfillment.`,
    timestamp: new Date().toISOString(),
  };
}
