import { ShieldCheck, Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PageHero } from "@/components/dashboard/page-hero";
import { getCurrentProfile } from "@/lib/auth/dal";
import { SoundToggle } from "@/components/ui/sound-toggle";
import { PasswordForm } from "@/components/auth/password-form";

export default async function SettingsPage() {
  const profile = await getCurrentProfile();

  return (
    <DashboardShell>
      <section className="mx-auto max-w-3xl">
        <PageHero
          eyebrow="Settings"
          title="Account settings"
          description="Fine-tune your experience, protect your account, and keep your profile in sync with your growth."
          badge="Secure by default"
        />
        <div className="mt-7 grid gap-4">
          <article className="rounded-[28px] border border-white/10 bg-white/[.035] p-6 shadow-[0_24px_60px_rgba(0,0,0,.16)]">
            <div className="flex items-center gap-2 text-cyan-100">
              <Sparkles className="size-4" />
              <h2 className="font-semibold">Security</h2>
            </div>
            <p className="mt-2 text-sm text-white/60">Update your public profile from the Profile page, or secure your account below.</p>
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/15 p-4">
              <PasswordForm />
            </div>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-white/[.035] p-4 shadow-[0_24px_60px_rgba(0,0,0,.16)]">
            <SoundToggle />
          </article>
          <article className="rounded-[28px] border border-white/10 bg-white/[.035] p-6 shadow-[0_24px_60px_rgba(0,0,0,.16)]">
            <div className="flex items-center gap-2 text-violet-200">
              <ShieldCheck className="size-4" />
              <h2 className="font-semibold">Role</h2>
            </div>
            <p className="mt-2 text-sm capitalize text-white/65">{profile?.role ?? "learner"}</p>
            <p className="mt-1 text-xs text-white/45">Recruiter roles are verified by the SpidyCode team before job publishing is enabled.</p>
          </article>
        </div>
      </section>
    </DashboardShell>
  );
}
