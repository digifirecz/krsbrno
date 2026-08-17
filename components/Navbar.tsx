'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Menu, 
  X, 
  ChevronDown, 
  HeartHandshake, 
  Calendar, 
  BookOpen, 
  Church
} from 'lucide-react';
import { getPathForTab } from '@/lib/routes';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAiModal?: () => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [kdoJsmeOpen, setKdoJsmeOpen] = useState(false);
  const [coDelameOpen, setCoDelameOpen] = useState(false);
  
  // Mobile accordion states (default open or toggled for simple access)
  const [mobileKdoJsmeOpen, setMobileKdoJsmeOpen] = useState(true);
  const [mobileCoDelameOpen, setMobileCoDelameOpen] = useState(true);

  const [scrolled, setScrolled] = useState(false);

  const kdoJsmeRef = useRef<HTMLDivElement>(null);
  const coDelameRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (kdoJsmeRef.current && !kdoJsmeRef.current.contains(event.target as Node)) {
        setKdoJsmeOpen(false);
      }
      if (coDelameRef.current && !coDelameRef.current.contains(event.target as Node)) {
        setCoDelameOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setKdoJsmeOpen(false);
        setCoDelameOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (tab: string, e?: React.MouseEvent) => {
    if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) {
      // Allow opening in new tab
      return;
    }
    if (e) {
      e.preventDefault();
    }
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setKdoJsmeOpen(false);
    setCoDelameOpen(false);
  };

  const isKdoJsmeActive = ['about', 'beliefs', 'confession', 'history', 'management', 'leadership'].includes(activeTab);
  const isCoDelameActive = ['meetings', 'library', 'youth', 'teens', 'kids', 'groups'].includes(activeTab);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200/80' : 'bg-white border-b border-neutral-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <a 
            href={getPathForTab('home')}
            onClick={(e) => handleNavigate('home', e)} 
            className="flex items-center text-left focus:outline-none group py-1 transition-transform duration-300 hover:scale-105 cursor-pointer"
            id="nav-logo"
            aria-label="Křesťanský sbor Brno - Domů"
          >
            <div className="relative h-9 sm:h-11 w-48 sm:w-56">
              <Image 
                src="/logo.png" 
                alt="Křesťanský sbor Brno" 
                fill 
                className="object-contain object-left" 
                priority
                referrerPolicy="no-referrer"
              />
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            
            {/* Úvod */}
            <a
              href={getPathForTab('home')}
              onClick={(e) => handleNavigate('home', e)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${activeTab === 'home' ? 'text-[#c93838] bg-red-50/90 font-semibold' : 'text-neutral-700 hover:text-[#c93838] hover:bg-neutral-50'}`}
              id="nav-home"
            >
              Úvod
            </a>

            {/* Kdo jsme Dropdown (Pouze: Čemu věříme, O našem sboru) */}
            <div 
              ref={kdoJsmeRef}
              className="relative"
              onMouseEnter={() => {
                setKdoJsmeOpen(true);
                setCoDelameOpen(false);
              }}
              onMouseLeave={() => setKdoJsmeOpen(false)}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setKdoJsmeOpen((prev) => !prev);
                  setCoDelameOpen(false);
                }}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${isKdoJsmeActive ? 'text-[#c93838] bg-red-50/90 font-semibold' : 'text-neutral-700 hover:text-[#c93838] hover:bg-neutral-50'}`}
                id="nav-about-dropdown"
                type="button"
                aria-expanded={kdoJsmeOpen}
              >
                <span>Kdo jsme</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${kdoJsmeOpen ? 'rotate-180 text-[#c93838]' : ''}`} />
              </button>

              {kdoJsmeOpen && (
                <div className="absolute left-0 top-full pt-1.5 w-52 z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-neutral-200/90 py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                    <a
                      href={getPathForTab('beliefs')}
                      onClick={(e) => handleNavigate('beliefs', e)}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 hover:text-[#c93838] font-medium transition-colors flex items-center space-x-2.5 cursor-pointer ${activeTab === 'beliefs' ? 'text-[#c93838] bg-red-50/60 font-semibold' : 'text-neutral-700'}`}
                    >
                      <HeartHandshake className="w-4 h-4 text-[#c93838]" />
                      <span>Čemu věříme</span>
                    </a>
                    <a
                      href={getPathForTab('about')}
                      onClick={(e) => handleNavigate('about', e)}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 hover:text-[#c93838] font-medium transition-colors flex items-center space-x-2.5 cursor-pointer ${activeTab === 'about' ? 'text-[#c93838] bg-red-50/60 font-semibold' : 'text-neutral-700'}`}
                    >
                      <Church className="w-4 h-4 text-[#c93838]" />
                      <span>O našem sboru</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Co děláme Dropdown (Pouze: Společná setkávání, Knihovna DEN) */}
            <div 
              ref={coDelameRef}
              className="relative"
              onMouseEnter={() => {
                setCoDelameOpen(true);
                setKdoJsmeOpen(false);
              }}
              onMouseLeave={() => setCoDelameOpen(false)}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setCoDelameOpen((prev) => !prev);
                  setKdoJsmeOpen(false);
                }}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${isCoDelameActive ? 'text-[#c93838] bg-red-50/90 font-semibold' : 'text-neutral-700 hover:text-[#c93838] hover:bg-neutral-50'}`}
                id="nav-groups-dropdown"
                type="button"
                aria-expanded={coDelameOpen}
              >
                <span>Co děláme</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${coDelameOpen ? 'rotate-180 text-[#c93838]' : ''}`} />
              </button>

              {coDelameOpen && (
                <div className="absolute left-0 top-full pt-1.5 w-56 z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-neutral-200/90 py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                    <a
                      href={getPathForTab('meetings')}
                      onClick={(e) => handleNavigate('meetings', e)}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 hover:text-[#c93838] font-medium transition-colors flex items-center space-x-2.5 cursor-pointer ${activeTab === 'meetings' ? 'text-[#c93838] bg-red-50/60 font-semibold' : 'text-neutral-700'}`}
                    >
                      <Calendar className="w-4 h-4 text-[#c93838]" />
                      <span>Společná setkávání</span>
                    </a>
                    <a
                      href={getPathForTab('library')}
                      onClick={(e) => handleNavigate('library', e)}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 hover:text-[#c93838] font-medium transition-colors flex items-center space-x-2.5 cursor-pointer ${activeTab === 'library' ? 'text-[#c93838] bg-red-50/60 font-semibold' : 'text-neutral-700'}`}
                    >
                      <BookOpen className="w-4 h-4 text-[#c93838]" />
                      <span>Knihovna DEN</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Kázání */}
            <a
              href={getPathForTab('sermons')}
              onClick={(e) => handleNavigate('sermons', e)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${activeTab === 'sermons' ? 'text-[#c93838] bg-red-50/90 font-semibold' : 'text-neutral-700 hover:text-[#c93838] hover:bg-neutral-50'}`}
              id="nav-sermons"
            >
              Kázání
            </a>

            {/* Kontakt */}
            <a
              href={getPathForTab('contact')}
              onClick={(e) => handleNavigate('contact', e)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${activeTab === 'contact' ? 'text-[#c93838] bg-red-50/90 font-semibold' : 'text-neutral-700 hover:text-[#c93838] hover:bg-neutral-50'}`}
              id="nav-contact"
            >
              Kontakt
            </a>

            {/* Podpora */}
            <a
              href={getPathForTab('support')}
              onClick={(e) => handleNavigate('support', e)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${activeTab === 'support' ? 'text-[#c93838] bg-red-50/90 font-semibold' : 'text-neutral-700 hover:text-[#c93838] hover:bg-neutral-50'}`}
              id="nav-support"
            >
              Podpora
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-neutral-700 hover:text-[#c93838] hover:bg-neutral-100 focus:outline-none cursor-pointer"
              aria-label="Otevřít menu"
              id="btn-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 pt-2 pb-6 space-y-1 animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-5rem)] overflow-y-auto shadow-xl">
          <a
            href={getPathForTab('home')}
            onClick={(e) => handleNavigate('home', e)}
            className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold transition-colors cursor-pointer ${activeTab === 'home' ? 'text-[#c93838] bg-red-50' : 'text-neutral-900 hover:bg-neutral-50'}`}
          >
            Úvod
          </a>
          
          {/* Mobile Accordion: Kdo jsme */}
          <div className="border-t border-neutral-100 pt-1.5 pb-1">
            <button 
              onClick={() => setMobileKdoJsmeOpen(!mobileKdoJsmeOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold text-neutral-800 hover:bg-neutral-50 cursor-pointer"
            >
              <span className="uppercase tracking-wider text-xs text-neutral-500">Kdo jsme</span>
              <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${mobileKdoJsmeOpen ? 'rotate-180 text-[#c93838]' : ''}`} />
            </button>

            {mobileKdoJsmeOpen && (
              <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-red-100 ml-3 mt-1">
                <a 
                  href={getPathForTab('beliefs')}
                  onClick={(e) => handleNavigate('beliefs', e)} 
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center space-x-2 ${activeTab === 'beliefs' ? 'text-[#c93838] bg-red-50 font-bold' : 'text-neutral-700 hover:bg-neutral-50'}`}
                >
                  <HeartHandshake className="w-4 h-4 text-[#c93838]" />
                  <span>Čemu věříme</span>
                </a>
                <a 
                  href={getPathForTab('about')}
                  onClick={(e) => handleNavigate('about', e)} 
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center space-x-2 ${activeTab === 'about' ? 'text-[#c93838] bg-red-50 font-bold' : 'text-neutral-700 hover:bg-neutral-50'}`}
                >
                  <Church className="w-4 h-4 text-[#c93838]" />
                  <span>O našem sboru</span>
                </a>
              </div>
            )}
          </div>

          {/* Mobile Accordion: Co děláme */}
          <div className="border-t border-neutral-100 pt-1.5 pb-1">
            <button 
              onClick={() => setMobileCoDelameOpen(!mobileCoDelameOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold text-neutral-800 hover:bg-neutral-50 cursor-pointer"
            >
              <span className="uppercase tracking-wider text-xs text-neutral-500">Co děláme</span>
              <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${mobileCoDelameOpen ? 'rotate-180 text-[#c93838]' : ''}`} />
            </button>

            {mobileCoDelameOpen && (
              <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-red-100 ml-3 mt-1">
                <a 
                  href={getPathForTab('meetings')}
                  onClick={(e) => handleNavigate('meetings', e)} 
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center space-x-2 ${activeTab === 'meetings' ? 'text-[#c93838] bg-red-50 font-bold' : 'text-neutral-700 hover:bg-neutral-50'}`}
                >
                  <Calendar className="w-4 h-4 text-[#c93838]" />
                  <span>Společná setkávání</span>
                </a>
                <a 
                  href={getPathForTab('library')}
                  onClick={(e) => handleNavigate('library', e)} 
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center space-x-2 ${activeTab === 'library' ? 'text-[#c93838] bg-red-50 font-bold' : 'text-neutral-700 hover:bg-neutral-50'}`}
                >
                  <BookOpen className="w-4 h-4 text-[#c93838]" />
                  <span>Knihovna DEN</span>
                </a>
              </div>
            )}
          </div>

          <div className="border-t border-neutral-100 pt-1">
            <a 
              href={getPathForTab('sermons')}
              onClick={(e) => handleNavigate('sermons', e)} 
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition-colors cursor-pointer ${activeTab === 'sermons' ? 'text-[#c93838] bg-red-50 font-bold' : 'text-neutral-900 hover:bg-neutral-50'}`}
            >
              Kázání
            </a>
            <a 
              href={getPathForTab('contact')}
              onClick={(e) => handleNavigate('contact', e)} 
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition-colors cursor-pointer ${activeTab === 'contact' ? 'text-[#c93838] bg-red-50 font-bold' : 'text-neutral-900 hover:bg-neutral-50'}`}
            >
              Kontakt
            </a>
            <a 
              href={getPathForTab('support')}
              onClick={(e) => handleNavigate('support', e)} 
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition-colors cursor-pointer ${activeTab === 'support' ? 'text-[#c93838] bg-red-50 font-bold' : 'text-neutral-900 hover:bg-neutral-50'}`}
            >
              Podpora
            </a>
            <a 
              href={getPathForTab('login')}
              onClick={(e) => handleNavigate('login', e)} 
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition-colors cursor-pointer ${activeTab === 'login' ? 'text-[#c93838] bg-red-50 font-bold' : 'text-neutral-600 hover:bg-neutral-50'}`}
            >
              Přihlášení
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
