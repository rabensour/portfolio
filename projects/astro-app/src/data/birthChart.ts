import type { BirthChart } from '../types/astro';

export const birthChart: BirthChart = {
  ascendant: 'Cancer 16°17\'',
  descendant: 'Capricorne 16°17\'',

  planets: [
    {
      name: 'Soleil',
      sign: 'Cancer',
      degree: '09°36\'',
      house: 12,
      explanation: 'Identité profonde ancrée dans l\'émotionnel et l\'inconscient. Besoin de retrait pour nourrir votre monde intérieur sensible et protéger votre vulnérabilité.'
    },
    {
      name: 'Lune',
      sign: 'Capricorne',
      degree: '09°43\'',
      house: 6,
      explanation: 'Émotions contrôlées et structurées dans le quotidien. Sécurité trouvée dans la discipline, le travail et les routines bien établies.'
    },
    {
      name: 'Mercure',
      sign: 'Gémeaux',
      degree: '27°40\'',
      house: 12,
      explanation: 'Mental agile et curieux tourné vers l\'introspection. Communication intérieure riche, pensées multiples dans le monde caché de l\'inconscient.'
    },
    {
      name: 'Vénus',
      sign: 'Gémeaux',
      degree: '11°47\'',
      house: 12,
      retrograde: true,
      explanation: 'Amour et valeurs révisés en profondeur (R). Relations et plaisirs vécus discrètement, attirance pour la communication intellectuelle secrète.'
    },
    {
      name: 'Mars',
      sign: 'Gémeaux',
      degree: '13°07\'',
      house: 12,
      explanation: 'Action et désir exprimés par la communication cachée. Énergie mentale intense œuvrant dans les coulisses, combats intellectuels invisibles.'
    },
    {
      name: 'Jupiter',
      sign: 'Capricorne',
      degree: '13°11\'',
      house: 6,
      retrograde: true,
      explanation: 'Expansion et chance à travers la discipline du travail quotidien (R). Philosophie pragmatique, croissance par la responsabilité et l\'effort.'
    },
    {
      name: 'Saturne',
      sign: 'Bélier',
      degree: '07°08\'',
      house: 10,
      explanation: 'Responsabilités et structure dans la carrière avec audace pionnière. Autorité qui s\'affirme, leadership mûri par l\'expérience professionnelle.'
    },
    {
      name: 'Uranus',
      sign: 'Verseau',
      degree: '03°31\'',
      house: 8,
      retrograde: true,
      explanation: 'Révolution intérieure dans les transformations profondes (R). Besoin de liberté face aux crises, innovations dans la gestion des ressources partagées.'
    },
    {
      name: 'Neptune',
      sign: 'Capricorne',
      degree: '26°49\'',
      house: 7,
      retrograde: true,
      explanation: 'Idéaux et rêves structurés dans les partenariats (R). Vision pragmatique des relations, spiritualité disciplinée dans l\'union à l\'autre.'
    },
    {
      name: 'Pluton',
      sign: 'Sagittaire',
      degree: '00°45\'',
      house: 5,
      retrograde: true,
      explanation: 'Transformation profonde à travers la quête de vérité créative (R). Régénération par l\'expression personnelle, pouvoir philosophique dans la créativité.'
    },
    {
      name: 'Nœud Nord',
      sign: 'Balance',
      degree: '12°55\'',
      house: 4,
      retrograde: true,
      explanation: 'Destinée vers l\'harmonie et l\'équilibre au foyer (R). Évolution par la diplomatie familiale, apprendre la coopération dans les racines.'
    },
    {
      name: 'Nœud Sud',
      sign: 'Bélier',
      degree: '12°55\'',
      house: 10,
      retrograde: true,
      explanation: 'Talents innés de leadership et d\'initiative dans la carrière (R). Lâcher l\'indépendance excessive professionnelle pour embrasser la collaboration.'
    },
    {
      name: 'Chiron',
      sign: 'Balance',
      degree: '08°33\'',
      house: 4,
      explanation: 'Blessure guérisseuse liée à l\'harmonie familiale et aux relations. Capacité à soigner les déséquilibres relationnels par l\'expérience du foyer.'
    },
    {
      name: 'Fortune',
      sign: 'Capricorne',
      degree: '16°24\'',
      house: 7,
      explanation: 'Chance et épanouissement dans les partenariats structurés. Bonheur trouvé à travers l\'engagement sérieux et les relations responsables.'
    },
    {
      name: 'Ascendant',
      sign: 'Cancer',
      degree: '16°17\'',
      house: 1,
      explanation: 'Votre masque social et apparence au monde. Vous vous présentez avec sensibilité, empathie et un besoin de protéger et nourrir votre environnement.'
    },
    {
      name: 'Descendant',
      sign: 'Capricorne',
      degree: '16°17\'',
      house: 7,
      explanation: 'Ce que vous recherchez dans les partenariats. Attirance pour les personnes sérieuses, matures, responsables et structurées.'
    }
  ],

  houses: [
    {
      number: 1,
      sign: 'Cancer',
      degree: '16°17\'',
      explanation: 'Apparence sensible et protectrice. Vous vous présentez avec empathie, douceur et un besoin naturel de nourrir votre environnement.'
    },
    {
      number: 2,
      sign: 'Lion',
      degree: '03°10\'',
      explanation: 'Ressources matérielles gérées avec fierté et générosité. Valorisation de la créativité et de l\'expression personnelle dans les finances.'
    },
    {
      number: 3,
      sign: 'Lion',
      degree: '22°50\'',
      explanation: 'Communication charismatique et dramatique. Apprentissage par l\'expression créative, relations fraternelles chaleureuses et loyales.'
    },
    {
      number: 4,
      sign: 'Vierge',
      degree: '18°50\'',
      explanation: 'Racines organisées et analytiques. Vie familiale ordonnée, besoin de perfection et de service dans le foyer et les fondations.'
    },
    {
      number: 5,
      sign: 'Balance',
      degree: '25°22\'',
      explanation: 'Créativité harmonieuse et esthétique. Expression personnelle à travers l\'art, les relations et la recherche de beauté et d\'équilibre.'
    },
    {
      number: 6,
      sign: 'Sagittaire',
      degree: '09°27\'',
      explanation: 'Travail quotidien expansif et optimiste. Approche philosophique de la santé et des routines, service avec vision large.'
    },
    {
      number: 7,
      sign: 'Capricorne',
      degree: '16°17\'',
      explanation: 'Partenariats sérieux et structurés. Recherche de relations durables basées sur la responsabilité, l\'engagement et la maturité.'
    },
    {
      number: 8,
      sign: 'Verseau',
      degree: '03°10\'',
      explanation: 'Transformation par l\'innovation et la liberté. Ressources partagées gérées de manière originale, crises vécues avec détachement.'
    },
    {
      number: 9,
      sign: 'Verseau',
      degree: '22°50\'',
      explanation: 'Quête philosophique humanitaire et futuriste. Expansion de la conscience par l\'originalité, voyages vers l\'inconnu collectif.'
    },
    {
      number: 10,
      sign: 'Poissons',
      degree: '18°50\'',
      explanation: 'Carrière inspirée et compassionnelle. Vocation orientée vers la spiritualité, l\'art ou le service aux autres avec sensibilité.'
    },
    {
      number: 11,
      sign: 'Bélier',
      degree: '25°22\'',
      explanation: 'Amitiés pionnières et dynamiques. Projets collectifs basés sur l\'initiative, le courage et la conquête de nouveaux territoires sociaux.'
    },
    {
      number: 12,
      sign: 'Gémeaux',
      degree: '09°27\'',
      explanation: 'Monde intérieur mental et communicatif. Vie cachée nourrie par la réflexion, l\'écriture et le dialogue avec l\'inconscient.'
    }
  ],

  aspects: [
    {
      planet1: 'Jupiter',
      aspect: 'Quinconce',
      planet2: 'Mars',
      orb: 0.07,
      type: 'neutral',
      explanation: 'Ajustement permanent entre expansion disciplinée et action mentale. Tension créative entre foi pragmatique et énergie intellectuelle.'
    },
    {
      planet1: 'Lune',
      aspect: 'Opposition',
      planet2: 'Soleil',
      orb: 0.12,
      type: 'difficult',
      explanation: 'Polarité entre émotions structurées et identité sensible. Besoin d\'équilibrer sécurité matérielle (Lune) et vie intérieure (Soleil).'
    },
    {
      planet1: 'Mars',
      aspect: 'Trigone',
      planet2: 'Nœud Nord',
      orb: 0.20,
      type: 'harmonious',
      explanation: 'Facilité à agir vers la destinée d\'harmonie. L\'énergie mentale soutient naturellement l\'évolution vers l\'équilibre relationnel.'
    },
    {
      planet1: 'Nœud Sud',
      aspect: 'Sextile',
      planet2: 'Mars',
      orb: 0.20,
      type: 'harmonious',
      explanation: 'Talents de leadership passés facilitent l\'action présente. L\'initiative naturelle est une ressource pour avancer.'
    },
    {
      planet1: 'Jupiter',
      aspect: 'Carré',
      planet2: 'Nœud Nord',
      orb: 0.27,
      type: 'difficult',
      explanation: 'Tension entre expansion pragmatique et destinée harmonieuse. Croissance par dépassement des rigidités dans les relations.'
    },
    {
      planet1: 'Mercure',
      aspect: 'Quinconce',
      planet2: 'Neptune',
      orb: 0.85,
      type: 'neutral',
      explanation: 'Ajustement entre mental agile et rêves structurés. Pensées rationnelles cherchant à intégrer la vision spirituelle.'
    },
    {
      planet1: 'Nœud Nord',
      aspect: 'Trigone',
      planet2: 'Vénus',
      orb: 1.12,
      type: 'harmonious',
      explanation: 'Facilité à évoluer par l\'amour et les valeurs. Relations harmonieuses soutiennent le chemin de vie équilibré.'
    },
    {
      planet1: 'Mars',
      aspect: 'Conjonction',
      planet2: 'Vénus',
      orb: 1.32,
      type: 'harmonious',
      explanation: 'Union du désir et de l\'amour en Gémeaux cachés. Passion intellectuelle, magnétisme dans la communication secrète.'
    },
    {
      planet1: 'Jupiter',
      aspect: 'Quinconce',
      planet2: 'Vénus',
      orb: 1.39,
      type: 'neutral',
      explanation: 'Ajustement entre expansion disciplinée et amour intellectuel. Foi pragmatique cherchant l\'harmonie avec les valeurs.'
    },
    {
      planet1: 'Saturne',
      aspect: 'Carré',
      planet2: 'Soleil',
      orb: 2.47,
      type: 'difficult',
      explanation: 'Tension entre autorité professionnelle pionnière et identité sensible. Défi de structurer l\'ego avec responsabilité.'
    },
    {
      planet1: 'Lune',
      aspect: 'Carré',
      planet2: 'Saturne',
      orb: 2.59,
      type: 'difficult',
      explanation: 'Conflit entre émotions contrôlées et discipline professionnelle. Besoin d\'assouplir la rigidité émotionnelle au travail.'
    },
    {
      planet1: 'Pluton',
      aspect: 'Sextile',
      planet2: 'Uranus',
      orb: 2.78,
      type: 'harmonious',
      explanation: 'Opportunité de transformer par l\'innovation. Régénération philosophique facilitée par la liberté révolutionnaire.'
    },
    {
      planet1: 'Lune',
      aspect: 'Carré',
      planet2: 'Nœud Nord',
      orb: 3.20,
      type: 'difficult',
      explanation: 'Tension entre sécurité émotionnelle et destinée d\'harmonie. Émotions rigides bloquant l\'évolution vers la coopération.'
    },
    {
      planet1: 'Soleil',
      aspect: 'Carré',
      planet2: 'Nœud Nord',
      orb: 3.32,
      type: 'difficult',
      explanation: 'Défi entre identité sensible et chemin d\'équilibre. Ego Cancer doit apprendre la diplomatie pour évoluer.'
    },
    {
      planet1: 'Jupiter',
      aspect: 'Conjonction',
      planet2: 'Lune',
      orb: 3.46,
      type: 'harmonious',
      explanation: 'Union de la foi et des émotions en Capricorne pragmatique. Optimisme discipliné, chance dans le travail quotidien.'
    },
    {
      planet1: 'Saturne',
      aspect: 'Sextile',
      planet2: 'Uranus',
      orb: 3.60,
      type: 'harmonious',
      explanation: 'Opportunité d\'allier structure et innovation. Autorité pionnière facilitée par la révolution humanitaire.'
    },
    {
      planet1: 'Jupiter',
      aspect: 'Carré',
      planet2: 'Nœud Sud',
      orb: 0.27,
      type: 'difficult',
      explanation: 'Tension entre expansion pragmatique et talents de leadership passés. Besoin de tempérer l\'indépendance professionnelle.'
    },
    {
      planet1: 'Nœud Sud',
      aspect: 'Sextile',
      planet2: 'Vénus',
      orb: 1.12,
      type: 'harmonious',
      explanation: 'Facilité à utiliser les talents de charme du passé. Amour et initiative naturels se soutiennent mutuellement.'
    },
    {
      planet1: 'Lune',
      aspect: 'Quinconce',
      planet2: 'Vénus',
      orb: 2.08,
      type: 'neutral',
      explanation: 'Ajustement entre émotions structurées et amour intellectuel. Sécurité affective cherchant l\'harmonie communicative.'
    },
    {
      planet1: 'Mercure',
      aspect: 'Quinconce',
      planet2: 'Pluton',
      orb: 3.08,
      type: 'neutral',
      explanation: 'Ajustement entre pensée agile et transformation profonde. Mental curieux explorant les mystères philosophiques.'
    },
    {
      planet1: 'Ascendant',
      aspect: 'Opposition',
      planet2: 'Jupiter',
      orb: 3.10,
      type: 'difficult',
      explanation: 'Tension entre apparence sensible (Ascendant Cancer) et expansion pragmatique (Jupiter Capricorne). Équilibrer émotions et discipline.'
    },
    {
      planet1: 'Descendant',
      aspect: 'Conjonction',
      planet2: 'Jupiter',
      orb: 3.10,
      type: 'harmonious',
      explanation: 'Partenariats favorisés par la chance et la foi. Relations sérieuses apportant expansion et opportunités.'
    },
    {
      planet1: 'Descendant',
      aspect: 'Quinconce',
      planet2: 'Mars',
      orb: 3.17,
      type: 'neutral',
      explanation: 'Ajustement entre partenariats et action mentale. Relations demandant adaptation à l\'énergie intellectuelle cachée.'
    },
    {
      planet1: 'Nœud Sud',
      aspect: 'Carré',
      planet2: 'Lune',
      orb: 3.20,
      type: 'difficult',
      explanation: 'Conflit entre talents de leadership et émotions disciplinées. Sécurité émotionnelle vs autonomie professionnelle.'
    },
    {
      planet1: 'Nœud Sud',
      aspect: 'Carré',
      planet2: 'Soleil',
      orb: 3.32,
      type: 'difficult',
      explanation: 'Tension entre indépendance passée et identité sensible. Ego cherchant à intégrer l\'initiative avec la vulnérabilité.'
    },
    {
      planet1: 'Ascendant',
      aspect: 'Carré',
      planet2: 'Nœud Nord',
      orb: 3.37,
      type: 'difficult',
      explanation: 'Défi entre apparence protectrice et destinée d\'harmonie. Masque émotionnel bloquant l\'évolution vers l\'équilibre.'
    },
    {
      planet1: 'Descendant',
      aspect: 'Carré',
      planet2: 'Nœud Nord',
      orb: 3.37,
      type: 'difficult',
      explanation: 'Tension entre partenariats pragmatiques et chemin d\'harmonie familiale. Relations vs racines en conflit.'
    },
    {
      planet1: 'Ascendant',
      aspect: 'Carré',
      planet2: 'Nœud Sud',
      orb: 3.37,
      type: 'difficult',
      explanation: 'Conflit entre identité sensible et leadership passé. Apparence empathique vs affirmation de soi professionnelle.'
    },
    {
      planet1: 'Descendant',
      aspect: 'Carré',
      planet2: 'Nœud Sud',
      orb: 3.37,
      type: 'difficult',
      explanation: 'Tension entre relations structurées et autonomie passée. Partenariats vs indépendance professionnelle.'
    },
    {
      planet1: 'Mars',
      aspect: 'Quinconce',
      planet2: 'Lune',
      orb: 3.40,
      type: 'neutral',
      explanation: 'Ajustement entre action intellectuelle et émotions disciplinées. Énergie mentale cherchant la sécurité émotionnelle.'
    },
    {
      planet1: 'Jupiter',
      aspect: 'Opposition',
      planet2: 'Soleil',
      orb: 3.58,
      type: 'difficult',
      explanation: 'Polarité entre expansion pragmatique et identité sensible. Foi disciplinée vs vie intérieure émotionnelle.'
    },
    {
      planet1: 'Descendant',
      aspect: 'Quinconce',
      planet2: 'Vénus',
      orb: 4.49,
      type: 'neutral',
      explanation: 'Ajustement entre partenariats sérieux et amour intellectuel. Relations cherchant l\'harmonie avec les valeurs cachées.'
    },
    {
      planet1: 'Saturne',
      aspect: 'Sextile',
      planet2: 'Vénus',
      orb: 4.66,
      type: 'harmonious',
      explanation: 'Opportunité de structurer l\'amour. Discipline professionnelle soutenant les relations et les valeurs.'
    },
    {
      planet1: 'Neptune',
      aspect: 'Sextile',
      planet2: 'Pluton',
      orb: 3.92,
      type: 'harmonious',
      explanation: 'Facilité à spiritualiser les transformations. Rêves structurés soutenant la régénération philosophique profonde.'
    }
  ]
};
