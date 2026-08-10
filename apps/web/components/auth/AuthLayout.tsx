"use client";

import { ReactNode } from "react";
import { BarChart3 } from "lucide-react";
import AuthDashboardPreview from "./AuthDashboardPreview";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-950">
      {/* Left Side */}
      <div className="relative hidden overflow-hidden lg:flex flex-col justify-center px-20">
        {/* Background Glow */}
        <div className="absolute left-16 top-16 h-96 w-96 rounded-full bg-cyan-500/30 blur-[120px]" />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <BarChart3 className="h-9 w-9 text-cyan-400" />

            <h1 className="text-4xl font-bold text-white">
              Char(t)ex
            </h1>
          </div>

          {/* Heading */}
          <h2 className="mt-10 text-5xl font-bold leading-tight text-white">
            AI Analytics
            <br />
            Made Simple.
          </h2>

          {/* Description */}
          <p className="mt-6 max-w-lg text-lg text-slate-400">
            Upload your datasets, generate dashboards, discover trends,
            and receive AI-powered insights within seconds.
          </p>

          {/* Dashboard Preview */}
          <AuthDashboardPreview />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.01]">
          <h1 className="text-4xl font-bold text-white">
            {title}
          </h1>

          <p className="mt-3 text-slate-400">
            {subtitle}
          </p>

          <div className="mt-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}