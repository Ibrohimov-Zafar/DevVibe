"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import '../styles/Navbar.css';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme, setLightTheme, setDarkTheme, setSystemTheme, isDark } = useTheme();

  // Scroll holati
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Unmount bo‘lganda body overflow tiklash
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'auto';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleNavClick = (path) => {
    setIsLoading(true);
    closeMenu();
    router.push(path);
    setTimeout(() => setIsLoading(false), 500);
  };

  const navItems = [
    { name: 'Bosh sahifa', path: '/', icon: '🏠' },
    { name: 'Xizmatlar', path: '/pages/services', icon: '⚡' },
    { name: 'Portfolio', path: '/pages/portfolio', icon: '💼' },
    { name: 'Biz haqimizda', path: '/pages/about', icon: '👥' },
    { name: 'Aloqa', path: '/pages/contact', icon: '📞' }
  ];

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="w-5 h-5" />;
      case 'light':
        return <Sun className="w-5 h-5" />;
      default:
        return <Moon className="w-5 h-5" />;
    }
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="nav-container">
          {/* Logo */}
          <div className="nav-logo">
            <Link href="/" onClick={closeMenu}>
              <div className="logo-container">
                <div className="logo-icon">💻</div>
                <span className="logo-text">DevVibe</span>
                <div className="logo-pulse"></div>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className="nav-menu">
            {navItems.map((item, index) => (
              <li key={index} className="nav-item">
                <Link
                  href={item.path}
                  className={`nav-link ${pathname === item.path ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth Buttons & Theme */}
          <div className="nav-cta">
            <div className="auth-buttons">
              {/* Theme Toggle */}
              <div className="relative">
                <button
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className="theme-btn flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition duration-200 bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-gray-100 dark:bg-slate-800/80 dark:border-slate-600 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200"
                >
                  {getThemeIcon()}
                </button>
                
                {showThemeMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg py-2 w-48 z-50">
                    <button
                      onClick={() => {
                        setLightTheme();
                        setShowThemeMenu(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-3 ${theme === 'light' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-slate-300'}`}
                    >
                      <Sun className="w-4 h-4" />
                      Light
                    </button>
                    <button
                      onClick={() => {
                        setDarkTheme();
                        setShowThemeMenu(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-3 ${theme === 'dark' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-slate-300'}`}
                    >
                      <Moon className="w-4 h-4" />
                      Dark
                    </button>
                    <button
                      onClick={() => {
                        setSystemTheme();
                        setShowThemeMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-3 text-gray-700 dark:text-slate-300"
                    >
                      <Monitor className="w-4 h-4" />
                      System
                    </button>
                  </div>
                )}
              </div>

              <button className="login-btn" onClick={() => handleNavClick('/pages/login')}>
                <span className="btn-icon">🔑</span>
                Kirish
              </button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className={`nav-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
            <div className="toggle-container">
              <span className="bar bar1"></span>
              <span className="bar bar2"></span>
              <span className="bar bar3"></span>
            </div>
          </div>
        </div>

        {/* Scroll Progress */}
        <div className="scroll-progress">
          <div
            className="progress-bar"
            style={{
              width: `${
                typeof window !== 'undefined'
                  ? Math.min(
                      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100,
                      100
                    )
                  : 0
              }%`
            }}
          ></div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <div className="mobile-logo">
            <div className="logo-icon">✨</div>
            <span>DevVibe</span>
          </div>
          <button className="close-btn" onClick={closeMenu}>
            <span>✕</span>
          </button>
        </div>

        <ul className="mobile-nav-menu">
          {navItems.map((item, index) => (
            <li key={index} className="mobile-nav-item" style={{ animationDelay: `${index * 0.1}s` }}>
              <Link
                href={item.path}
                className={`mobile-nav-link ${pathname === item.path ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <span className="mobile-nav-icon">{item.icon}</span>
                <span className="mobile-nav-text">{item.name}</span>
                <div className="mobile-nav-arrow">→</div>
              </Link>
            </li>
          ))}

          {/* Mobile Theme Toggle */}
          <li className="mobile-nav-item" style={{ animationDelay: '0.5s' }}>
            <div className="mobile-theme-section p-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-slate-400 mb-3">🎨 Tema tanlang</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setLightTheme();
                    closeMenu();
                  }}
                  className={`p-3 rounded-lg border text-center transition-all ${theme === 'light' ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-300' : 'bg-gray-100 border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300'}`}
                >
                  <Sun className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-xs">Yorug'</div>
                </button>
                <button
                  onClick={() => {
                    setDarkTheme();
                    closeMenu();
                  }}
                  className={`p-3 rounded-lg border text-center transition-all ${theme === 'dark' ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-300' : 'bg-gray-100 border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300'}`}
                >
                  <Moon className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-xs">Qorong'u</div>
                </button>
                <button
                  onClick={() => {
                    setSystemTheme();
                    closeMenu();
                  }}
                  className="p-3 rounded-lg border text-center bg-gray-100 border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 transition-all"
                >
                  <Monitor className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-xs">Tizim</div>
                </button>
              </div>
            </div>
          </li>

          {/* Mobile Auth Buttons */}
          <li className="mobile-nav-item mobile-auth-section" style={{ animationDelay: '0.6s' }}>
            <div className="mobile-auth-buttons">
              <button className="mobile-login-btn" onClick={() => handleNavClick('/login')}>
                <span>🔑 Kirish</span>
              </button>
            </div>
          </li>
        </ul>

        <div className="mobile-menu-footer">
          <div className="social-links">
            <a href="#" className="social-link">📱</a>
            <a href="#" className="social-link">💬</a>
            <a href="#" className="social-link">📧</a>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenu}>
          <div className="overlay-pattern"></div>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="nav-loading">
          <div className="loading-spinner"></div>
        </div>
      )}
    </>
  );
};

export default Navigation;
