"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "@/lib/auth";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);
      await registerUser({ username, email, password });
      alert("Registration Successful! Please log in.");
      router.push("/login");
    } catch (error: any) {
      setError(error.response?.data?.detail || "Registration Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      {error && <div className="p-3 text-sm text-red-400 bg-red-950/50 rounded-lg">{error}</div>}
      
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">Username</label>
        <input type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400" required />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400" required />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
        <div className="relative">
          <input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-12 text-white outline-none focus:border-cyan-400" required />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">Confirm Password</label>
        <input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400" required />
      </div>

      <button type="submit" disabled={loading} className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-white transition hover:bg-cyan-400 disabled:opacity-60">
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
