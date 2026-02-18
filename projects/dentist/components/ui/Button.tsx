import Link from "next/link";
import { ReactNode } from "react";

/**
 * Types de props pour le composant Button
 */
interface ButtonProps {
  children: ReactNode;
  href?: string; // Si fourni, rend un lien au lieu d'un bouton
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  icon?: ReactNode;
}

/**
 * Composant Button réutilisable
 * Peut être utilisé comme bouton ou comme lien
 * Plusieurs variantes et tailles disponibles
 */
export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
  icon,
}: ButtonProps) {
  // Classes de base communes à tous les boutons
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Classes selon la variante
  const variantClasses = {
    primary:
      "text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 shadow-md hover:shadow-lg disabled:bg-primary-300",
    secondary:
      "text-secondary-700 bg-white border border-secondary-300 hover:bg-secondary-50 focus:ring-primary-500 disabled:bg-secondary-100",
    outline:
      "text-primary-600 bg-transparent border-2 border-primary-600 hover:bg-primary-50 focus:ring-primary-500 disabled:border-primary-300 disabled:text-primary-300",
  };

  // Classes selon la taille
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // Classe pour largeur complète
  const widthClass = fullWidth ? "w-full" : "";

  // Classe pour état désactivé
  const disabledClass = disabled
    ? "cursor-not-allowed opacity-60"
    : "cursor-pointer";

  // Combinaison de toutes les classes
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`;

  // Contenu du bouton (avec icône optionnelle)
  const buttonContent = (
    <>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </>
  );

  // Si href est fourni, rendre un lien
  if (href && !disabled) {
    return (
      <Link href={href} className={combinedClasses}>
        {buttonContent}
      </Link>
    );
  }

  // Sinon, rendre un bouton
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
    >
      {buttonContent}
    </button>
  );
}
