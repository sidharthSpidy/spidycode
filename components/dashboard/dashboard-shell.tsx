import { Award, BookOpen, BriefcaseBusiness, FileText, FolderGit2, LayoutDashboard, Settings, Trophy, UserRound, UsersRound } from "lucide-react";
import { motion } from "framer-motion";
import { AppEffects } from "@/components/ui/app-effects";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { DashboardSidebar } from "./dashboard-sidebar";

const links = [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }, { href: "/roadmaps", label: "Roadmaps", icon: BookOpen }, { href: "/projects/submit", label: "Submit project", icon: FolderGit2 }, { href: "/leaderboard", label: "Leaderboard", icon: Trophy }, { href: "/community", label: "Community", icon: UsersRound }, { href: "/jobs", label: "Jobs", icon: BriefcaseBusiness }, { href: "/certificates", label: "Certificates", icon: Award }, { href: "/resume", label: "Resume", icon: FileText }, { href: "/profile", label: "Profile", icon: UserRound }, { href: "/settings", label: "Settings", icon: Settings }];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-canvas min-h-screen bg-[#05060c] text-white lg:flex">
      <AnimatedBackground />
      <AppEffects />
      <DashboardSidebar links={links} />
      <main className="mx-auto w-full max-w-7xl flex-1 p-5 pt-20 sm:p-8 sm:pt-24 lg:p-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="motion-reveal">
          <div className="mb-6 flex items-center justify-end">
            <ThemeToggle />
          </div>
          {children}
        </motion.div>
      </main>
    </div>
  );
}
