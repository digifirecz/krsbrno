'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { LogOut, LayoutDashboard, FileText, Users, Settings } from 'lucide-react';
import { getPathForTab } from '@/lib/routes';

interface AdminSectionProps {
  setActiveTab?: (tab: string) => void;
}

export default function AdminSection({ setActiveTab }: AdminSectionProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        // Not logged in -> redirect to login
        if (setActiveTab) {
          setActiveTab('login');
        } else if (typeof window !== 'undefined') {
          window.location.href = getPathForTab('login');
        }
      }
    });
    return () => unsubscribe();
  }, [setActiveTab]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (setActiveTab) {
        setActiveTab('home');
      } else if (typeof window !== 'undefined') {
        window.location.href = getPathForTab('home');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!userEmail) {
    return (
      <div className="py-20 flex justify-center items-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[70vh]">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Menu */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 flex flex-col h-full space-y-1">
            <div className="mb-6 px-4 py-2">
              <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Administrace</h2>
              <p className="text-xs text-neutral-600 mt-1 truncate" title={userEmail}>{userEmail}</p>
            </div>
            
            <button className="flex items-center space-x-3 w-full px-4 py-3 bg-red-50 text-[#c93838] rounded-xl text-sm font-semibold transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              <span>Přehled</span>
            </button>
            <button className="flex items-center space-x-3 w-full px-4 py-3 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 rounded-xl text-sm font-medium transition-colors">
              <FileText className="w-5 h-5" />
              <span>Kázání a záznamy</span>
            </button>
            <button className="flex items-center space-x-3 w-full px-4 py-3 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 rounded-xl text-sm font-medium transition-colors">
              <Users className="w-5 h-5" />
              <span>Členové</span>
            </button>
            <button className="flex items-center space-x-3 w-full px-4 py-3 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 rounded-xl text-sm font-medium transition-colors">
              <Settings className="w-5 h-5" />
              <span>Nastavení</span>
            </button>
            
            <div className="mt-auto pt-8">
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-4 py-3 text-neutral-500 hover:bg-neutral-50 hover:text-[#c93838] rounded-xl text-sm font-medium transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Odhlásit se</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-neutral-100 h-full">
            <h1 className="text-3xl font-extrabold text-neutral-900 font-serif mb-2">
              Vítejte v administraci
            </h1>
            <p className="text-neutral-500 mb-8">
              Zde budeme postupně přidávat funkce pro správu sboru.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Placeholder Card 1 */}
              <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6 flex flex-col items-start">
                <div className="w-10 h-10 bg-white shadow-sm border border-neutral-100 rounded-xl flex items-center justify-center text-[#c93838] mb-4">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-neutral-900 mb-1">Správa kázání</h3>
                <p className="text-sm text-neutral-500">Přidávání a úprava záznamů bohoslužeb.</p>
                <span className="mt-4 text-xs font-semibold px-2.5 py-1 bg-neutral-200 text-neutral-600 rounded-md">Připravujeme</span>
              </div>
              
              {/* Placeholder Card 2 */}
              <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6 flex flex-col items-start">
                <div className="w-10 h-10 bg-white shadow-sm border border-neutral-100 rounded-xl flex items-center justify-center text-[#c93838] mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-neutral-900 mb-1">Seznam členů</h3>
                <p className="text-sm text-neutral-500">Správa přístupů a adresář.</p>
                <span className="mt-4 text-xs font-semibold px-2.5 py-1 bg-neutral-200 text-neutral-600 rounded-md">Připravujeme</span>
              </div>
            </div>
          </div>
        </main>
        
      </div>
    </div>
  );
}
