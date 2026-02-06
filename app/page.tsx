"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="relative h-full flex flex-col justify-end pb-32">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/cover.png"
          alt="Barcelona Streets"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 px-8 text-white"
      >
        <div className="flex items-center gap-2 mb-2 opacity-90">
          <span className="px-2 py-0.5 border border-white/40 rounded-full text-xs uppercase tracking-widest backdrop-blur-md">
            Journey
          </span>
        </div>

        <h1 className="font-serif text-4xl font-medium mb-2 leading-tight">
          Porto, Lisbon <br /> Madrid & BCN
        </h1>

        <div className="flex flex-col gap-2 mt-4 text-white/90 font-light">
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <span className="tracking-wide">2/27 (木) — 3/11 (火)</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={18} />
            <span className="tracking-wide">ポルトガル ＆ スペイン</span>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span className="text-3xl font-serif">4</span>
              <span className="text-[10px] uppercase tracking-wider opacity-70">都市</span>
            </div>
            <div className="w-[1px] h-10 bg-white/20"></div>
            <div className="flex flex-col">
              <span className="text-3xl font-serif">12</span>
              <span className="text-[10px] uppercase tracking-wider opacity-70">日間</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
