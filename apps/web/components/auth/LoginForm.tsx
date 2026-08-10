"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await loginUser({
        email,
        password,
      });

      console.log("✅ Login Response:", response);

      alert("Login Successful!");

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      console.error("❌ Full Error:", error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Response Data:", error.response.data);
      }

      alert(error.response?.data?.detail || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Email
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-12 text-white outline-none transition focus:border-cyan-400"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-400">
          <input type="checkbox" />
          Remember me
        </label>

        <button
          type="button"
          className="text-sm text-cyan-400 hover:underline"
        >
          Forgot Password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="text-center text-sm text-slate-400">
        Don't have an account?{" "}
        <Link href="/register" className="cursor-pointer text-cyan-400 hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
}