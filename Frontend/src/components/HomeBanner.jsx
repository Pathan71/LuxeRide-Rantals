// src/components/HeroSleek.jsx
import React, { useEffect, useRef, useState } from "react";
import img1 from "../assets/hero.png";

export default function HeroSleek() {
  const wrapRef = useRef(null);
  const bgRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    function onMove(e) {
      const r = el.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = (clientX - r.left) / r.width;
      const y = (clientY - r.top) / r.height;
      setMouse({ x, y });
      el.style.setProperty("--mx", `${x}`);
      el.style.setProperty("--my", `${y}`);
    }

    function onLeave() {
      setMouse({ x: 0.5, y: 0.5 });
      el.style.setProperty("--mx", `0.5`);
      el.style.setProperty("--my", `0.5`);
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchend", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("touchend", onLeave);
    };
  }, []);

  const maxTranslate = 14;
  const tx = (mouse.x - 0.5) * 2 * maxTranslate;
  const ty = (mouse.y - 0.5) * 2 * (maxTranslate * 0.55);

  return (
    <div className="">
      <div
        ref={wrapRef}
        className="relative w-full lg:min-h-screen h-[600px]  bg-black overflow-hidden flex items-center justify-center"
        style={{ ["--mx"]: 0.5, ["--my"]: 0.5 }}
      >
        {/* Background */}
        <div
          ref={bgRef}
          className="absolute lg:pt-30 pt-45 inset-0 transform-gpu will-change-transform"
          style={{
            transform: `translate3d(${tx * 0.55}px, ${
              ty * 0.55
            }px, 0) scale(1.03)`,
            transition: "transform 220ms cubic-bezier(.2,.9,.25,1)",
          }}
        >
          <img
            src={img1}
            alt="Futuristic car"
            className="w-full object-center opacity-95"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/20" />
        </div>

        {/* SVG sweeps */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-40"
          viewBox="0 0 1590 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="gCenter" x1="0" x2="1">
              <stop offset="0%" stopColor="#8ee6ff" stopOpacity="0" />
              <stop offset="20%" stopColor="#58a6ff" stopOpacity="0.9" />
              <stop offset="80%" stopColor="#b78bff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ff88c2" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gSide" x1="0" x2="1">
              <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0" />
              <stop offset="30%" stopColor="#60a5fa" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
            </linearGradient>
            <filter id="glow2" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            id="centerPath"
            d="M320 420 C 520 220, 720 170, 880 190 C 1040 210, 1160 280, 1240 320"
            stroke="url(#gCenter)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow2)"
            className="center-path"
          />
          <path
            id="leftArc"
            d="M180 460 C 280 360, 480 300, 720 260"
            stroke="url(#gSide)"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow2)"
            className="side-path left"
          />
          <path
            id="rightArc"
            d="M1420 460 C 1240 360, 1040 300, 780 260"
            stroke="url(#gSide)"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow2)"
            className="side-path right"
          />
        </svg>

        {/* Refined glass CTA card */}
        <div className="relative z-10 pt-99 lg:pt-0 max-w-xl md:pt-110 w-[98%] sm:w-[62%] lg:w-[46%] mx-auto px-4">
            <div className="relative rounded-2xl p-6 bg-[rgba(255,255,255,0.04)] border border-white/6 backdrop-blur-md shadow-2xl flex items-center justify-between gap-4">
            <div>
                <p className="text-xs uppercase tracking-widest text-indigo-300/70">LUXERIDE</p>
                <h3 className="text-white md:text-sm text-lg sm:text-2xl font-semibold mt-1">
                    Next-gen fleet. Instant drive.
                </h3>
                <p className="mt-1 text-sm text-slate-300/70">
                    Rent your Dream Car. Transparent pricing. Book in seconds.
                </p>
            </div>

            <a href="/cars" className="flex items-center gap-3">
              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/20 inline-flex items-center gap-3 px-5 py-3 rounded-lg font-medium transform-gpu hover:scale-[1.03] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-300 cursor-pointer">
                <span className="text-sm text-white">See Fleet</span>
              </button>
            </a>
            <span aria-hidden className="absolute -inset-1 rounded-2xl pointer-events-none ring-1 ring-white/6" />
            </div>
        </div>
      </div>
    </div>
  );
}