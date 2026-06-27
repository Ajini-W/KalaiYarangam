"use client";

import React from "react";
import { motion } from "motion/react";
import { Logo } from "@/components/logo";
import {
  LogIn,
  ArrowRight,
  GraduationCap,
  Package,
  Sparkles,
  ChevronRight,
  Star,
} from "lucide-react";

const SAAS_URL = process.env.NEXT_PUBLIC_SAAS_URL || "https://app.saas.com";

const HandArrow = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 120 120"
    className={className}
    fill="none"
    strokeWidth="5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      d="M10,100 C 10,50 40,20 70,55 C 85,70 95,80 110,72"
      stroke="currentColor"
    />
    <path d="M92,58 L110,72 L98,90" stroke="currentColor" />
  </svg>
);

const CircularBadge = () => (
  <a
    href={`${SAAS_URL}/register`}
    className="relative w-28 h-28 md:w-40 md:h-40 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 rotate-12 hover:scale-110 hover:rotate-0 transition-all duration-500 cursor-pointer group"
  >
    <div className="absolute inset-2 animate-[spin_12s_linear_infinite]">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path
          id="cPath"
          d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
          fill="none"
        />
        <text
          className="text-[10px] font-black tracking-[0.2em] uppercase"
          fill="black"
        >
          <textPath href="#cPath" startOffset="0%">
            GET STARTED FREE • GET STARTED FREE •
          </textPath>
        </text>
      </svg>
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-black flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <ArrowRight className="w-6 h-6 md:w-7 md:h-7 text-primary" />
      </div>
    </div>
  </a>
);

