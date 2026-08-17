"use client";

import Container from "@/components/common/Container";
import { Bot, Mail, Share2, MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.05] bg-background">
      <Container>
        <div className="grid gap-12 py-20 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-950/20">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Char(t)ex</span>
            </div>

            <p className="mt-6 text-sm text-slate-400 leading-relaxed">
              AI-powered analytics platform that transforms business data
              into meaningful insights.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-6 font-bold text-white text-sm uppercase tracking-widest text-slate-500">Product</h4>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="hover:text-cyan-400 cursor-pointer transition">Features</li>
              <li className="hover:text-cyan-400 cursor-pointer transition">Pricing</li>
              <li className="hover:text-cyan-400 cursor-pointer transition">Dashboard</li>
              <li className="hover:text-cyan-400 cursor-pointer transition">Documentation</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-6 font-bold text-white text-sm uppercase tracking-widest text-slate-500">Company</h4>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="hover:text-cyan-400 cursor-pointer transition">About</li>
              <li className="hover:text-cyan-400 cursor-pointer transition">Careers</li>
              <li className="hover:text-cyan-400 cursor-pointer transition">Contact</li>
              <li className="hover:text-cyan-400 cursor-pointer transition">Privacy</li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="mb-6 font-bold text-white text-sm uppercase tracking-widest text-slate-500">Connect</h4>
            <div className="flex gap-5 text-slate-400">
              <MessageSquare className="h-5 w-5 cursor-pointer transition hover:text-cyan-400" />
              <Share2 className="h-5 w-5 cursor-pointer transition hover:text-cyan-400" />
              <Mail className="h-5 w-5 cursor-pointer transition hover:text-cyan-400" />
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.05] py-8 text-center text-xs text-slate-500">
          © 2026 Char(t)ex. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}