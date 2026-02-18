import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

/**
 * Métadonnées SEO pour la page Soins
 */
export const metadata: Metadata = {
  title: "Nos Soins Dentaires",
  description:
    "Découvrez la gamme complète de nos soins dentaires : soins généraux, implants, orthodontie, esthétique dentaire, soins pédiatriques et urgences. Cabinet Dentaire Dr Abensour à Strasbourg.",
  keywords: [
    "soins dentaires",
    "implants dentaires",
    "orthodontie",
    "blanchiment dentaire",
    "soins enfants",
    "urgence dentaire",
    "Strasbourg",
  ],
};

/**
 * Page Nos Soins - Description détaillée de tous les services
 */
export default function SoinsPage() {
  // Données des soins
  const soins = [
    {
      id: "generaux",
      icon: (
        <svg
          className="w-10 h-10 text-primary-600"
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
      title: "Soins Généraux",
      description:
        "La base d'une bonne santé bucco-dentaire avec des soins préventifs et curatifs.",
      details: [
        "Consultations et bilans dentaires complets",
        "Détartrage et nettoyage professionnel",
        "Traitement des caries avec composites esthétiques",
        "Soins des gencives et traitement des parodontites",
        "Dévitalisation et endodontie",
        "Extractions dentaires",
      ],
      price: "À partir de 23€ (tarif conventionnel)",
    },
    {
      id: "implants",
      icon: (
        <svg
          className="w-10 h-10 text-primary-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      ),
      title: "Implants Dentaires",
      description:
        "Solution durable et esthétique pour remplacer une ou plusieurs dents manquantes.",
      details: [
        "Bilan pré-implantaire avec scanner 3D",
        "Implants en titane biocompatible",
        "Pose d'implant unitaire ou multiple",
        "Bridge complet sur implants",
        "Greffe osseuse si nécessaire",
        "Couronne sur implant en céramique",
      ],
      price: "Devis personnalisé sur consultation",
    },
    {
      id: "orthodontie",
      icon: (
        <svg
          className="w-10 h-10 text-primary-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Orthodontie",
      description:
        "Aligner vos dents pour un sourire harmonieux et une meilleure fonction masticatoire.",
      details: [
        "Bilan orthodontique complet",
        "Appareils dentaires classiques (bagues métalliques)",
        "Bagues céramiques discrètes",
        "Gouttières invisibles (type Invisalign)",
        "Orthodontie pour enfants et adolescents",
        "Orthodontie pour adultes",
      ],
      price: "À partir de 600€ par semestre",
    },
    {
      id: "esthetique",
      icon: (
        <svg
          className="w-10 h-10 text-primary-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
      title: "Dentisterie Esthétique",
      description:
        "Sublimez votre sourire avec des traitements esthétiques de pointe.",
      details: [
        "Blanchiment dentaire professionnel",
        "Facettes en céramique ultra-fines",
        "Couronnes tout céramique E-max",
        "Composite esthétique pour corriger les défauts",
        "Recontouring esthétique des dents",
        "Relooking du sourire (smile design)",
      ],
      price: "Blanchiment à partir de 350€",
    },
    {
      id: "enfants",
      icon: (
        <svg
          className="w-10 h-10 text-primary-600"
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
      title: "Soins Pédiatriques",
      description:
        "Une prise en charge douce et bienveillante pour les plus jeunes.",
      details: [
        "Première consultation dès 1 an",
        "Soins préventifs et scellement des sillons",
        "Traitement des caries sur dents de lait",
        "Éducation à l'hygiène bucco-dentaire",
        "Approche ludique et rassurante",
        "Suivi de l'éruption dentaire",
      ],
      price: "Tarifs conventionnels remboursés à 100%",
    },
    {
      id: "protheses",
      icon: (
        <svg
          className="w-10 h-10 text-primary-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      title: "Prothèses Dentaires",
      description:
        "Restaurer votre sourire et votre fonction masticatoire avec des prothèses sur-mesure.",
      details: [
        "Couronnes céramiques et métallo-céramiques",
        "Bridges fixes et amovibles",
        "Prothèses complètes (dentiers)",
        "Prothèses partielles",
        "Attachements de précision",
        "Réparation et modification de prothèses",
      ],
      price: "Devis personnalisé selon le type de prothèse",
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
                Nos Soins Dentaires
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Une gamme complète de soins pour répondre à tous vos besoins en
                santé bucco-dentaire. Des traitements de pointe réalisés avec
                expertise et bienveillance.
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

        {/* Section des soins détaillés */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="space-y-16">
              {soins.map((soin, index) => (
                <div
                  key={soin.id}
                  id={soin.id}
                  className={`scroll-mt-24 ${
                    index !== 0 ? "pt-16 border-t border-secondary-200" : ""
                  }`}
                >
                  <div className="grid lg:grid-cols-5 gap-8 items-start">
                    {/* Icône et titre */}
                    <div className="lg:col-span-2">
                      <div className="sticky top-24">
                        <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
                          {soin.icon}
                        </div>
                        <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                          {soin.title}
                        </h2>
                        <p className="text-lg text-secondary-600 mb-6">
                          {soin.description}
                        </p>
                        <div className="bg-primary-50 rounded-lg p-4 mb-6">
                          <div className="text-sm font-semibold text-primary-900 mb-1">
                            Tarifs
                          </div>
                          <div className="text-primary-700">{soin.price}</div>
                        </div>
                        <Button href="/contact#rendez-vous" variant="primary">
                          Prendre rendez-vous
                        </Button>
                      </div>
                    </div>

                    {/* Détails */}
                    <div className="lg:col-span-3">
                      <Card padding="lg">
                        <CardHeader>
                          <CardTitle size="lg">
                            Détails des prestations
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-4">
                            {soin.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start">
                                <svg
                                  className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-0.5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="text-secondary-700 text-lg">
                                  {detail}
                                </span>
                              </li>
                            ))}
                          </ul>

                          {/* Informations complémentaires */}
                          <div className="mt-8 p-6 bg-secondary-50 rounded-lg border-l-4 border-primary-600">
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
                                <p className="text-secondary-700">
                                  Un devis détaillé vous sera systématiquement
                                  proposé avant tout traitement. N'hésitez pas à
                                  nous questionner sur les remboursements de
                                  votre mutuelle.
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Urgences */}
        <section className="section-padding bg-red-50">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-red-200">
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mr-6 flex-shrink-0">
                    <svg
                      className="w-8 h-8 text-red-600"
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
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-2xl text-secondary-900 mb-3">
                      Urgences Dentaires
                    </h3>
                    <p className="text-secondary-700 mb-4 leading-relaxed">
                      Vous souffrez d'une rage de dents, d'un traumatisme ou
                      d'une infection ? Nous prenons en charge les urgences dans
                      les meilleurs délais.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        href="/urgences"
                        variant="primary"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Infos urgences
                      </Button>
                      <Button
                        href="tel:+33388000000"
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-50"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
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
                        Appeler
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Section FAQ */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-heading font-bold text-4xl mb-4">
                  Questions Fréquentes
                </h2>
                <p className="text-xl text-secondary-600">
                  Les réponses à vos questions sur nos soins
                </p>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle size="md">
                      Les soins sont-ils remboursés ?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Les soins conservateurs (détartrage, soins de caries,
                      dévitalisation) sont remboursés par la Sécurité Sociale
                      selon les tarifs conventionnels. Pour les autres
                      prestations, nous vous communiquerons un devis détaillé
                      avec les informations de remboursement.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle size="md">Les soins sont-ils douloureux ?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Nous utilisons des techniques modernes d'anesthésie locale
                      pour garantir votre confort. La plupart des soins sont
                      totalement indolores. Pour les patients anxieux, nous
                      proposons également des solutions de relaxation.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle size="md">
                      Combien de temps dure un traitement ?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      La durée varie selon le type de soin : de 30 minutes pour
                      un simple détartrage à plusieurs mois pour un traitement
                      orthodontique ou implantaire. Nous établissons avec vous
                      un plan de traitement détaillé avec un calendrier précis.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-700 text-white">
          <div className="container-custom text-center">
            <h2 className="font-heading font-bold text-4xl mb-6">
              Besoin d'un soin dentaire ?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Prenez rendez-vous pour une consultation personnalisée. Nous
              établirons ensemble un plan de traitement adapté à vos besoins.
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
