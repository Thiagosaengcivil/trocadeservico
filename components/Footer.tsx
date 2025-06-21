
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-slate-400">
          &copy; {new Date().getFullYear()} Troca de Serviços. Todos os direitos reservados. Vamos construir uma comunidade de troca!
        </p>
      </div>
    </footer>
  );
};

export default Footer;
