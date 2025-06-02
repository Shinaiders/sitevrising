import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "./components/analytics";

export const metadata: Metadata = {
  title: "UMBRELLIX - Servidor Brasileiro de V Rising | Lançamento 6 de Junho às 19h",
  description: "Junte-se ao UMBRELLIX, o melhor servidor brasileiro de V Rising! Servidores PVP e PVE com baixa latência, comunidade ativa e eventos especiais. Lançamento em 6 de junho de 2024 às 19:00!",
  keywords: "UMBRELLIX, V Rising, servidor brasileiro, PVP, PVE, vampiro, MMO, survival, Brasil",
  authors: [{ name: "UMBRELLIX" }],
  openGraph: {
    title: "UMBRELLIX - Servidor Brasileiro de V Rising",
    description: "Desperte seu vampiro interior no UMBRELLIX! O melhor servidor brasileiro de V Rising.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "UMBRELLIX - Servidor Brasileiro de V Rising",
    description: "Desperte seu vampiro interior no UMBRELLIX! O melhor servidor brasileiro de V Rising.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Creepster&family=Nosifer&family=Inter:wght@400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased font-inter bg-black">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
