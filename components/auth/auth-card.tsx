"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Github, LoaderCircle } from "lucide-react";
import { signIn, signInWithOAuth, signUp, type AuthState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/ui/animated-background";

const initialState: AuthState = {};
export function AuthCard({ mode, nextPath }: { mode: "login" | "signup"; nextPath?: string }) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction, pending] = useActionState(action, initialState);
  const isLogin = mode === "login";

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#05060c] px-4 py-8 text-white">
      <AnimatedBackground />
      <section className="relative z-10 w-full max-w-md rounded-[30px] border border-white/10 bg-white/[.045] p-6 shadow-[0_30px_90px_rgba(0,0,0,.35)] backdrop-blur-xl sm:p-9">
        <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded-lg text-sm font-semibold tracking-tight text-white/80 hover:text-white">
          <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-violet-300 to-cyan-300 text-xs font-bold text-black">⌘</span>
          spidycode
        </Link>
        <p className="page-kicker mt-8">{isLogin ? "WELCOME BACK" : "YOUR NEXT CHAPTER"}</p>
        <h1 className="page-title mt-2">{isLogin ? "Welcome back." : "Start building."}</h1>
        <p className="page-description mt-3">{isLogin ? "Sign in to continue your learning journey." : "Create your account and turn your learning into proof."}</p>
        <div className="mt-7 grid gap-3">
          <form action={signInWithOAuth.bind(null, "github")}>
            <Button type="submit" variant="outline" className="w-full">
              <Github className="size-4" /> Continue with GitHub
            </Button>
          </form>
          <form action={signInWithOAuth.bind(null, "google")}>
            <Button type="submit" variant="outline" className="w-full">
              <span className="font-semibold text-cyan-200">G</span> Continue with Google
            </Button>
          </form>
        </div>
        <div className="my-7 flex items-center gap-3 text-xs text-white/35 before:h-px before:flex-1 before:bg-white/10 after:h-px after:flex-1 after:bg-white/10">OR</div>
        <form action={formAction} className="grid gap-4">
          <input type="hidden" name="next" value={nextPath ?? "/dashboard"} />
          <label className="grid gap-2 text-sm font-medium">
            Email
            <input required autoComplete="email" name="email" type="email" className="rounded-xl border border-white/10 bg-black/20 px-3.5 py-3 text-white outline-none placeholder:text-white/30 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20" placeholder="you@example.com" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Password
            <input required minLength={8} autoComplete={isLogin ? "current-password" : "new-password"} name="password" type="password" className="rounded-xl border border-white/10 bg-black/20 px-3.5 py-3 text-white outline-none placeholder:text-white/30 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20" placeholder="At least 8 characters" />
          </label>
          {state.error && <p role="alert" className="rounded-lg bg-rose-400/10 px-3 py-2 text-sm text-rose-200">{state.error}</p>}
          {state.message && <p role="status" className="rounded-lg bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100">{state.message}</p>}
          <Button disabled={pending} type="submit" className="mt-2 w-full">
            {pending && <LoaderCircle className="size-4 animate-spin" />}
            {isLogin ? "Sign in" : "Create account"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-white/50">
          {isLogin ? "New to SpidyCode?" : "Already have an account?"} <Link href={isLogin ? "/signup" : "/login"} className="focus-ring rounded-sm font-semibold text-cyan-200 hover:text-cyan-100">{isLogin ? "Create an account" : "Sign in"}</Link>
        </p>
      </section>
    </main>
  );
}
