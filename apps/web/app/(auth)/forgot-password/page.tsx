import Link from "next/link";

import AuthLayout from "@/components/auth/AuthLayout";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Password recovery is not configured yet."
    >
      <Link className="text-cyan-400 hover:text-cyan-300" href="/login">
        Return to sign in
      </Link>
    </AuthLayout>
  );
}
