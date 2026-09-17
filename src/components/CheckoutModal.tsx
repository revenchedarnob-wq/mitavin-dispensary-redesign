"use client";

import React, { useState } from "react";
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
import { playHapticClick, playHapticGlass, playHapticSuccess } from "@/lib/sound";
import { triggerSpark } from "@/components/ClickSpark";
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

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryArea, setDeliveryArea] = useState<"inside_dhaka" | "outside_dhaka">("inside_dhaka");
  const [paymentMethod, setPaymentMethod] = useState<"cash_on_delivery" | "bkash" | "nagad_card">("cash_on_delivery");
  const [trxId, setTrxId] = useState("");
  const [copiedNumber, setCopiedNumber] = useState(false);

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
    if (confirmedOrder) {
      setConfirmedOrder(null);
    }
  };

  const handleCopyBkash = (e?: React.MouseEvent) => {
    playHapticGlass(0.08);
    const x = e?.clientX || (typeof window !== "undefined" ? window.innerWidth / 2 : 0);
    const y = e?.clientY || (typeof window !== "undefined" ? window.innerHeight / 2 : 0);
    triggerSpark(x, y, "#10B981", 10, 24);

    navigator.clipboard.writeText(BKASH_MERCHANT_NUMBER);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

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
        if (typeof window !== "undefined") {
          triggerSpark(
            window.innerWidth / 2,
            window.innerHeight * 0.45,
            "#10B981",
            16,
            36
          );
        }
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#171717", "#10B981", "#0070F3", "#737373"],
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
        setErrorMessage("Could not process order. Please verify details.");
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage("Network timeout. Please retry or message our pharmacist directly.");
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
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 8 }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="relative w-full max-w-xl rounded-xl bg-white border border-zinc-200 shadow-floating p-6 sm:p-7 space-y-5 overflow-hidden my-6"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors z-10"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* View 1: Confirmed Order Receipt */}
              {confirmedOrder ? (
                <div className="text-center py-4 space-y-5">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-1.5 max-w-md mx-auto">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 text-[11px] font-mono uppercase tracking-wider">
                      <span>VERIFIED GENUINE ORDER LOGGED</span>
                    </div>

                    <h3 className="font-sans text-2xl font-bold tracking-tight text-zinc-950">
                      Order Confirmed, {fullName}!
                    </h3>

                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Your authentic UK/USA health order has been logged into our Dhaka central dispatch queue.
                    </p>
                  </div>

                  {/* Order Meta Box */}
                  <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 text-left space-y-2.5 max-w-md mx-auto text-xs font-mono">
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                      <span className="text-zinc-500">Tracking ID</span>
                      <span className="font-bold text-zinc-900 text-sm">
                        {confirmedOrder.orderId}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">Estimated Delivery</span>
                      <span className="font-semibold text-emerald-700">
                        {confirmedOrder.deliveryDays}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">Total Payable</span>
                      <span className="font-bold text-zinc-900 text-sm">
                        {formatBDT(confirmedOrder.total)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">Payment Mode</span>
                      <span className="font-medium text-zinc-900 uppercase">
                        {paymentMethod === "cash_on_delivery" ? "Cash on Delivery" : paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* WhatsApp Receipt Action */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto">
                    <button
                      onClick={handleWhatsAppReceipt}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-medium text-xs sm:text-sm hover:bg-emerald-700 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>WhatsApp Order Receipt</span>
                    </button>

                    <button
                      onClick={handleClose}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white border border-zinc-200 text-zinc-800 font-medium text-xs sm:text-sm hover:bg-zinc-50 active:scale-95 transition-all"
                    >
                      Back to Catalog
                    </button>
                  </div>
                </div>
              ) : (
                /* View 2: 1-Step Checkout Form */
                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-zinc-700 text-xs font-mono font-medium uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>1-Step Express Checkout</span>
                    </div>
                    <h3 className="font-sans text-xl font-bold tracking-tight text-zinc-950">
                      Delivery &amp; Payment
                    </h3>
                  </div>

                  {errorMessage && (
                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                      {errorMessage}
                    </div>
                  )}

                  <div className="space-y-3.5">
                    {/* Step 1: Customer Details */}
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Dr. Ayesha Siddiqua"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-3 py-2 text-base sm:text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-900 text-zinc-900"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                            Phone Number * (11 Digits)
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="017XXXXXXXX"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full px-3 py-2 text-base sm:text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-900 text-zinc-900 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                          Delivery Address *
                        </label>
                        <textarea
                          required
                          rows={2}
                          placeholder="House, Road, Block, Area, Landmark in Dhaka..."
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full px-3 py-2 text-base sm:text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-900 text-zinc-900 resize-none"
                        />
                      </div>
                    </div>

                    {/* Step 2: Delivery Area Toggle */}
                    <div className="space-y-1.5 pt-2 border-t border-zinc-200">
                      <div className="text-[11px] font-medium text-zinc-600">
                        Delivery Zone
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            playHapticClick(0.06);
                            setDeliveryArea("inside_dhaka");
                          }}
                          className={`p-2.5 rounded-lg border text-left flex items-start justify-between transition-all ${
                            deliveryArea === "inside_dhaka"
                              ? "bg-zinc-950 text-white border-zinc-950"
                              : "bg-zinc-50 text-zinc-800 border-zinc-200 hover:border-zinc-300"
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-xs flex items-center gap-1.5">
                              <Truck className="w-3.5 h-3.5" />
                              <span>Inside Dhaka</span>
                            </div>
                            <div className={`text-[10px] mt-0.5 ${deliveryArea === "inside_dhaka" ? "text-zinc-400" : "text-zinc-500"}`}>
                              Under 4h Cold Delivery
                            </div>
                          </div>
                          <span className="font-mono text-xs font-bold">
                            {isFreeDelivery ? "FREE" : "৳60"}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            playHapticClick(0.06);
                            setDeliveryArea("outside_dhaka");
                          }}
                          className={`p-2.5 rounded-lg border text-left flex items-start justify-between transition-all ${
                            deliveryArea === "outside_dhaka"
                              ? "bg-zinc-950 text-white border-zinc-950"
                              : "bg-zinc-50 text-zinc-800 border-zinc-200 hover:border-zinc-300"
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-xs flex items-center gap-1.5">
                              <Package className="w-3.5 h-3.5" />
                              <span>Outside Dhaka</span>
                            </div>
                            <div className={`text-[10px] mt-0.5 ${deliveryArea === "outside_dhaka" ? "text-zinc-400" : "text-zinc-500"}`}>
                              Insulated 48-72h Courier
                            </div>
                          </div>
                          <span className="font-mono text-xs font-bold">
                            ৳120
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Step 3: Payment Method Tabs */}
                    <div className="space-y-1.5 pt-2 border-t border-zinc-200">
                      <div className="text-[11px] font-medium text-zinc-600">
                        Payment Method
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            playHapticClick(0.06);
                            setPaymentMethod("cash_on_delivery");
                          }}
                          className={`p-2.5 rounded-lg border text-center transition-all ${
                            paymentMethod === "cash_on_delivery"
                              ? "bg-zinc-950 text-white border-zinc-950"
                              : "bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-800"
                          }`}
                        >
                          <Banknote className="w-4 h-4 mx-auto mb-1" />
                          <div className="text-xs font-semibold">Cash on Delivery</div>
                          <div className={`text-[9px] ${paymentMethod === "cash_on_delivery" ? "text-zinc-400" : "text-zinc-500"}`}>
                            Default Trust
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            playHapticClick(0.06);
                            setPaymentMethod("bkash");
                          }}
                          className={`p-2.5 rounded-lg border text-center transition-all ${
                            paymentMethod === "bkash"
                              ? "bg-pink-600 text-white border-pink-600"
                              : "bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-800"
                          }`}
                        >
                          <Smartphone className="w-4 h-4 mx-auto mb-1" />
                          <div className="text-xs font-semibold">bKash Express</div>
                          <div className={`text-[9px] ${paymentMethod === "bkash" ? "text-pink-100" : "text-zinc-500"}`}>
                            Direct Merchant
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            playHapticClick(0.06);
                            setPaymentMethod("nagad_card");
                          }}
                          className={`p-2.5 rounded-lg border text-center transition-all ${
                            paymentMethod === "nagad_card"
                              ? "bg-zinc-950 text-white border-zinc-950"
                              : "bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-800"
                          }`}
                        >
                          <CreditCard className="w-4 h-4 mx-auto mb-1" />
                          <div className="text-xs font-semibold">Nagad / Card</div>
                          <div className={`text-[9px] ${paymentMethod === "nagad_card" ? "text-zinc-400" : "text-zinc-500"}`}>
                            Digital Gateway
                          </div>
                        </button>
                      </div>

                      {paymentMethod === "bkash" && (
                        <div className="p-3 rounded-lg bg-pink-50 border border-pink-200 text-xs space-y-2 mt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-pink-900 font-medium">
                              bKash Merchant Payment Number:
                            </span>
                            <button
                              type="button"
                              onClick={handleCopyBkash}
                              className="flex items-center gap-1 text-[11px] font-mono font-bold text-pink-700 hover:text-pink-900"
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
                            placeholder="Enter 10-digit bKash TrxID"
                            value={trxId}
                            onChange={(e) => setTrxId(e.target.value)}
                            className="w-full px-3 py-1.5 text-base sm:text-xs rounded-md bg-white border border-pink-300 focus:outline-none focus:border-pink-600 text-zinc-900 font-mono uppercase"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary & Confirm Order CTA */}
                  <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-2.5 pt-3">
                    <div className="space-y-1 text-xs text-zinc-600">
                      <div className="flex justify-between">
                        <span>Items Subtotal</span>
                        <span className="font-mono font-medium text-zinc-900">{formatBDT(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-emerald-700">
                          <span>VIP Discount</span>
                          <span className="font-mono">-{formatBDT(discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Delivery</span>
                        <span className="font-mono font-medium text-zinc-900">
                          {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatBDT(deliveryFee)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-zinc-950 pt-1.5 border-t border-zinc-200">
                        <span>Grand Total</span>
                        <span className="font-mono text-base">{formatBDT(grandTotal)}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || items.length === 0}
                      className="w-full py-3 rounded-lg bg-zinc-950 text-white font-medium text-sm hover:bg-zinc-800 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Confirming Order...</span>
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
