import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  hover?: boolean;
  className?: string;
}

export function Card({ children, hover = false, className = '' }: CardProps) {
  const hoverStyles = hover ? 'hover:shadow-xl hover:border-mystic-light hover:scale-105 transition-all duration-200' : '';
  return (
    <div className={`bg-cosmic-deep rounded-xl border border-cosmic-blue p-5 ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return <div className={`mb-3 ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return <h3 className={`text-lg font-semibold text-celestial-gold ${className}`}>{children}</h3>;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`text-moon-silver text-sm ${className}`}>{children}</div>;
}
