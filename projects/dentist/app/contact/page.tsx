import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import ContactForm from "@/components/forms/ContactForm";

/**
 * Métadonnées SEO pour la page Contact
 */
export const metadata: Metadata = {
  title: "Contact & Rendez-vous",
  description:
    "Prenez rendez-vous au Cabinet Dentaire Dr Abensour à Strasbourg. Coordonnées, horaires, plan d'accès et formulaire de contact en ligne.",
  keywords: [
    "contact dentiste Strasbourg",
    "rendez-vous dentaire",
    "cabinet dentaire Strasbourg",
    "horaires dentiste",
  ],
};

/**
 * Page Contact - Informations de contact, formulaire et plan d'accès
 */
export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-600 to-primary-700 text-white pt-32 pb-20">
          <div className="container-custom relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-heading font-bold text-5xl md:text-6xl mb-6">
                Nous Contacter
              </h1>
              <p className="text-xl text-primary-100 leading-relaxed">
                Notre équipe est à votre écoute pour répondre à toutes vos
                questions et prendre rendez-vous
              </p>
            </div>
          </div>

          {/* Vague décorative */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
            >
              <path
                d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                fill="white"
              />
            </svg>
          </div>
        </section>

        {/* Section Informations rapides */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Téléphone */}
              <Card className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mx-auto mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-xl mb-2">
                  Par Téléphone
                </h3>
                <a
                  href="tel:+33388000000"
                  className="text-lg text-primary-600 hover:text-primary-700 font-semibold"
                >
                  03 88 00 00 00
                </a>
                <p className="text-sm text-secondary-600 mt-2">
                  Lun-Ven : 9h-18h
                  <br />
                  Sam : 9h-13h
                </p>
              </Card>

              {/* Email */}
              <Card className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mx-auto mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-xl mb-2">
                  Par Email
                </h3>
                <a
                  href="mailto:contact@cabinet-abensour.fr"
                  className="text-lg text-primary-600 hover:text-primary-700 font-semibold break-all"
                >
                  contact@cabinet-abensour.fr
                </a>
                <p className="text-sm text-secondary-600 mt-2">
                  Réponse sous 24h
                </p>
              </Card>

              {/* Adresse */}
              <Card className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mx-auto mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-xl mb-2">
                  Au Cabinet
                </h3>
                <address className="text-secondary-700 not-italic">
                  123 Rue de la Santé
                  <br />
                  67000 Strasbourg
                </address>
                <p className="text-sm text-secondary-600 mt-2">
                  Parking à proximité
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Section Formulaire de contact */}
        <section id="rendez-vous" className="section-padding bg-secondary-50 scroll-mt-20">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-heading font-bold text-4xl mb-4">
                  Prendre Rendez-vous
                </h2>
                <p className="text-xl text-secondary-600">
                  Remplissez le formulaire ci-dessous et nous vous recontacterons
                  rapidement
                </p>
              </div>

              <Card padding="lg">
                <ContactForm />
              </Card>

              {/* Informations complémentaires */}
              <div className="mt-8 p-6 bg-primary-50 rounded-lg border-l-4 border-primary-600">
                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-secondary-900 mb-2">
                      Bon à savoir
                    </h4>
                    <ul className="text-secondary-700 space-y-1 text-sm">
                      <li>
                        • Nous confirmons tous les rendez-vous par email ou SMS
                      </li>
                      <li>
                        • Pensez à apporter votre carte vitale et votre mutuelle
                      </li>
                      <li>
                        • En cas d'urgence, appelez-nous directement au 03 88 00
                        00 00
                      </li>
                      <li>
                        • Annulation gratuite jusqu'à 24h avant le rendez-vous
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Horaires */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-heading font-bold text-4xl mb-4">
                  Horaires d'Ouverture
                </h2>
              </div>

              <Card padding="lg">
                <div className="divide-y divide-secondary-200">
                  <div className="flex justify-between items-center py-4">
                    <span className="font-medium text-secondary-900">Lundi</span>
                    <span className="text-secondary-700">9h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="font-medium text-secondary-900">Mardi</span>
                    <span className="text-secondary-700">9h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="font-medium text-secondary-900">
                      Mercredi
                    </span>
                    <span className="text-secondary-700">9h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="font-medium text-secondary-900">Jeudi</span>
                    <span className="text-secondary-700">9h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="font-medium text-secondary-900">
                      Vendredi
                    </span>
                    <span className="text-secondary-700">9h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="font-medium text-secondary-900">Samedi</span>
                    <span className="text-secondary-700">9h00 - 13h00</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="font-medium text-secondary-900">
                      Dimanche
                    </span>
                    <span className="text-secondary-500">Fermé</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm text-red-800">
                      <strong className="font-semibold">Urgences :</strong> En
                      dehors des horaires d'ouverture, consultez notre{" "}
                      <a
                        href="/urgences"
                        className="underline hover:text-red-900"
                      >
                        page urgences
                      </a>{" "}
                      pour les numéros à contacter.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Section Plan d'accès */}
        <section className="section-padding bg-secondary-50">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-heading font-bold text-4xl mb-4">
                  Plan d'Accès
                </h2>
                <p className="text-xl text-secondary-600">
                  Trouvez facilement notre cabinet au cœur de Strasbourg
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Carte */}
                <Card padding="sm" className="h-[400px]">
                  {/* Placeholder pour Google Maps - à remplacer par une vraie intégration */}
                  <div className="w-full h-full bg-secondary-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        className="w-16 h-16 mx-auto mb-4 text-secondary-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      <p className="text-secondary-600 font-medium">
                        Google Maps à intégrer ici
                      </p>
                      <p className="text-sm text-secondary-500 mt-2">
                        123 Rue de la Santé, 67000 Strasbourg
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Informations d'accès */}
                <div className="space-y-6">
                  <Card>
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-primary-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary-900 mb-2">
                          En Voiture
                        </h4>
                        <p className="text-secondary-600 text-sm">
                          Parking public "Place de la République" à 200m. Places
                          de stationnement dans les rues adjacentes.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-primary-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary-900 mb-2">
                          En Transports en Commun
                        </h4>
                        <p className="text-secondary-600 text-sm">
                          Tram A, D - Arrêt "République"
                          <br />
                          Bus 10, 15, 30 - Arrêt "Santé"
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-primary-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary-900 mb-2">
                          Accessibilité
                        </h4>
                        <p className="text-secondary-600 text-sm">
                          Cabinet accessible aux personnes à mobilité réduite.
                          Ascenseur disponible. N'hésitez pas à nous signaler
                          vos besoins spécifiques.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
