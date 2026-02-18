import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

/**
 * Métadonnées SEO pour la page À propos
 */
export const metadata: Metadata = {
  title: "À Propos",
  description:
    "Découvrez le Cabinet Dentaire Dr Abensour à Strasbourg : notre équipe, nos valeurs, notre histoire et notre engagement pour votre santé bucco-dentaire.",
  keywords: [
    "Dr Abensour",
    "dentiste Strasbourg",
    "équipe dentaire",
    "cabinet dentaire moderne",
  ],
};

/**
 * Page À Propos - Présentation du cabinet, de l'équipe et des valeurs
 */
export default function AProposPage() {
  // Données de l'équipe
  const equipe = [
    {
      nom: "Dr David Abensour",
      role: "Chirurgien-dentiste",
      specialites: ["Implantologie", "Esthétique dentaire", "Chirurgie"],
      description:
        "Diplômé de la Faculté de Strasbourg en 1998, le Dr Abensour s'est spécialisé en implantologie et en dentisterie esthétique. Passionné par son métier, il se forme régulièrement aux dernières techniques.",
      initiales: "DA",
    },
    {
      nom: "Dr Marie Schneider",
      role: "Chirurgien-dentiste",
      specialites: ["Orthodontie", "Pédodontie"],
      description:
        "Le Dr Schneider a rejoint le cabinet en 2015. Spécialiste en orthodontie, elle prend en charge les enfants et adultes avec douceur et professionnalisme.",
      initiales: "MS",
    },
    {
      nom: "Sophie Laurent",
      role: "Assistante dentaire",
      specialites: ["Coordination", "Stérilisation"],
      description:
        "Sophie est le pilier du cabinet depuis 2005. Elle assure la coordination des rendez-vous et veille à votre confort lors de vos visites.",
      initiales: "SL",
    },
    {
      nom: "Émilie Muller",
      role: "Secrétaire médicale",
      specialites: ["Accueil", "Administratif"],
      description:
        "Émilie vous accueille avec le sourire et gère toute la partie administrative : rendez-vous, devis, remboursements.",
      initiales: "EM",
    },
  ];

  // Valeurs du cabinet
  const valeurs = [
    {
      icon: (
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
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      titre: "Qualité & Excellence",
      description:
        "Nous utilisons les technologies les plus avancées et nous formons en continu pour vous offrir les meilleurs soins.",
    },
    {
      icon: (
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
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      titre: "Bienveillance",
      description:
        "Votre confort et votre bien-être sont au cœur de nos préoccupations. Nous prenons le temps de vous écouter et de vous rassurer.",
    },
    {
      icon: (
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      titre: "Approche Familiale",
      description:
        "Nous accueillons toute la famille, des enfants aux seniors. Chaque patient reçoit des soins personnalisés adaptés à ses besoins.",
    },
    {
      icon: (
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      titre: "Transparence",
      description:
        "Nous vous expliquons chaque traitement en détail et vous fournissons des devis clairs et précis. Aucune surprise.",
    },
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-600 to-primary-700 text-white pt-32 pb-20">
          <div className="container-custom relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-heading font-bold text-5xl md:text-6xl mb-6">
                À Propos de Nous
              </h1>
              <p className="text-xl text-primary-100 leading-relaxed">
                Plus qu'un cabinet dentaire, une équipe passionnée au service de
                votre sourire depuis 1998
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

        {/* Section Histoire */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-heading font-bold text-4xl mb-6">
                  Notre Histoire
                </h2>
              </div>

              <div className="prose prose-lg max-w-none">
                <Card padding="lg">
                  <p className="text-secondary-700 leading-relaxed mb-6">
                    Fondé en <strong>1998</strong> par le Dr David Abensour, le
                    Cabinet Dentaire Dr Abensour est devenu une référence à
                    Strasbourg pour la qualité de ses soins et l'attention
                    portée à chaque patient.
                  </p>
                  <p className="text-secondary-700 leading-relaxed mb-6">
                    Au fil des années, le cabinet s'est agrandi et modernisé
                    pour intégrer les dernières technologies en matière de soins
                    dentaires. Notre équipe s'est également enrichie de nouveaux
                    talents, tous animés par la même passion : vous offrir le
                    meilleur service possible.
                  </p>
                  <p className="text-secondary-700 leading-relaxed">
                    Aujourd'hui, nous sommes fiers d'avoir accompagné plus de{" "}
                    <strong>5000 patients</strong> dans leur parcours de santé
                    bucco-dentaire, des simples consultations aux traitements les
                    plus complexes.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Section Valeurs */}
        <section className="section-padding bg-secondary-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-4xl mb-4">
                Nos Valeurs
              </h2>
              <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                Les principes qui guident notre pratique au quotidien
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {valeurs.map((valeur, index) => (
                <Card key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mx-auto mb-4">
                    {valeur.icon}
                  </div>
                  <CardHeader>
                    <CardTitle size="md">{valeur.titre}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-secondary-600">{valeur.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Section Équipe */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-4xl mb-4">
                Notre Équipe
              </h2>
              <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                Des professionnels dévoués et passionnés à votre service
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {equipe.map((membre, index) => (
                <Card key={index}>
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                      {membre.initiales}
                    </div>

                    {/* Informations */}
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-xl text-secondary-900 mb-1">
                        {membre.nom}
                      </h3>
                      <div className="text-primary-600 font-semibold mb-2">
                        {membre.role}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {membre.specialites.map((specialite, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full"
                          >
                            {specialite}
                          </span>
                        ))}
                      </div>
                      <p className="text-secondary-600 text-sm leading-relaxed">
                        {membre.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Section Cabinet */}
        <section className="section-padding bg-secondary-50">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Contenu */}
              <div>
                <h2 className="font-heading font-bold text-4xl mb-6">
                  Un Cabinet Moderne et Chaleureux
                </h2>
                <p className="text-lg text-secondary-600 mb-6 leading-relaxed">
                  Situé au cœur de Strasbourg, notre cabinet a été entièrement
                  rénové en 2020 pour vous offrir un environnement à la fois
                  moderne et accueillant.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <svg
                      className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-secondary-900 mb-1">
                        Équipement de pointe
                      </h4>
                      <p className="text-secondary-600">
                        Scanner 3D, radiologie numérique, systèmes CAD/CAM pour
                        des prothèses en une séance
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg
                      className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-secondary-900 mb-1">
                        Normes d'hygiène maximales
                      </h4>
                      <p className="text-secondary-600">
                        Stérilisation conforme aux dernières normes européennes,
                        matériel à usage unique
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg
                      className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-secondary-900 mb-1">
                        Accessibilité
                      </h4>
                      <p className="text-secondary-600">
                        Cabinet accessible aux personnes à mobilité réduite,
                        parking à proximité
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg
                      className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-secondary-900 mb-1">
                        Confort optimal
                      </h4>
                      <p className="text-secondary-600">
                        Salles de soins spacieuses, musique relaxante, écrans de
                        distraction
                      </p>
                    </div>
                  </div>
                </div>

                <Button href="/contact" variant="primary" size="lg">
                  Venir au cabinet
                </Button>
              </div>

              {/* Image */}
              <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-xl">
                <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-300 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <svg
                        className="w-16 h-16 text-primary-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <p className="text-primary-700 font-semibold">
                      Photo du cabinet
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Certifications */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-heading font-bold text-4xl mb-4">
                  Certifications et Affiliations
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mx-auto mb-4">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <CardTitle size="md">
                    Ordre National des Chirurgiens-Dentistes
                  </CardTitle>
                </Card>

                <Card className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mx-auto mb-4">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <CardTitle size="md">
                    Société Française d'Implantologie
                  </CardTitle>
                </Card>

                <Card className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mx-auto mb-4">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <CardTitle size="md">
                    Formation Continue Certifiée
                  </CardTitle>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-700 text-white">
          <div className="container-custom text-center">
            <h2 className="font-heading font-bold text-4xl mb-6">
              Rejoignez nos patients satisfaits
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Faites confiance à notre équipe pour prendre soin de votre santé
              bucco-dentaire
            </p>
            <Button
              href="/contact#rendez-vous"
              variant="secondary"
              size="lg"
              className="bg-white text-primary-600 hover:bg-primary-50"
            >
              Prendre rendez-vous
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
