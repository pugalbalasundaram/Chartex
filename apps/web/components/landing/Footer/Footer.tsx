"use client";

import Container from "@/components/common/Container";
import { BarChart3, Link, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <Container>
        <div className="grid gap-10 py-16 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <BarChart3 className="h-7 w-7 text-cyan-400" />
              <span className="text-2xl font-bold text-white">
                Char(t)ex
              </span>
            </div>

            <p className="mt-5 text-slate-400">
              AI-powered analytics platform that transforms business data
              into meaningful insights.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-5 font-semibold text-white">Product</h4>

            <ul className="space-y-3 text-slate-400">
              <li>Features</li>
              <li>Pricing</li>
              <li>Dashboard</li>
              <li>Documentation</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-5 font-semibold text-white">Company</h4>

            <ul className="space-y-3 text-slate-400">
              <li>About</li>
              <li>Careers</li>
              <li>Contact</li>
              <li>Privacy</li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="mb-5 font-semibold text-white">Connect</h4>

            <div className="flex gap-4 text-cyan-400">
              <Link className="cursor-pointer transition hover:scale-110" />
              <Mail className="cursor-pointer transition hover:scale-110" />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 text-center text-sm text-slate-500">
          © 2026 Char(t)ex. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}