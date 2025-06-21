'use client';

import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const { user, isLoading, logout } = useAuth();

  return (
    <header className="bg-coffee-200 shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-coffee-700 font-serif flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 21v-2h18v2H2ZM7 17q-1.25 0-2.125-.875T4 14V6q0-1.25.875-2.125T7 3h10q1.25 0 2.125.875T20 6v1h1q.825 0 1.413.588T23 9v2q0 .825-.588 1.413T21 13h-1v1q0 1.25-.875 2.125T17 17H7Zm0-2h10q.425 0 .713-.288T18 14V6q0-.425-.288-.713T17 5H7q-.425 0-.713.288T6 6v8q0 .425.288.713T7 15Zm11-4h3q.425 0 .713-.288T22 10V9q0-.425-.288-.713T21 8h-3v3Z" />
            </svg>
            <span>AI Cafe</span>
          </a>
          
          <div className="space-x-6 font-medium hidden md:flex">
            <a href="/menu" className="text-coffee-900 hover:text-coffee-600 transition-colors">
              Menü
            </a>
            <a href="/hakkimizda" className="text-coffee-900 hover:text-coffee-600 transition-colors">
              Hakkımızda
            </a>
            <a href="/iletisim" className="text-coffee-900 hover:text-coffee-600 transition-colors">
              İletişim
            </a>
            <a href="/sadakat-programi" className="text-coffee-900 hover:text-coffee-600 transition-colors">
              Sadakat Programı
            </a>
          </div>

          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-coffee-300 rounded w-20"></div>
              </div>
            ) : user ? (
              // Kullanıcı giriş yapmış
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-coffee-700 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <span className="text-coffee-800 font-medium">{user.name}</span>
                </div>
                <a href="/dashboard" className="text-coffee-800 hover:text-coffee-600 transition-colors">
                  Hesabım
                </a>
                <button 
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Çıkış Yap
                </button>
              </div>
            ) : (
              // Kullanıcı giriş yapmamış
              <>
                <a href="/auth/login" className="text-coffee-800 hover:text-coffee-600 transition-colors">
                  Giriş Yap
                </a>
                <a href="/auth/register" className="px-4 py-2 bg-coffee-700 text-white rounded-lg hover:bg-coffee-800 transition-colors">
                  Üye Ol
                </a>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 