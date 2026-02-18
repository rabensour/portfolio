import { ReactNode } from "react";

/**
 * Types de props pour le composant Card
 */
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean; // Effet hover avec élévation
  padding?: "sm" | "md" | "lg";
  border?: boolean;
}

/**
 * Composant Card réutilisable
 * Carte avec ombre, bordures arrondies et effets hover optionnels
 * Utilisé pour afficher des services, témoignages, articles, etc.
 */
export default function Card({
  children,
  className = "",
  hover = true,
  padding = "md",
  border = false,
}: CardProps) {
  // Classes de base
  const baseClasses =
    "bg-white rounded-xl overflow-hidden transition-all duration-300";

  // Classes pour le padding
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  // Classes pour l'effet hover
  const hoverClasses = hover
    ? "shadow-lg hover:shadow-2xl hover:-translate-y-1"
    : "shadow-md";

  // Classes pour la bordure
  const borderClass = border ? "border border-secondary-200" : "";

  // Combinaison de toutes les classes
  const combinedClasses = `${baseClasses} ${paddingClasses[padding]} ${hoverClasses} ${borderClass} ${className}`;

  return <div className={combinedClasses}>{children}</div>;
}

/**
 * Composant CardHeader pour le titre de la carte
 */
interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Composant CardTitle pour le titre principal
 */
interface CardTitleProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CardTitle({
  children,
  className = "",
  size = "md",
}: CardTitleProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <h3
      className={`font-heading font-bold text-secondary-900 ${sizeClasses[size]} ${className}`}
    >
      {children}
    </h3>
  );
}

/**
 * Composant CardContent pour le contenu principal
 */
interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return (
    <div className={`text-secondary-700 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Composant CardFooter pour le pied de la carte
 */
interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div className={`mt-4 pt-4 border-t border-secondary-200 ${className}`}>
      {children}
    </div>
  );
}
