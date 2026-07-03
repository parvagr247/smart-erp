import React from 'react';
import { useAuth } from './services/auth-service';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import DashboardView from './views/DashboardView';
import { Sun, Moon, Layers } from 'lucide-react';

export default function App() {
  const {
    view,
    setView,
    user,
    token,
    theme,
    toggleTheme,
    handleLoginSuccess,
    handleLogout,
  } = useAuth();

  return (
    <div className="min-height-screen flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-250">
      
      {/* Centralized Header Navbar */}
      <header className="bg-[var(--bg-surface)] border-b border-[var(--border-light)] px-8 py-4 shadow-sm z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="font-title font-bold text-xl text-[var(--primary)] flex items-center gap-2 select-none">
            <Layers size={22} className="stroke-[2.5]" />
            SmartERP
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 border border-[var(--border-light)] rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-input)] hover:text-[var(--text-primary)] cursor-pointer transition-colors"
              aria-label="Toggle Dark/Light Mode"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Form/Dashboard Container Area */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-lg flex justify-center">
          {view === 'login' && (
            <LoginView
              onLoginSuccess={handleLoginSuccess}
              onRegisterClick={() => setView('register')}
            />
          )}
          {view === 'register' && (
            <RegisterView
              onRegisterSuccess={handleLoginSuccess}
              onLoginClick={() => setView('login')}
            />
          )}
          {view === 'dashboard' && (
            <DashboardView
              user={user}
              token={token}
              onLogout={handleLogout}
            />
          )}
        </div>
      </main>
    </div>
  );
}
