import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

/**
 * Métadonnées SEO pour la page Urgences
 */
export const metadata: Metadata = {
  title: "Urgences Dentaires",
  description:
    "Service d'urgences dentaires au Cabinet Dentaire Dr Abensour à Strasbourg. Numéros d'urgence, que faire en cas de douleur, traumatisme ou infection dentaire.",
  keywords: [
    "urgence dentaire Strasbourg",
    "dentiste urgence",
    "rage de dents",
    "traumatisme dentaire",
    "douleur dentaire",
  ],
};

/**
 * Page Urgences - Informations sur les urgences dentaires
 */
export default function UrgencesPage() {
  // Types d'urgences
  const urgences = [
    {
      titre: "Douleur intense / Rage de dents",
      description:
        "Douleur aiguë, pulsatile, qui empêche de dormir ou de manger.",
      conseils: [
        "Prenez un antalgique (paracétamol ou ibuprofène selon prescription)",
        "Évitez le chaud et le froid",
        "Ne mettez pas d'aspirine directement sur la dent",
        "Contactez-nous rapidement pour un rendez-vous d'urgence",
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    {
      titre: "Traumatisme dentaire",
      description:
        "Chute, choc, dent cassée, luxée ou expulsée suite à un accident.",
      conseils: [
        "En cas de dent expulsée : récupérez-la sans toucher la racine",
        "Conservez-la dans du lait ou du sérum physiologique",
        "Ne nettoyez pas la dent",
        "Consultez immédiatement (idéalement dans l'heure)",
        "Mordez dans une compresse en cas de saignement",
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      titre: "Infection / Abcès",
      description:
        "Gonflement de la gencive, de la joue, fièvre, goût désagréable.",
      conseils: [
        "Ne percez jamais l'abcès vous-même",
        "Rincez-vous la bouche avec de l'eau salée tiède",
        "Prenez votre température",
        "Consultez rapidement, une infection peut s'aggraver vite",
        "Un traitement antibiotique peut être nécessaire",
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      titre: "Saignement persistant",
      description:
        "Saignement qui ne s'arrête pas après une extraction ou un traumatisme.",
      conseils: [
        "Mordez fermement sur une compresse ou un mouchoir propre",
        "Maintenez la pression pendant au moins 20 minutes",
        "Évitez de cracher ou de rincer",
        "Appliquez du froid à l'extérieur de la joue",
        "Si le saignement persiste au-delà de 30 min, consultez",
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
    },
    {
      titre: "Couronne ou bridge décollé",
      description:
        "Prothèse qui se décolle, rendant la dent sensible et fragile.",
      conseils: [
        "Récupérez la prothèse et conservez-la",
        "Évitez de manger sur cette dent",
        "Vous pouvez temporairement recoller avec du ciment dentaire (pharmacie)",
        "Prenez rendez-vous rapidement pour un rescellement",
        "Ne collez pas avec de la colle forte",
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
    },
    {
      titre: "Douleur post-opératoire",
      description:
        "Douleurs anormales après une extraction, un implant ou une chirurgie.",
      conseils: [
        "Une douleur modérée est normale pendant 48-72h",
        "Prenez les antalgiques prescrits",
        "Appliquez du froid les premières 24h",
        "Si la douleur augmente au lieu de diminuer, consultez",
        "En cas de fièvre ou de gonflement important, contactez-nous",
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero Section - Urgences */}
        <section className="relative bg-gradient-to-br from-red-600 to-red-700 text-white pt-32 pb-20">
          <div className="container-custom relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h1 className="font-heading font-bold text-5xl md:text-6xl mb-6">
                Urgences Dentaires
              </h1>
              <p className="text-xl text-red-100 leading-relaxed mb-8">
                Vous avez une urgence dentaire ? Nous sommes là pour vous aider
                rapidement
              </p>

              {/* Bouton d'appel d'urgence */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+33388000000"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-600 font-bold text-lg rounded-lg hover:bg-red-50 transition-all shadow-lg hover:shadow-xl"
                >
                  <svg
                    className="w-6 h-6 mr-3"
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
                  Appeler le 03 88 00 00 00
                </a>
              </div>
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

        {/* Section Numéros d'urgence */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {/* Heures d'ouverture */}
                <Card className="border-2 border-primary-200">
                  <div className="flex items-start">
                    <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <svg
                        className="w-7 h-7 text-primary-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xl mb-2">
                        Pendant nos horaires
                      </h3>
                      <p className="text-secondary-600 mb-3">
                        Lun-Ven : 9h-18h | Sam : 9h-13h
                      </p>
                      <a
                        href="tel:+33388000000"
                        className="text-primary-600 hover:text-primary-700 font-bold text-lg"
                      >
                        📞 03 88 00 00 00
                      </a>
                    </div>
                  </div>
                </Card>

                {/* En dehors des heures */}
                <Card className="border-2 border-red-200 bg-red-50">
                  <div className="flex items-start">
                    <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <svg
                        className="w-7 h-7 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xl mb-2">
                        Soirs, nuits, dimanches
                      </h3>
                      <p className="text-secondary-600 mb-3">
                        Service de garde départemental
                      </p>
                      <a
                        href="tel:15"
                        className="text-red-600 hover:text-red-700 font-bold text-lg"
                      >
                        📞 Appelez le 15 (SAMU)
                      </a>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Informations importantes */}
              <Card className="bg-primary-50 border-l-4 border-primary-600">
                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-1"
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
                      Important à savoir
                    </h4>
                    <ul className="text-secondary-700 space-y-1">
                      <li>
                        • Le SAMU (15) vous orientera vers le dentiste de garde
                        le plus proche
                      </li>
                      <li>
                        • Les soins d'urgence sont remboursés par la Sécurité
                        Sociale
                      </li>
                      <li>
                        • Préparez votre carte vitale et votre mutuelle avant la
                        consultation
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Section Types d'urgences */}
        <section className="section-padding bg-secondary-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-4xl mb-4">
                Que Faire en Cas d'Urgence ?
              </h2>
              <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
                Identifiez votre situation et suivez nos conseils en attendant
                la consultation
              </p>
            </div>

            <div className="max-w-5xl mx-auto space-y-6">
              {urgences.map((urgence, index) => (
                <Card key={index} hover={false}>
                  <div className="flex items-start">
                    {/* Icône */}
                    <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center text-red-600 mr-6 flex-shrink-0">
                      {urgence.icon}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-2xl mb-2 text-secondary-900">
                        {urgence.titre}
                      </h3>
                      <p className="text-secondary-600 mb-4">
                        {urgence.description}
                      </p>

                      {/* Conseils */}
                      <div className="bg-secondary-50 rounded-lg p-4">
                        <h4 className="font-semibold text-secondary-900 mb-3 flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-primary-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Que faire ?
                        </h4>
                        <ul className="space-y-2">
                          {urgence.conseils.map((conseil, idx) => (
                            <li
                              key={idx}
                              className="flex items-start text-secondary-700"
                            >
                              <svg
                                className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {conseil}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Section Prévention */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-heading font-bold text-4xl mb-4">
                  Prévenir les Urgences
                </h2>
                <p className="text-xl text-secondary-600">
                  La meilleure urgence est celle qu'on évite
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3">
                    Consultations régulières
                  </h3>
                  <p className="text-secondary-600">
                    Un contrôle tous les 6 mois permet de détecter et traiter
                    les problèmes avant qu'ils ne deviennent urgents.
                  </p>
                </Card>

                <Card>
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3">
                    Hygiène bucco-dentaire
                  </h3>
                  <p className="text-secondary-600">
                    Brossage 2 fois par jour, fil dentaire quotidien et bain de
                    bouche réduisent les risques d'infection.
                  </p>
                </Card>

                <Card>
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3">
                    Protection sportive
                  </h3>
                  <p className="text-secondary-600">
                    Portez un protège-dents lors de sports à risque (rugby,
                    boxe, hockey, etc.) pour éviter les traumatismes.
                  </p>
                </Card>

                <Card>
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3">
                    Ne pas négliger les signes
                  </h3>
                  <p className="text-secondary-600">
                    Une sensibilité, un saignement ou une douleur légère doivent
                    vous amener à consulter rapidement.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-700 text-white">
          <div className="container-custom text-center">
            <h2 className="font-heading font-bold text-4xl mb-6">
              Une urgence dentaire ?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              N'attendez pas que la douleur s'aggrave. Contactez-nous
              immédiatement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+33388000000"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-bold text-lg rounded-lg hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl"
              >
                <svg
                  className="w-6 h-6 mr-3"
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
                Appeler le cabinet
              </a>
              <Button
                href="/contact"
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                Voir nos coordonnées
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
