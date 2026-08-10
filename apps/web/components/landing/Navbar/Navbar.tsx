"use client";

import Link from "next/link";
import { ArrowUpRight, BarChart3, Menu } from "lucide-react";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#05070c]/70 backdrop-blur-xl"
    >
      <Container className="flex h-[72px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-xl bg-cyan-950/30 p-1.5 shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-shadow hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]"
          >
            <BarChart3 className="h-7 w-7 text-cyan-400" />
          </motion.div>
          <span className="text-xl font-bold tracking-tight text-white">
            Char(t)ex
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-slate-300 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm text-slate-300 transition hover:text-white sm:block">
            Sign in
          </Link>
          <Link href="/register" className="group flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
            Start for free <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <Menu className="h-5 w-5 text-slate-300 lg:hidden" />
        </div>
      </Container>
    </motion.header>
  );
}
