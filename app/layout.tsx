import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/feedback";
import { KeyboardShortcuts } from "@/components/ui/keyboard-shortcuts";
import "./globals.css";

export const metadata: Metadata = { title: { default: "SpidyCode — Learn. Build. Compete. Get Hired.", template: "%s | SpidyCode" }, description: "Project-based learning for the next generation of software engineers.", metadataBase: new URL("https://spidycode.dev"), openGraph: { type: "website", siteName: "SpidyCode", title: "SpidyCode — Learn. Build. Compete. Get Hired.", description: "Build real projects and your developer profile." } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ToastProvider>
          {children}
          <KeyboardShortcuts />
        </ToastProvider>
      </body>
    </html>
  );
}
