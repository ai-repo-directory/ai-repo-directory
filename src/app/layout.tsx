import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { absoluteUrl } from "@/lib/format";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: "AI Repo Directory",
    template: "%s · AI Repo Directory",
  },
  description:
    "Discover curated open-source AI repositories — agents, RAG, inference, local AI, and more — with transparent discovery scores.",
  openGraph: {
    type: "website",
    siteName: "AI Repo Directory",
    title: "AI Repo Directory",
    description:
      "A high-signal directory of open-source AI projects for engineers and researchers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Repo Directory",
    description:
      "Curated open-source AI repositories with transparent ranking.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} flex min-h-full flex-col font-sans antialiased`}
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