export function HeroBase() {
  return (
    <div className="min-h-screen bg-[#0038FF] flex flex-col font-sans selection:bg-primary selection:text-black relative overflow-hidden w-full">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />

      {/* Ambient glow */}
      <div
        className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[150px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] rounded-full bg-accent-blue/10 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-4 py-4 md:px-10 md:py-6 max-w-[1440px] mx-auto w-full">
        <a href="#top" aria-label="kalaiArangam home" className="shrink-0">
          <Logo />
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1.5 border border-white/10">
          {["Industries", "Modules", "Platform", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="px-4 py-2 rounded-full text-white/80 text-sm font-medium hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <a
            href={`${SAAS_URL}/login`}
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white text-sm font-semibold hover:bg-white/20 hover:border-white/25 transition-all duration-200"
          >
            <LogIn className="w-4 h-4" />
            Log in
          </a>
          <a
            href={`${SAAS_URL}/register`}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-[#0038FF] text-sm font-bold shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/15 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Sign up free
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 pt-6 pb-28 md:pt-10 md:pb-40 px-4 flex flex-col items-center justify-center w-full max-w-[1440px] mx-auto">
        <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center z-10 mt-4 mb-16">
          {/* Text Stack */}
          <div className="w-full flex flex-col items-center relative z-10 space-y-1 md:space-y-2">
            {/* KALAI */}
            <div className="w-full flex justify-start pl-[8%] md:pl-[22%] relative z-30">
              <h1
                className="text-[clamp(4rem,11vw,150px)] font-black leading-[0.82] tracking-tighter text-primary m-0 p-0 uppercase"
                style={{
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  textShadow:
                    "3px 3px 0 #001A99, 6px 6px 0 #001A99, 9px 9px 0 #001A99, 12px 12px 0 #001A99",
                }}
              >
                KALAI
              </h1>
            </div>

            {/* YARANGAM */}
            <div className="w-full flex justify-center relative z-20">
              <h1
                className="text-[clamp(2.8rem,9vw,150px)] font-black leading-[0.82] tracking-tighter text-white m-0 p-0 uppercase"
                style={{
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  textShadow:
                    "3px 3px 0 #001A99, 6px 6px 0 #001A99, 9px 9px 0 #001A99, 12px 12px 0 #001A99",
                }}
              >
                YARANGAM
              </h1>
            </div>

            {/* ERP */}
            <div className="w-full flex justify-start pl-[12%] md:pl-[28%] relative z-10">
              <h1
                className="text-[clamp(4rem,11vw,150px)] font-black leading-[0.82] tracking-tighter text-white m-0 p-0 uppercase"
                style={{
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  textShadow:
                    "3px 3px 0 #001A99, 6px 6px 0 #001A99, 9px 9px 0 #001A99, 12px 12px 0 #001A99",
                }}
              >
                ERP
              </h1>
            </div>
          </div>

          {/* Absolute Overlays */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Floating Glass Card - Training */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[8%] left-[2%] md:left-[18%] z-30 pointer-events-auto scale-[0.65] md:scale-100 origin-bottom-left"
            >
              <div className="w-36 md:w-48 aspect-[3/3.5] bg-white/15 backdrop-blur-xl border border-white/30 rounded-[2rem] p-4 md:p-5 flex flex-col items-center justify-center rotate-[-10deg] shadow-2xl hover:rotate-0 hover:bg-white/20 transition-all duration-500">
                <div className="w-14 h-14 md:w-20 md:h-20 bg-white/15 rounded-2xl flex items-center justify-center mb-3 border border-white/20">
                  <GraduationCap className="w-7 h-7 md:w-10 md:h-10 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-xs md:text-sm text-white">
                    Training Academy
                  </p>
                  <p className="text-[10px] md:text-xs text-white/60 mt-1">
                    1,284 students
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Floating Glass Card - Rental */}
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.2,
              }}
              className="absolute top-[12%] right-[2%] md:right-[20%] z-30 pointer-events-auto scale-[0.65] md:scale-100 origin-top-right"
            >
              <div className="w-36 md:w-48 aspect-[3/3.5] bg-white/15 backdrop-blur-xl border border-white/30 rounded-[2rem] p-4 md:p-5 flex flex-col items-center justify-center rotate-[10deg] shadow-2xl hover:rotate-0 hover:bg-white/20 transition-all duration-500">
                <div className="w-14 h-14 md:w-20 md:h-20 bg-white/15 rounded-2xl flex items-center justify-center mb-3 border border-white/20">
                  <Package className="w-7 h-7 md:w-10 md:h-10 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-xs md:text-sm text-white">
                    Rental Business
                  </p>
                  <p className="text-[10px] md:text-xs text-white/60 mt-1">
                    156 items available
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Hand-drawn arrows */}
            <div className="absolute bottom-[-2%] left-[2%] md:left-[8%] w-16 h-16 md:w-28 md:h-28 z-20 text-primary">
              <HandArrow className="w-full h-full" />
            </div>
            <div className="absolute top-[3%] right-[2%] md:right-[8%] w-16 h-16 md:w-28 md:h-28 z-20 text-white/60">
              <HandArrow className="w-full h-full rotate-90" />
            </div>

            {/* Star decoration */}
            <div className="absolute top-[20%] left-[5%] md:left-[8%] z-20 hidden md:block">
              <Star className="w-6 h-6 text-primary fill-primary animate-pulse" />
            </div>
            <div className="absolute bottom-[25%] right-[10%] z-20 hidden md:block">
              <Sparkles className="w-5 h-5 text-white/40" />
            </div>

            {/* Circular Badge */}
            <div className="absolute bottom-[-8%] right-[2%] md:bottom-[-12%] md:right-[12%] z-40 pointer-events-auto scale-75 md:scale-100 origin-bottom-right">
              <CircularBadge />
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Features Section */}
      <section className="bg-white text-black rounded-t-[2.5rem] md:rounded-t-[3.5rem] px-4 py-10 md:px-10 md:py-16 relative z-20 shadow-[0_-20px_60px_rgba(0,0,0,0.15)] mt-auto w-full overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7">
          {/* Card 1 */}
          <div className="bg-[#F5F5F0] rounded-[2rem] p-7 md:p-8 flex flex-col items-center text-center relative min-h-[16rem] border border-black/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#0038FF] flex items-center justify-center mb-4 shadow-md shadow-[#0038FF]/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg md:text-xl uppercase leading-tight mb-1 font-black">
              SUBSCRIBE
              <br />
              TO CREATORS
            </h3>
            <p className="text-[10px] md:text-xs text-black/50 font-semibold mb-auto">
              you will receive $CLUB every second
            </p>

            {/* Pill Graphic */}
            <div className="relative w-full flex justify-center mt-6">
              <div className="flex items-center bg-[#0038FF] rounded-2xl p-2 pr-12 md:pr-14 text-white shadow-lg relative z-10">
                <div className="w-8 h-8 bg-primary/30 rounded-xl mr-3 border border-white/20 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-[10px] font-bold leading-none truncate">
                    baseclub.eth
                  </p>
                  <p className="text-[8px] text-white/60 leading-none mt-1">
                    23,422 points
                  </p>
                </div>
              </div>
              <div className="absolute right-0 md:right-2 top-1/2 -translate-y-1/2 bg-primary text-black font-black text-[10px] px-2.5 py-2 md:px-3 md:py-2.5 rounded-xl z-20 shadow-md whitespace-nowrap">
                20.24 $CLUB
              </div>
            </div>

            <div className="hidden md:block absolute -right-10 bottom-10 w-14 h-14 text-black/15">
              <HandArrow className="w-full h-full" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#F5F5F0] rounded-[2rem] p-7 md:p-8 flex flex-col items-center text-center relative min-h-[16rem] border border-black/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#0038FF] flex items-center justify-center mb-4 shadow-md shadow-[#0038FF]/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg md:text-xl uppercase leading-tight mb-1 font-black">
              CHOOSE HIGHT
              <br />
              $CLUB REWARDS
            </h3>
            <p className="text-[10px] md:text-xs text-black/50 font-semibold mb-auto">
              each account has a different of $CLUB
            </p>

            {/* Pill Graphic */}
            <div className="relative w-full flex justify-center mt-6">
              <div className="flex items-center bg-[#0038FF] rounded-full p-1.5 text-white shadow-lg">
                <div className="bg-white/20 text-white font-bold text-sm px-4 py-2 rounded-full mr-2">
                  20.4220
                </div>
                <div className="font-bold text-xs px-4">$CLUB</div>
              </div>
              <div className="absolute -bottom-5 right-[30%] bg-primary rounded-xl p-2 shadow-lg rotate-12 z-20">
                <ArrowRight className="w-4 h-4 text-black -rotate-45" />
              </div>
            </div>

            <div className="hidden md:block absolute -right-10 bottom-10 w-14 h-14 text-black/15">
              <HandArrow className="w-full h-full" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#F5F5F0] rounded-[2rem] p-7 md:p-8 flex flex-col items-center text-center relative min-h-[16rem] border border-black/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-md shadow-primary/30">
              <Star className="w-6 h-6 text-black fill-black" />
            </div>
            <h3 className="text-lg md:text-xl uppercase leading-tight mb-1 font-black">
              STAKE $CLUB
              <br />
              FOR CREATORS
            </h3>
            <p className="text-[10px] md:text-xs text-black/50 font-semibold mb-auto">
              you will receive $CLUB every month
            </p>

            {/* Pill Graphic */}
            <div className="flex flex-col items-center bg-primary rounded-[2rem] px-5 py-4 md:px-6 text-black shadow-lg mt-6 relative w-full max-w-[200px]">
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1">
                EST. Monthly $CLUB
              </p>
              <p className="text-xl font-black">188.34257</p>
              <div className="absolute -bottom-2 left-8 w-5 h-5 bg-primary rotate-45 rounded-sm" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
