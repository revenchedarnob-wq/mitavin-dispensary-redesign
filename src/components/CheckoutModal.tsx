"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  CreditCard,
  Banknote,
  Smartphone,
  ArrowRight,
  Package,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useStore } from "@/lib/store";
import { playHapticClick, playHapticSuccess } from "@/lib/sound";
import { submitOrder, OrderPayload } from "@/lib/api";
import { formatBDT } from "@/lib/utils";

const BKASH_MERCHANT_NUMBER = "01978303867";

export function CheckoutModal() {
  const {
    items,
    isCheckoutOpen,
    setCheckoutOpen,
    getSubtotal,
    getDiscountAmount,
    clearCart,
  } = useStore();

  // Form States
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryArea, setDeliveryArea] = useState<"inside_dhaka" | "outside_dhaka">("inside_dhaka");
  const [paymentMethod, setPaymentMethod] = useState<"cash_on_delivery" | "bkash" | "nagad_card">("cash_on_delivery");
  const [trxId, setTrxId] = useState("");
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Status States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderId: string;
    deliveryDays: string;
    total: number;
    itemsSummary: string;
  } | null>(null);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const isFreeDelivery = subtotal >= 2000 && deliveryArea === "inside_dhaka";
  const deliveryFee = isFreeDelivery ? 0 : deliveryArea === "inside_dhaka" ? 60 : 120;
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  const handleClose = () => {
    playHapticClick(0.06);
    setCheckoutOpen(false);
    // Reset state if confirmed
    if (confirmedOrder) {
      setConfirmedOrder(null);
    }
  };

  const handleCopyBkash = () => {
    playHapticClick(0.07);
    navigator.clipboard.writeText(BKASH_MERCHANT_NUMBER);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form Validations
    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      playHapticClick(0.06);
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 11) {
      setErrorMessage("Please enter a valid 11-digit mobile number (e.g. 017XXXXXXXX).");
      playHapticClick(0.06);
      return;
    }
    if (!address.trim()) {
      setErrorMessage("Please enter your full delivery address.");
      playHapticClick(0.06);
      return;
    }
    if (paymentMethod === "bkash" && !trxId.trim()) {
      setErrorMessage("Please enter the bKash Transaction ID (TrxID) after sending payment.");
      playHapticClick(0.06);
      return;
    }

    setIsSubmitting(true);
    playHapticClick(0.08);

    const payload: OrderPayload = {
      customer: {
        fullName,
        phoneNumber,
        addressLine1: address,
        areaOrThana: deliveryArea === "inside_dhaka" ? "Dhaka Metro" : "Outside Dhaka",
        city: deliveryArea === "inside_dhaka" ? "Dhaka" : "Bangladesh Suburb",
      },
      items: items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        unitPriceBDT: i.product.priceBDT,
        quantity: i.quantity,
      })),
      paymentMethod:
        paymentMethod === "cash_on_delivery"
          ? "cash_on_delivery"
          : paymentMethod === "bkash"
          ? "bkash"
          : "visa_mastercard",
      subtotalBDT: subtotal,
      deliveryFeeBDT: deliveryFee,
      totalBDT: grandTotal,
    };

    try {
      const response = await submitOrder(payload);

      setIsSubmitting(false);
      if (response.success) {
        playHapticSuccess(0.18);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#059669", "#d97706", "#10b981", "#fbbf24"],
        });

        setConfirmedOrder({
          orderId: response.orderId,
          deliveryDays: response.estimatedDeliveryDays,
          total: grandTotal,
          itemsSummary: items
            .map((i) => `${i.product.name} (x${i.quantity})`)
            .join(", "),
        });

        clearCart();
      } else {
        setErrorMessage("Could not process order. Please verify details or reach out on WhatsApp.");
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage("Network timeout. Please try again or message our pharmacist directly.");
    }
  };

  const handleWhatsAppReceipt = () => {
    if (!confirmedOrder) return;
    playHapticClick(0.08);

    const message = encodeURIComponent(
      `Hello Mitavin Dispensary,\nI just placed an express order!\n\nOrder ID: ${confirmedOrder.orderId}\nCustomer: ${fullName}\nPhone: ${phoneNumber}\nAddress: ${address}\nTotal: ${formatBDT(confirmedOrder.total)}\nPayment Method: ${paymentMethod.toUpperCase()}\nItems: ${confirmedOrder.itemsSummary}\n\nPlease verify and dispatch the air-inspected parcel.`
    );

    window.open(`https://wa.me/8801978303867?text=${message}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-modal overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/55 backdrop-blur-sm"
          />

          <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              transition={{ type: "spring", damping: 28, stiffness: 380 }}
              className="relative w-full max-w-2xl rounded-3xl bg-card border border-whisper shadow-floating p-6 sm:p-8 space-y-6 overflow-hidden my-8"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-canvas text-ink-muted hover:text-ink-primary transition-colors active:scale-95 z-10"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* View 1: Confirmed Order Receipt */}
              {confirmedOrder ? (
                <div className="text-center py-6 space-y-6">
                  <div className="w-18 h-18 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto text-brand-emerald shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div className="space-y-2 max-w-md mx-auto">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                      <span>Verified Genuine Order Dispatched</span>
                    </div>

                    <h3 className="font-serif text-3xl font-bold text-ink-primary">
                      Thank You, {fullName}!
                    </h3>

                    <p className="text-xs text-ink-muted leading-relaxed">
                      Your authentic UK/USA health order has been logged into our climate-controlled fulfillment queue in Dhaka.
                    </p>
                  </div>

                  {/* Order Meta Box */}
                  <div className="p-5 rounded-2xl bg-canvas border border-whisper text-left space-y-3 max-w-md mx-auto text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-whisper">
                      <span className="text-ink-muted">Tracking Order ID</span>
                      <span className="font-mono font-bold text-ink-primary text-sm">
                        {confirmedOrder.orderId}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-ink-muted">Estimated Delivery</span>
                      <span className="font-semibold text-brand-emerald">
                        {confirmedOrder.deliveryDays}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-ink-muted">Amount Payable</span>
                      <span className="font-mono font-bold text-ink-primary text-sm">
                        {formatBDT(confirmedOrder.total)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-ink-muted">Payment Mode</span>
                      <span className="font-medium text-ink-primary uppercase">
                        {paymentMethod === "cash_on_delivery" ? "Cash on Delivery" : paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* WhatsApp Receipt Action */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                    <button
                      onClick={handleWhatsAppReceipt}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-emerald-600 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-700 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>WhatsApp Order Receipt</span>
                    </button>

                    <button
                      onClick={handleClose}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-canvas border border-whisper text-ink-primary font-semibold text-xs sm:text-sm hover:bg-card active:scale-95 transition-all"
                    >
                      Return to Storefront
                    </button>
                  </div>
                </div>
              ) : (
                /* View 2: 1-Step Checkout Form */
                <form onSubmit={handleSubmitOrder} className="space-y-6">
                  {/* Modal Header */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-brand-emerald text-xs font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Frictionless Express Checkout</span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary">
                      Delivery & Payment Details
                    </h3>
                    <p className="text-xs text-ink-muted">
                      No account registration required. Direct dispatch across Bangladesh.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
                      {errorMessage}
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Step 1: Customer Details */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-ink-faint flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-brand-emerald text-white text-[10px] flex items-center justify-center">
                          1
                        </span>
                        <span>Recipient Information</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Dr. Ayesha Siddiqua"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-canvas border border-whisper focus:outline-none focus:border-brand-emerald text-ink-primary"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                            Phone Number * (11 Digits)
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="017XXXXXXXX"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-canvas border border-whisper focus:outline-none focus:border-brand-emerald text-ink-primary font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                          Full Delivery Address *
                        </label>
                        <textarea
                          required
                          rows={2}
                          placeholder="House, Road, Block, Sector/Area, Landmark..."
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full px-3.5 py-2 text-base sm:text-sm rounded-xl bg-canvas border border-whisper focus:outline-none focus:border-brand-emerald text-ink-primary resize-none"
                        />
                      </div>
                    </div>

                    {/* Step 2: Delivery Area Toggle */}
                    <div className="space-y-2 pt-2 border-t border-whisper">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-ink-faint flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-brand-emerald text-white text-[10px] flex items-center justify-center">
                          2
                        </span>
                        <span>Delivery Speed & Area</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            playHapticClick(0.06);
                            setDeliveryArea("inside_dhaka");
                          }}
                          className={`p-3 rounded-2xl border text-left flex items-start justify-between transition-all ${
                            deliveryArea === "inside_dhaka"
                              ? "bg-brand-emerald-subtle border-brand-emerald ring-1 ring-brand-emerald"
                              : "bg-canvas border-whisper hover:border-ink-muted"
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-xs text-ink-primary flex items-center gap-1.5">
                              <Truck className="w-3.5 h-3.5 text-brand-emerald" />
                              <span>Inside Dhaka Metro</span>
                            </div>
                            <div className="text-[11px] text-ink-muted mt-0.5">
                              Same-Day / 24h Express
                            </div>
                          </div>
                          <span className="font-mono text-xs font-bold text-ink-primary">
                            {isFreeDelivery ? "FREE" : "৳60"}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            playHapticClick(0.06);
                            setDeliveryArea("outside_dhaka");
                          }}
                          className={`p-3 rounded-2xl border text-left flex items-start justify-between transition-all ${
                            deliveryArea === "outside_dhaka"
                              ? "bg-brand-emerald-subtle border-brand-emerald ring-1 ring-brand-emerald"
                              : "bg-canvas border-whisper hover:border-ink-muted"
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-xs text-ink-primary flex items-center gap-1.5">
                              <Package className="w-3.5 h-3.5 text-ink-muted" />
                              <span>Outside Dhaka / Suburbs</span>
                            </div>
                            <div className="text-[11px] text-ink-muted mt-0.5">
                              Insulated 48-72h Courier
                            </div>
                          </div>
                          <span className="font-mono text-xs font-bold text-ink-primary">
                            ৳120
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Step 3: Payment Method Tabs */}
                    <div className="space-y-2 pt-2 border-t border-whisper">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-ink-faint flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-brand-emerald text-white text-[10px] flex items-center justify-center">
                          3
                        </span>
                        <span>Payment Method</span>
                      </h4>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            playHapticClick(0.06);
                            setPaymentMethod("cash_on_delivery");
                          }}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            paymentMethod === "cash_on_delivery"
                              ? "bg-brand-emerald-subtle border-brand-emerald ring-1 ring-brand-emerald"
                              : "bg-canvas border-whisper"
                          }`}
                        >
                          <Banknote className="w-4 h-4 mx-auto text-brand-emerald mb-1" />
                          <div className="text-xs font-semibold text-ink-primary">
                            Cash on Delivery
                          </div>
                          <div className="text-[10px] text-ink-muted">Default Trust</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            playHapticClick(0.06);
                            setPaymentMethod("bkash");
                          }}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            paymentMethod === "bkash"
                              ? "bg-pink-50 border-pink-500 ring-1 ring-pink-500"
                              : "bg-canvas border-whisper"
                          }`}
                        >
                          <Smartphone className="w-4 h-4 mx-auto text-pink-600 mb-1" />
                          <div className="text-xs font-semibold text-ink-primary">
                            bKash Express
                          </div>
                          <div className="text-[10px] text-ink-muted">Direct Merchant</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            playHapticClick(0.06);
                            setPaymentMethod("nagad_card");
                          }}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            paymentMethod === "nagad_card"
                              ? "bg-brand-emerald-subtle border-brand-emerald ring-1 ring-brand-emerald"
                              : "bg-canvas border-whisper"
                          }`}
                        >
                          <CreditCard className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                          <div className="text-xs font-semibold text-ink-primary">
                            Nagad / Card
                          </div>
                          <div className="text-[10px] text-ink-muted">Digital Gateway</div>
                        </button>
                      </div>

                      {/* Conditional bKash Instruction Accordion */}
                      {paymentMethod === "bkash" && (
                        <div className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-200 text-xs space-y-2 mt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-pink-900 font-semibold">
                              bKash Merchant Send Money / Payment Number:
                            </span>
                            <button
                              type="button"
                              onClick={handleCopyBkash}
                              className="flex items-center gap-1 text-[11px] font-bold text-pink-700 hover:text-pink-900"
                            >
                              {copiedNumber ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="font-mono font-bold text-sm text-pink-950">
                            {BKASH_MERCHANT_NUMBER}
                          </div>

                          <input
                            type="text"
                            placeholder="Enter 10-character bKash TrxID (e.g. 9B8A72XXXX)"
                            value={trxId}
                            onChange={(e) => setTrxId(e.target.value)}
                            className="w-full px-3.5 py-2 text-base sm:text-xs rounded-xl bg-white border border-pink-300 focus:outline-none focus:border-pink-600 text-ink-primary uppercase font-mono"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary & Confirmation Button */}
                  <div className="p-4 rounded-2xl bg-canvas border border-whisper space-y-3">
                    <div className="space-y-1 text-xs text-ink-muted">
                      <div className="flex justify-between">
                        <span>Items Subtotal ({items.length} SKUs)</span>
                        <span className="font-mono text-ink-primary">{formatBDT(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-brand-emerald">
                          <span>VIP Discount</span>
                          <span className="font-mono">-{formatBDT(discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Delivery Charge</span>
                        <span className="font-mono text-ink-primary">
                          {deliveryFee === 0 ? (
                            <span className="text-brand-emerald font-bold">FREE</span>
                          ) : (
                            formatBDT(deliveryFee)
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-ink-primary pt-2 border-t border-whisper">
                        <span>Grand Total Payable</span>
                        <span className="font-mono text-base text-brand-emerald">
                          {formatBDT(grandTotal)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || items.length === 0}
                      className="w-full py-4 rounded-full bg-brand-emerald text-white font-bold text-sm hover:bg-emerald-700 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Submitting Order to Dhaka Hub...</span>
                      ) : (
                        <>
                          <span>Confirm Order • {formatBDT(grandTotal)}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
