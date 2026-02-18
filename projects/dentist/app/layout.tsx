import type { Metadata } from "next";
import "./globals.css";

/**
 * Métadonnées SEO pour le site du Cabinet Dentaire Dr Abensour
 * Optimisées pour le référencement local à Strasbourg
 */
export const metadata: Metadata = {
  title: {
    default: "Cabinet Dentaire Dr Abensour - Dentiste à Strasbourg",
    template: "%s | Cabinet Dentaire Dr Abensour",
  },
  description:
    "Cabinet dentaire moderne à Strasbourg. Le Dr Abensour et son équipe vous accueillent pour tous vos soins dentaires : implants, orthodontie, esthétique, urgences. Prenez rendez-vous en ligne.",
  keywords: [
    "dentiste",
    "Strasbourg",
    "cabinet dentaire",
    "soins dentaires",
    "implants dentaires",
    "orthodontie",
    "blanchiment dentaire",
    "urgence dentaire",
    "Dr Abensour",
  ],
  authors: [{ name: "Cabinet Dentaire Dr Abensour" }],
  creator: "Cabinet Dentaire Dr Abensour",
  publisher: "Cabinet Dentaire Dr Abensour",

  // Open Graph pour les réseaux sociaux
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://cabinet-dentaire-abensour.fr",
    siteName: "Cabinet Dentaire Dr Abensour",
    title: "Cabinet Dentaire Dr Abensour - Dentiste à Strasbourg",
    description:
      "Cabinet dentaire moderne à Strasbourg. Soins dentaires de qualité dans un environnement rassurant et professionnel.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Cabinet Dentaire Dr Abensour",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Cabinet Dentaire Dr Abensour - Dentiste à Strasbourg",
    description:
      "Cabinet dentaire moderne à Strasbourg. Soins dentaires de qualité.",
    images: ["/og-image.jpg"],
  },

  // Informations de localisation
  alternates: {
    canonical: "https://cabinet-dentaire-abensour.fr",
  },

  // Robots et indexation
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Vérification et analytics (à personnaliser)
  verification: {
    // google: "votre-code-verification-google",
    // yandex: "votre-code-verification-yandex",
  },
};

/**
 * Layout racine de l'application
 * Contient la structure HTML de base et les styles globaux
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        {/* Favicon et icônes */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Données structurées JSON-LD pour Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Dentist",
              name: "Cabinet Dentaire Dr Abensour",
              image: "https://cabinet-dentaire-abensour.fr/logo.jpg",
              "@id": "https://cabinet-dentaire-abensour.fr",
              url: "https://cabinet-dentaire-abensour.fr",
              telephone: "+33-3-XX-XX-XX-XX",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Adresse du cabinet",
                addressLocality: "Strasbourg",
                postalCode: "67000",
                addressCountry: "FR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 48.5734,
                longitude: 7.7521,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "09:00",
                  closes: "18:00",
                },
              ],
              priceRange: "€€",
            }),
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
