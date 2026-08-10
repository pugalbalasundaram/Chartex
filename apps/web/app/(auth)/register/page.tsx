import Link from "next/link";

import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Char(t)ex and start analyzing your data."
    >
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link className="text-cyan-400 hover:text-cyan-300" href="/login">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
