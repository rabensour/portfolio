import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

/**
 * Page d'accueil du Cabinet Dentaire Dr Abensour
 * Structure :
 * - Hero section avec CTA
 * - Services principaux
 * - À propos du cabinet
 * - Témoignages patients
 * - Appel à l'action final
 */
export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 pt-32 pb-20 overflow-hidden">
          {/* Décoration de fond */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
            <div className="absolute top-20 right-20 w-64 h-64 bg-primary-300 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-40 w-96 h-96 bg-primary-200 rounded-full blur-3xl"></div>
          </div>

          <div className="container-custom relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Contenu texte */}
              <div className="animate-slide-up">
                <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
                  Votre sourire,{" "}
                  <span className="text-gradient">notre priorité</span>
                </h1>
                <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
                  Le Cabinet Dentaire Dr Abensour vous accueille à Strasbourg
                  pour des soins dentaires de qualité dans un environnement
                  moderne et rassurant.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    href="/contact#rendez-vous"
                    variant="primary"
                    size="lg"
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    }
                  >
                    Prendre Rendez-vous
                  </Button>
                  <Button href="/soins" variant="secondary" size="lg">
                    Découvrir nos soins
                  </Button>
                </div>

                {/* Stats rapides */}
                <div className="mt-12 grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-4xl font-bold text-primary-600">
                      25+
                    </div>
                    <div className="text-sm text-secondary-600 mt-1">
                      Années d'expérience
                    </div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-primary-600">
                      5000+
                    </div>
                    <div className="text-sm text-secondary-600 mt-1">
                      Patients satisfaits
                    </div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-primary-600">
                      100%
                    </div>
                    <div className="text-sm text-secondary-600 mt-1">
                      Équipement moderne
                    </div>
                  </div>
                </div>
              </div>

              {/* Image illustrative */}
              <div className="relative hidden lg:block">
                <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                  {/* Placeholder pour image - à remplacer par une vraie image */}
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
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
                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-primary-700 font-semibold">
                        Image hero du cabinet
                      </p>
                    </div>
                  </div>
                </div>

                {/* Badge de qualité */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 border-4 border-primary-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
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
                    <div>
                      <div className="font-bold text-secondary-900">
                        Certifié
                      </div>
                      <div className="text-sm text-secondary-600">
                        Ordre des dentistes
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Services */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4">
                Nos Services
              </h2>
              <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                Une gamme complète de soins dentaires pour toute la famille
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Service 1 - Soins généraux */}
              <Card>
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600"
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
                <CardHeader>
                  <CardTitle>Soins Généraux</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Consultations, détartrage, traitement des caries, soins de
                    gencives et prévention pour maintenir une bonne santé
                    bucco-dentaire.
                  </p>
                  <Link
                    href="/soins#generaux"
                    className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                  >
                    En savoir plus
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </CardContent>
              </Card>

              {/* Service 2 - Implants */}
              <Card>
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600"
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
                </div>
                <CardHeader>
                  <CardTitle>Implants Dentaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Solutions durables pour remplacer une ou plusieurs dents
                    manquantes. Technologie de pointe pour des résultats
                    naturels.
                  </p>
                  <Link
                    href="/soins#implants"
                    className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                  >
                    En savoir plus
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </CardContent>
              </Card>

              {/* Service 3 - Orthodontie */}
              <Card>
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600"
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
                </div>
                <CardHeader>
                  <CardTitle>Orthodontie</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Appareils dentaires classiques et invisibles pour aligner
                    vos dents. Solutions adaptées aux enfants et adultes.
                  </p>
                  <Link
                    href="/soins#orthodontie"
                    className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                  >
                    En savoir plus
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </CardContent>
              </Card>

              {/* Service 4 - Esthétique */}
              <Card>
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600"
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
                </div>
                <CardHeader>
                  <CardTitle>Dentisterie Esthétique</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Blanchiment, facettes, couronnes céramique. Retrouvez un
                    sourire éclatant et harmonieux en toute confiance.
                  </p>
                  <Link
                    href="/soins#esthetique"
                    className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                  >
                    En savoir plus
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </CardContent>
              </Card>

              {/* Service 5 - Pédodontie */}
              <Card>
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600"
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
                </div>
                <CardHeader>
                  <CardTitle>Soins Enfants</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Prise en charge douce et bienveillante des enfants.
                    Prévention et soins adaptés pour les plus jeunes.
                  </p>
                  <Link
                    href="/soins#enfants"
                    className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                  >
                    En savoir plus
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </CardContent>
              </Card>

              {/* Service 6 - Urgences */}
              <Card>
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-4">
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
                <CardHeader>
                  <CardTitle>Urgences Dentaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Prise en charge rapide des urgences. Douleurs, traumatismes,
                    infections : nous intervenons dans les meilleurs délais.
                  </p>
                  <Link
                    href="/urgences"
                    className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                  >
                    En savoir plus
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section À propos (résumé) */}
        <section className="section-padding bg-secondary-50">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
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
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-primary-700 font-semibold">
                      Photo de l'équipe
                    </p>
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div>
                <h2 className="font-heading font-bold text-4xl md:text-5xl mb-6">
                  Un cabinet à votre écoute
                </h2>
                <p className="text-lg text-secondary-600 mb-6 leading-relaxed">
                  Depuis plus de 25 ans, le Dr Abensour et son équipe
                  s'engagent à vous offrir des soins dentaires de qualité dans
                  un environnement chaleureux et moderne.
                </p>
                <p className="text-lg text-secondary-600 mb-8 leading-relaxed">
                  Notre priorité : votre confort et votre santé bucco-dentaire.
                  Nous utilisons les dernières technologies pour vous garantir
                  des soins précis et indolores.
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
                        Technologies numériques et matériaux biocompatibles
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
                        Équipe expérimentée
                      </h4>
                      <p className="text-secondary-600">
                        Formation continue pour vous offrir les meilleurs soins
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
                        Approche personnalisée
                      </h4>
                      <p className="text-secondary-600">
                        Chaque patient est unique, nos soins aussi
                      </p>
                    </div>
                  </div>
                </div>

                <Button href="/a-propos" variant="primary" size="lg">
                  En savoir plus sur nous
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section Témoignages */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4">
                Ils nous font confiance
              </h2>
              <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                Les avis de nos patients sont notre plus belle récompense
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Témoignage 1 */}
              <Card>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <CardContent>
                  <p className="text-secondary-700 mb-4 italic">
                    "Excellent cabinet ! Le Dr Abensour est très à l'écoute et
                    professionnel. J'avais très peur du dentiste et grâce à lui
                    je suis maintenant beaucoup plus sereine."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary-600 font-bold">MR</span>
                    </div>
                    <div>
                      <div className="font-semibold text-secondary-900">
                        Marie R.
                      </div>
                      <div className="text-sm text-secondary-500">
                        Patiente depuis 3 ans
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Témoignage 2 */}
              <Card>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <CardContent>
                  <p className="text-secondary-700 mb-4 italic">
                    "Un cabinet moderne avec du matériel de pointe. Les soins
                    sont indolores et l'équipe est très sympathique. Je
                    recommande vivement !"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary-600 font-bold">JD</span>
                    </div>
                    <div>
                      <div className="font-semibold text-secondary-900">
                        Jean D.
                      </div>
                      <div className="text-sm text-secondary-500">
                        Patient depuis 5 ans
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Témoignage 3 */}
              <Card>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <CardContent>
                  <p className="text-secondary-700 mb-4 italic">
                    "Toute ma famille est suivie ici. Parfait pour les enfants,
                    mon fils n'a plus peur du dentiste ! Merci pour votre
                    patience et votre gentillesse."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary-600 font-bold">SL</span>
                    </div>
                    <div>
                      <div className="font-semibold text-secondary-900">
                        Sophie L.
                      </div>
                      <div className="text-sm text-secondary-500">
                        Patiente depuis 7 ans
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section CTA Final */}
        <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-700 text-white">
          <div className="container-custom text-center">
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-6">
              Prêt à prendre soin de votre sourire ?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Prenez rendez-vous dès aujourd'hui pour une consultation
              personnalisée. Notre équipe sera ravie de vous accueillir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href="/contact#rendez-vous"
                variant="secondary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50"
              >
                Prendre rendez-vous
              </Button>
              <Button
                href="tel:+33388000000"
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
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
                Appeler le cabinet
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
