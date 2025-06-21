'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

interface CTASectionProps {
  title: string;
  description: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

export default function CTASection({ 
  title, 
  description,
  primaryButtonText = "Menümüzü İnceleyin",
  primaryButtonHref = "/menu",
  secondaryButtonText = "Dashboard",
  secondaryButtonHref = "/dashboard"
}: CTASectionProps) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="bg-coffee-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">{title}</h2>
          <p className="text-coffee-100 mb-8 max-w-2xl mx-auto font-medium">{description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="animate-pulse">
              <div className="h-12 bg-coffee-600 rounded-lg w-40"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-coffee-800 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-serif font-bold mb-4">
          {title}
        </h2>
        <p className="text-coffee-100 mb-8 max-w-2xl mx-auto font-medium">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            // Kullanıcı giriş yapmış
            <>
              <Link
                href={primaryButtonHref}
                className="px-8 py-3 bg-cream-400 text-coffee-800 rounded-lg hover:bg-cream-300 transition-colors font-semibold"
              >
                {primaryButtonText}
              </Link>
              <Link
                href={secondaryButtonHref}
                className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-coffee-800 transition-colors font-semibold"
              >
                {secondaryButtonText}
              </Link>
            </>
          ) : (
            // Kullanıcı giriş yapmamış
            <>
              <Link
                href="/auth/register"
                className="px-8 py-3 bg-cream-400 text-coffee-800 rounded-lg hover:bg-cream-300 transition-colors font-semibold"
              >
                Üye Ol
              </Link>
              <Link
                href="/auth/login"
                className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-coffee-800 transition-colors font-semibold"
              >
                Giriş Yap
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 