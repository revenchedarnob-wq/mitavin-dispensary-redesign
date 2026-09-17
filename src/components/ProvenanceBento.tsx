"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ThermometerSnowflake,
  Plane,
  Truck,
  Barcode,
  CheckCircle2,
  Activity,
  Sparkles,
  Clock,
  ArrowUpRight,
  RotateCcw,
  Check,
  Lock,
  Boxes,
  Zap,
} from "lucide-react";
import { playHapticGlass, playHapticClick, playHapticPop } from "@/lib/sound";
import { triggerSpark } from "@/components/ClickSpark";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

function BentoCard({ children, className = "", glowColor = "rgba(16, 185, 129, 0.12)" }: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  // Framer Motion 3D gyro tilt physics
  const xMotion = useMotionValue(0);
  const yMotion = useMotionValue(0);

  const springConfig = { stiffness: 280, damping: 26 };
  const xSpring = useSpring(xMotion, springConfig);
  const ySpring = useSpring(yMotion, springConfig);

  const rotateX = useTransform(ySpring, [-0.5, 0.5], [3.2, -3.2]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-3.2, 3.2]);

  // Safe SSR & touch media detection
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    setIsTouch(mediaQuery.matches);

    const handlePointerChange = (e: MediaQueryListEvent) => {
      setIsTouch(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handlePointerChange);
      return () => mediaQuery.removeEventListener("change", handlePointerChange);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    xMotion.set(x);
    yMotion.set(y);

    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePos({ x: glareX, y: glareY });
  };

  const handleMouseEnter = () => {
    if (isTouch) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    xMotion.set(0);
    yMotion.set(0);
  };

  return (
    <div className="relative w-full h-full [perspective:1000px]">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={() => {
          setIsTouch(true);
          setIsHovered(false);
          xMotion.set(0);
          yMotion.set(0);
        }}
        style={{
          transformStyle: "preserve-3d",
          rotateX: isTouch ? 0 : rotateX,
          rotateY: isTouch ? 0 : rotateY,
        }}
        className={`group relative rounded-2xl bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700/90 transition-[border-color,background-color] duration-300 overflow-hidden flex flex-col justify-between ${className}`}
      >
        {/* Cursor-Coupled Specular Glare Overlay */}
        {isHovered && !isTouch && (
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl z-20 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.08), transparent 60%)`,
            }}
          />
        )}

        {/* Ambient Subtle Accent Glow */}
        <div
          className="absolute -inset-px pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
          style={{
            background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, ${glowColor}, transparent 70%)`,
          }}
        />

        <div className="relative z-10 w-full h-full flex flex-col justify-between">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export function ProvenanceBento() {
  // Batch verification state
  const [scanState, setScanState] = useState<"idle" | "scanning" | "verified">("idle");
  const scanButtonRef = useRef<HTMLButtonElement>(null);

  const handleStartScan = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (scanState === "scanning") return;

    playHapticGlass(0.08);
    setScanState("scanning");

    // Capture coordinates for spark burst
    const clientX = e.clientX || (scanButtonRef.current ? scanButtonRef.current.getBoundingClientRect().left + 80 : 200);
    const clientY = e.clientY || (scanButtonRef.current ? scanButtonRef.current.getBoundingClientRect().top + 20 : 200);

    setTimeout(() => {
      setScanState("verified");
      playHapticGlass(0.08);
      triggerSpark(clientX, clientY, "#10B981", 10, 32);
    }, 600);
  };

  const handleResetScan = (e: React.MouseEvent) => {
    e.stopPropagation();
    playHapticClick(0.06);
    setScanState("idle");
  };

  return (
    <section className="rounded-3xl bg-zinc-950 text-white p-6 sm:p-10 lg:p-12 space-y-8 sm:space-y-10 border border-zinc-800 shadow-2xl relative overflow-hidden">
      {/* Background Decorative Ambient Radials */}
      <div
        className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-25"
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Header Block */}
      <div className="max-w-3xl space-y-3.5 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700/80 text-zinc-300 text-xs font-mono font-medium shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="tracking-wide uppercase text-[11px]">THE MITAVIN PROVENANCE STANDARD</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
          100% Laboratory Sourced. Zero Sea Freight Heat Exposure.
        </h2>

        <p className="text-sm text-zinc-400 leading-relaxed font-normal">
          Most imported infant formulas and bioactive supplements in Bangladesh endure 45 days inside 55°C steel shipping
          containers across the Indian Ocean, permanently degrading fragile probiotics, omegas, and delicate peptides. Mitavin
          exclusively operates direct temperature-logged air freight from London Heathrow and New York JFK.
        </p>
      </div>

      {/* 4-Card 3D Gyro Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 pt-2 relative z-10">
        {/* TILE 1: Cold-Chain Telemetry (Continuous 2°C–8°C Monitoring) */}
        <div className="md:col-span-7">
          <BentoCard glowColor="rgba(16, 185, 129, 0.18)" className="p-6 sm:p-7 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-medium">
                  <ThermometerSnowflake className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>ACTIVE SENSOR TELEMETRY • LOT 94820</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span>REFRESH: 10s</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                  Continuous 2°C – 8°C Cryo Monitoring
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Real-time thermal telemetry logged at 60-second intervals from London cold-vault packaging to Dhaka handover.
                </p>
              </div>
            </div>

            {/* Live SVG Temperature Telemetry Wave Graph */}
            <div className="rounded-xl bg-zinc-950/90 border border-zinc-800/90 p-4 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 border-b border-zinc-800/80 pb-2">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  LHR ➔ DAC IN-FLIGHT TEMP PROFILE
                </span>
                <span className="text-emerald-400 font-semibold">4.2°C [STABLE]</span>
              </div>

              <div className="relative h-28 sm:h-32 w-full">
                {/* SVG Visualizer */}
                <svg
                  viewBox="0 0 460 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#10B981" floodOpacity="0.6" />
                    </filter>
                  </defs>

                  {/* Acceptable 2°C - 8°C Safe Zone */}
                  <rect
                    x="0"
                    y="18"
                    width="460"
                    height="84"
                    fill="rgba(16, 185, 129, 0.04)"
                    stroke="rgba(16, 185, 129, 0.15)"
                    strokeDasharray="4 4"
                    rx="4"
                  />
                  <text x="8" y="30" fill="#71717A" fontSize="9" fontFamily="monospace">
                    MAX SAFE LIMIT: 8.0°C
                  </text>
                  <text x="8" y="96" fill="#71717A" fontSize="9" fontFamily="monospace">
                    MIN SAFE LIMIT: 2.0°C
                  </text>

                  {/* 4.2°C Reference Target Line */}
                  <line
                    x1="0"
                    y1="64"
                    x2="460"
                    y2="64"
                    stroke="#10B981"
                    strokeOpacity="0.25"
                    strokeDasharray="2 2"
                  />

                  {/* Gradient Area Fill under wave */}
                  <path
                    d="M 0,66 C 45,61 80,68 120,63 C 160,59 200,67 240,62 C 280,58 320,66 360,63 C 400,60 430,64 460,63 L 460,110 L 0,110 Z"
                    fill="url(#tempGradient)"
                  />

                  {/* Primary Telemetry Curve */}
                  <path
                    d="M 0,66 C 45,61 80,68 120,63 C 160,59 200,67 240,62 C 280,58 320,66 360,63 C 400,60 430,64 460,63"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    filter="url(#emeraldGlow)"
                  />

                  {/* Coordinate Sample Nodes */}
                  <circle cx="120" cy="63" r="3" fill="#047857" stroke="#10B981" strokeWidth="1.5" />
                  <circle cx="240" cy="62" r="3" fill="#047857" stroke="#10B981" strokeWidth="1.5" />
                  <circle cx="360" cy="63" r="3" fill="#047857" stroke="#10B981" strokeWidth="1.5" />

                  {/* Live Endpoint Ripple & Beacon */}
                  <circle cx="452" cy="63" r="5" fill="#10B981" className="animate-pulse" />
                  <circle cx="452" cy="63" r="10" stroke="#10B981" strokeWidth="1" opacity="0.4" />
                </svg>
              </div>

              {/* Status Readout Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-800/80 font-mono text-center">
                <div className="p-1.5 rounded bg-zinc-900/60 border border-zinc-800/60">
                  <div className="text-[10px] text-zinc-500 uppercase">Current Pod</div>
                  <div className="text-xs font-bold text-emerald-400">4.2°C [STABLE]</div>
                </div>
                <div className="p-1.5 rounded bg-zinc-900/60 border border-zinc-800/60">
                  <div className="text-[10px] text-zinc-500 uppercase">Deviation</div>
                  <div className="text-xs font-bold text-white">0.0°C</div>
                </div>
                <div className="p-1.5 rounded bg-zinc-900/60 border border-zinc-800/60">
                  <div className="text-[10px] text-zinc-500 uppercase">Sensor ID</div>
                  <div className="text-xs font-bold text-zinc-300">CRYOPOD-948</div>
                </div>
                <div className="p-1.5 rounded bg-zinc-900/60 border border-zinc-800/60">
                  <div className="text-[10px] text-zinc-500 uppercase">Status</div>
                  <div className="text-xs font-bold text-emerald-400">NOMINAL</div>
                </div>
              </div>
            </div>
          </BentoCard>
        </div>

        {/* TILE 2: Direct Air-Freight Priority (<48h Heathrow ➔ Dhaka Air Bridge) */}
        <div className="md:col-span-5">
          <BentoCard glowColor="rgba(6, 182, 212, 0.18)" className="p-6 sm:p-7 space-y-5">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-mono font-medium">
                <Plane className="w-3.5 h-3.5 text-cyan-400" />
                <span>AIR TRANSIT NODE</span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                  &lt;48h Heathrow ➔ Dhaka Air Bridge
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Scheduled wide-body air cargo eliminates 45-day sea route equatorial container heating.
                </p>
              </div>
            </div>

            {/* Flight Path Vector Card */}
            <div className="rounded-xl bg-zinc-950/90 border border-zinc-800/90 p-4 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <div>
                  <div className="text-cyan-400 font-bold text-sm tracking-wider">LHR</div>
                  <div className="text-[10px] text-zinc-400">London Heathrow T4</div>
                  <div className="text-[9px] text-zinc-500 mt-0.5">DEP: 21:40 GMT</div>
                </div>

                <div className="flex-1 px-4 flex flex-col items-center">
                  <div className="text-[10px] font-mono text-zinc-400 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>38h 14m Total</span>
                  </div>
                  <div className="relative w-full flex items-center justify-center">
                    {/* Track Line */}
                    <div className="w-full h-0.5 bg-zinc-800 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-500" />
                    </div>
                    {/* Animated Flight Icon */}
                    <div className="absolute -top-2.5 bg-zinc-950 border border-cyan-500/80 rounded-full p-1 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                      <Plane className="w-3 h-3 rotate-45" />
                    </div>
                  </div>
                  <div className="text-[9px] font-mono text-emerald-400 mt-1.5">Direct Air Corridor</div>
                </div>

                <div className="text-right">
                  <div className="text-emerald-400 font-bold text-sm tracking-wider">DAC</div>
                  <div className="text-[10px] text-zinc-400">Shahjalal Int&apos;l Hub</div>
                  <div className="text-[9px] text-zinc-500 mt-0.5">FAST-TRACK ENTRY</div>
                </div>
              </div>

              {/* Zero Sea-Heat Assurance Banner */}
              <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-900/40 text-[11px] space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>Zero Marine Hold Heat Assurance</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                  Standard sea cargo reaches 55°C–65°C across the Red Sea and Bay of Bengal, destroying bio-active formula lipids.
                  Mitavin cargo stays pressurized at 4°C in sealed airline containers.
                </p>
              </div>
            </div>
          </BentoCard>
        </div>

        {/* TILE 3: 1-Click Sample Batch Verifier & 10x Guarantee (md:col-span-7) */}
        <div className="md:col-span-7">
          <BentoCard glowColor="rgba(245, 158, 11, 0.15)" className="p-6 sm:p-7 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs font-mono font-medium">
                <Barcode className="w-3.5 h-3.5 text-amber-400" />
                <span>FACTORY SERIAL TRACEABILITY</span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                  Instant Lot Authenticity Cryptographic Verification
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Verify genuine factory origin barcodes against UK &amp; EU pharmaceutical laboratory registries with 1 click.
                </p>
              </div>
            </div>

            {/* Interactive Verification Terminal */}
            <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-4 sm:p-5 space-y-4 relative overflow-hidden">
              {/* Scan Laser Animation Line */}
              {scanState === "scanning" && (
                <motion.div
                  initial={{ top: "0%" }}
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981] z-30 pointer-events-none"
                />
              )}

              {/* Sample Batch Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Test Batch Reference</div>
                  <div className="font-mono text-xs sm:text-sm font-semibold text-emerald-400 flex items-center gap-2">
                    <span>#LHR-94820-UK</span>
                    <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-sans">
                      Aptamil Gold+ Infant
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {scanState !== "verified" ? (
                    <button
                      ref={scanButtonRef}
                      onClick={handleStartScan}
                      disabled={scanState === "scanning"}
                      className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all duration-150 flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-75 cursor-pointer"
                    >
                      {scanState === "scanning" ? (
                        <>
                          <span className="w-3 h-3 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                          <span>Scanning Cryo Ledger...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>Run Live Verification Scan</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleResetScan}
                      className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Reset and Scan Again"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Re-Scan</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Verification Outcome Card / State */}
              <AnimatePresence mode="wait">
                {scanState === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400"
                  >
                    <div className="flex items-center gap-2.5">
                      <Barcode className="w-5 h-5 text-zinc-500" />
                      <span>Click above to execute cryptographic ledger check against Danone Nutricia UK.</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">READY</span>
                  </motion.div>
                )}

                {scanState === "scanning" && (
                  <motion.div
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 flex items-center gap-3 text-xs text-emerald-300 font-mono"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Verifying serial checksum against UK National Health Service / Danone UK nodes...</span>
                  </motion.div>
                )}

                {scanState === "verified" && (
                  <motion.div
                    key="verified"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/60 space-y-3 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs sm:text-sm font-mono">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>✓ UK NHS &amp; MHRA LOT VERIFIED</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/60">
                        100% Hermetic Seal Passed
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono text-zinc-300 pt-1">
                      <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800">
                        <div className="text-[9px] text-zinc-500">ORIGIN FACILITY</div>
                        <div className="text-white font-medium">Danone Wexford UK/EU</div>
                      </div>
                      <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800">
                        <div className="text-[9px] text-zinc-500">TAMPER FLAG</div>
                        <div className="text-emerald-400 font-medium">ZERO (SEAL INTACT)</div>
                      </div>
                      <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800 col-span-2 sm:col-span-1">
                        <div className="text-[9px] text-zinc-500">EXPIRY RUNTIME</div>
                        <div className="text-white font-medium">18-OCT-2026</div>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span className="truncate">SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 10x Refund Guarantee Banner & Pharmacist Link */}
              <div className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-[11px] leading-relaxed">
                    <strong className="text-white">10x Money-Back Guarantee:</strong> Backed by independent laboratory
                    chromatography. Zero compromise.
                  </span>
                </div>

                <a
                  href="https://wa.me/8801978303867?text=Hello%20Mitavin%20Team,%20I%20would%20like%20to%20verify%20a%20batch."
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => playHapticPop(0.08)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 text-xs font-medium transition-colors whitespace-nowrap"
                >
                  <span>Verify with Pharmacist</span>
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                </a>
              </div>
            </div>
          </BentoCard>
        </div>

        {/* TILE 4: Dhaka Express Climate-Insulated Dispatch (md:col-span-5) */}
        <div className="md:col-span-5">
          <BentoCard glowColor="rgba(16, 185, 129, 0.15)" className="p-6 sm:p-7 space-y-5">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-mono font-medium">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                <span>LAST-MILE LOGISTICS</span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                  Sub-4-Hour Temperature Shielded Couriers
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Dedicated phase-change vacuum insulated cold-packs dispatched to Dhaka Metro residences.
                </p>
              </div>
            </div>

            {/* Insulated Climate Pod Telemetry */}
            <div className="rounded-xl bg-zinc-950/90 border border-zinc-800/90 p-4 space-y-3.5">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-2 border-b border-zinc-800/80">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  DHAKA DISPATCH HUB
                </span>
                <span className="text-emerald-400 font-semibold">Avg ETA: 142 mins</span>
              </div>

              {/* Coverage Hubs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-zinc-900/70 border border-zinc-800/80 flex items-center justify-between">
                  <span className="text-zinc-200">Gulshan</span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    32m avg
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-900/70 border border-zinc-800/80 flex items-center justify-between">
                  <span className="text-zinc-200">Banani</span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    28m avg
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-900/70 border border-zinc-800/80 flex items-center justify-between">
                  <span className="text-zinc-200">Dhanmondi</span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    44m avg
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-900/70 border border-zinc-800/80 flex items-center justify-between">
                  <span className="text-zinc-200">Uttara</span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    52m avg
                  </span>
                </div>
              </div>

              {/* Pod Specs Footer */}
              <div className="p-2.5 rounded-lg bg-zinc-900/50 border border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Boxes className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Insulated Vacuum Pods: 8 Active Units</span>
                </div>
                <span className="font-mono text-emerald-400">2°C–8°C Maintained</span>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}

export default ProvenanceBento;
