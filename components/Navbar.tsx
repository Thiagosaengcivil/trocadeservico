import React from 'react';
import { BriefcaseIcon, UserIcon as ProfileIcon, ChatBubbleLeftRightIcon } from './icons'; // Renamed UserIcon to ProfileIcon for clarity
import { User } from '../types';

interface NavbarProps {
  currentUser: User | null;
  unreadMessagesCount?: number; // New: for chat notification badge
  onNavigateHome: () => void;
  onNavigateToLogin: () => void;
  onNavigateToRegistration: () => void;
  onLogout: () => void;
  onNavigateToChats?: () => void; // New/Updated: for navigating to chat (list or specific)
  onNavigateToUserProfile?: () => void; 
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentUser, 
  unreadMessagesCount = 0,
  onNavigateHome, 
  onNavigateToLogin, 
  onNavigateToRegistration, 
  onLogout,
  onNavigateToChats,
  onNavigateToUserProfile
}) => {
  return (
    <nav className="bg-slate-900/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={onNavigateHome} className="flex-shrink-0 flex items-center text-white focus:outline-none">
              <BriefcaseIcon className="h-8 w-8 text-sky-400" />
              <span className="ml-3 text-2xl font-bold tracking-tight">Troca<span className="text-sky-400">Serviços</span></span>
            </button>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {currentUser ? (
              <>
                <span className="text-sm text-slate-300 hidden sm:block">
                  Olá, <span className="font-medium text-sky-400">{currentUser.fullName.split(' ')[0]}</span>!
                </span>
                
                {onNavigateToUserProfile && (
                  <button
                    onClick={onNavigateToUserProfile}
                    title="Meu Perfil"
                    className="p-2 rounded-full text-slate-300 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors flex items-center"
                    aria-label="Meu Perfil"
                  >
                    <ProfileIcon className="h-5 w-5" />
                    <span className="ml-1 hidden md:inline text-sm">Meu Perfil</span>
                  </button>
                )}

                {onNavigateToChats && (
                  <button
                    onClick={onNavigateToChats}
                    title="Minhas Conversas"
                    className="relative p-2 rounded-full text-slate-300 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors flex items-center"
                    aria-label="Minhas Conversas"
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5" />
                    <span className="ml-1 hidden md:inline text-sm">Conversas</span>
                    {unreadMessagesCount > 0 && (
                      <span className="absolute top-0 right-0 block h-5 w-5 transform -translate-y-1/2 translate-x-1/2">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600 text-white text-xs items-center justify-center">
                          {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                        </span>
                      </span>
                    )}
                  </button>
                )}
                
                <button
                  onClick={onLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onNavigateToLogin}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors"
                >
                  Entrar
                </button>
                <button
                  onClick={onNavigateToRegistration}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-600 transition-colors"
                >
                  Cadastre-se
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;