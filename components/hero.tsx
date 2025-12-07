"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Terminal, MoveRight, Radio, ScanLine, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-background text-foreground font-mono selection:bg-primary selection:text-black">

      {/* SCANLINES & GRID */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 255, 255, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
          backgroundSize: "100% 4px, 6px 100%"
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* HUD CORNERS */}
      <div className="absolute top-8 left-8 w-64 h-64 border-l-2 border-t-2 border-primary/50 opacity-50 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-64 h-64 border-r-2 border-b-2 border-primary/50 opacity-50 pointer-events-none" />

      {/* DATA STREAMS */}
      <div className="absolute top-1/2 right-12 -translate-y-1/2 hidden lg:flex flex-col gap-4 text-xs text-primary/40 font-mono text-right pointer-events-none">
        {["SYSTEM_READY", "NET_HASH: 0x482...A9", "UPTIME: 99.99%", "MEM_POOL: ACTIVE", "DEFI_LAYER: SYNCED"].map((txt, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            {txt}
          </motion.div>
        ))}
      </div>

      {/* MAIN CONTENT CORE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 relative max-w-5xl w-full px-4"
      >
        <div className="border border-primary/30 bg-black/40 backdrop-blur-sm p-8 md:p-12 relative overflow-hidden group">

          {/* DECORATIVE LINE */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

          {/* HEADER TAGS */}
          <div className="flex justify-between items-center mb-8 text-xs font-bold tracking-widest text-primary/60">
            <span className="flex items-center gap-2">
              <ScanLine className="w-4 h-4" /> PROTOCOL_V2
            </span>
            <span className="flex items-center gap-2">
              <Radio className="w-3 h-3 animate-pulse" /> LIVE
            </span>
          </div>

          {/* MAIN TITLE */}
          <div className="space-y-6 mb-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-tight tracking-tight">
              <span className="block text-foreground">Decentralized</span>
              <span className="block text-primary">Mint Protocol</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed font-sans">
              Register, license, and monetize AI-generated intellectual property on-chain.
              Built on <span className="text-primary font-bold">Story Protocol</span> for transparent,
              automated IP governance.
            </p>
          </div>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-5">
            <Button size="lg" className="h-14 px-8 text-base md:text-lg font-bold uppercase tracking-widest rounded-none bg-primary text-black hover:bg-white hover:text-black border-2 border-transparent transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] group">
              <Link href="/generate" className="flex items-center gap-3">
                <Terminal className="w-5 h-5" /> Initialize Mint
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-8 text-base md:text-lg font-bold uppercase tracking-widest rounded-none border-2 border-primary/50 text-primary hover:bg-primary/10 hover:border-primary transition-all">
              <Link href="/gallery" className="flex items-center gap-3">
                <Activity className="w-5 h-5" /> View Network
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* BOTTOM TICKER */}
      <div className="absolute bottom-0 left-0 w-full bg-primary/5 border-t border-primary/20 p-2 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block text-xs font-mono text-primary/60">
          LATEST MINTS: #8822 [AI_CORE] --- #9921 [NEURAL_NET] --- #1102 [SYNTHETIC_TEXT] --- BLOCK HEIGHT: 1928422 ---
          LATEST MINTS: #8822 [AI_CORE] --- #9921 [NEURAL_NET] --- #1102 [SYNTHETIC_TEXT] --- BLOCK HEIGHT: 1928422 ---
        </div>
      </div>
    </section>
  );
}
