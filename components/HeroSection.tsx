import React from 'react';
import { ArrowRightIcon } from './icons';

interface HeroSectionProps {
  onNavigateToRegistration: () => void;
  onNavigateToDashboard: () => void; // This will implicitly require login via App.tsx logic
  onNavigateToLogin: () => void;
  onNavigateToHowItWorks: () => void; // New prop
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  onNavigateToRegistration, 
  onNavigateToDashboard, 
  onNavigateToLogin,
  onNavigateToHowItWorks // New prop
}) => {
  return (
    <div className="flex-grow flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          <span className="block">Desbloqueie um Mundo de</span>
          <span className="block text-sky-400">Troca de Habilidades. Economize Dinheiro.</span>
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-xl text-slate-300 sm:max-w-xl">
          Junte-se ao Troca de Serviços, a plataforma onde seus talentos se tornam sua moeda. Ofereça seus serviços, descubra o que outros oferecem e participe de trocas mutuamente benéficas.
        </p>
        <div className="mt-10 max-w-md mx-auto sm:max-w-lg sm:flex sm:flex-col sm:items-center sm:space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:justify-center">
          <button
            onClick={onNavigateToRegistration}
            className="w-full md:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-slate-900 bg-sky-400 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition duration-150 ease-in-out transform hover:scale-105"
          >
            Comece Agora & Cadastre-se
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
          <button
            onClick={onNavigateToDashboard} // App.tsx will handle redirect to login if not authenticated
            className="w-full md:w-auto mt-4 md:mt-0 flex items-center justify-center px-8 py-3 border border-sky-500 text-base font-medium rounded-md text-sky-400 hover:bg-sky-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition duration-150 ease-in-out"
          >
            Explorar Serviços
          </button>
          <button
            onClick={onNavigateToHowItWorks} // New button
            className="w-full md:w-auto mt-4 md:mt-0 flex items-center justify-center px-8 py-3 border border-teal-500 text-base font-medium rounded-md text-teal-400 hover:bg-teal-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-teal-500 transition duration-150 ease-in-out"
          >
            Como Funciona?
          </button>
        </div>
        <p className="mt-8 text-sm text-slate-400">
          Já é membro?{' '}
          <button 
            onClick={(e) => { e.preventDefault(); onNavigateToLogin(); }} 
            className="font-medium text-sky-400 hover:text-sky-300 focus:outline-none"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
};

export default HeroSection;