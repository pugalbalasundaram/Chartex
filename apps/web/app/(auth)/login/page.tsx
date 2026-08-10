import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to access your Char(t)ex dashboard."
    >
      <LoginForm />
    </AuthLayout>
  );
}