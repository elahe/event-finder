import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LightRays from "./components/LightRays";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const SchibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-Schibsted_Grotesk",
  subsets: ["latin"],
});

const MartianMono = Martian_Mono({
  variable: "--font-Martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "event finder",
  description: "the nub that developers find the events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("min-h-screen", "antialiased", SchibstedGrotesk.variable, MartianMono.variable, "font-sans", geist.variable)}
    >
      <body >
        <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
          <LightRays
          raysOrigin="top-center-offset"
          raysColor="#5dacea"
          raysSpeed={0.5}
          lightSpread={0.9}
          rayLength={1.4}
          followMouse={true}
          mouseInfluence={0.02}
          noiseAmount={0}
          distortion={0.01}
          className="custom-rays"
          pulsating={false}
          fadeDistance={1}
          saturation={1}
      />
        </div>
        {children}
      </body>
    </html>
  );
}
