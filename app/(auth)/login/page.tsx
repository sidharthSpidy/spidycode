import { AuthCard } from "@/components/auth/auth-card";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <AuthCard mode="login" nextPath={next} />;
}
