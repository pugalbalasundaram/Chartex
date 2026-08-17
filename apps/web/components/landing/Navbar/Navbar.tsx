"use client";

import Link from "next/link";
import { ArrowRight, Bot, Menu } from "lucide-react";
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
      className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-2xl"
    >
      <Container className="flex h-[72px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-950/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Char(t)ex
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-400 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/chat" className="group flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-400">
            Start Analyzing <ArrowRight className="h-4 w-4" />
          </Link>
          <Menu className="h-6 w-6 text-white lg:hidden" />
        </div>
      </Container>
    </motion.header>
  );
}
