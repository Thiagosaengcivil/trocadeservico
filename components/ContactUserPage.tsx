
import React, { useState } from 'react';
import { User, Service } from '../types';
import { UserIcon, BriefcaseIcon, PaperAirplaneIcon, ArrowLeftIcon } from './icons';

interface ContactUserPageProps {
  currentUser: User;
  contactUser: User;
  contactService: Service;
  onSendMessage: (receiverId: string, serviceId: string, messageText: string) => void;
  onNavigateBack: () => void;
}

const ContactUserPage: React.FC<ContactUserPageProps> = ({ 
    currentUser, 
    contactUser, 
    contactService, 
    onSendMessage,
    onNavigateBack 
}) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Por favor, escreva uma mensagem.");
      return;
    }
    setError(null);
    onSendMessage(contactUser.id, contactService.id, message.trim());
    // Navigation to chat page will be handled by App.tsx after message is sent
  };

  if (!contactUser || !contactService) {
    return (
        <div className="text-center py-12 px-4 text-slate-300">
            <p>Usuário ou serviço não encontrado.</p>
            <button
                onClick={onNavigateBack}
                className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 flex items-center mx-auto"
            >
                <ArrowLeftIcon className="mr-2" /> Voltar
            </button>
        </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <button
          onClick={onNavigateBack}
          className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-sky-400 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
      >
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Voltar para Serviços
      </button>

      <div className="bg-slate-700/50 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden border border-slate-600">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-sky-400 mb-6 text-center">
            Contatar {contactUser.fullName.split(' ')[0]} sobre o serviço "{contactService.serviceName}"
          </h2>

          <div className="mb-6 p-4 border border-slate-600 rounded-md bg-slate-800">
            <h3 className="text-lg font-semibold text-white mb-2">Detalhes do Prestador:</h3>
            <div className="flex items-center mb-2">
              {contactUser.userProfileImageUrl && (
                <img src={contactUser.userProfileImageUrl} alt={contactUser.fullName} className="w-12 h-12 rounded-full mr-3 border-2 border-sky-400"/>
              )}
              <div>
                <p className="text-slate-200 font-medium">{contactUser.fullName}</p>
                <p className="text-sm text-slate-400">{contactUser.profession}</p>
              </div>
            </div>
             <p className="text-sm text-slate-400">Cidade: {contactUser.city}</p>
          </div>

          <div className="mb-6 p-4 border border-slate-600 rounded-md bg-slate-800">
            <h3 className="text-lg font-semibold text-white mb-2">Sobre o Serviço:</h3>
            <p className="text-slate-200 font-medium">{contactService.serviceName}</p>
            <p className="text-sm text-slate-400 mt-1">{contactService.description}</p>
            <p className="text-sm text-slate-400 mt-1">Categoria: {contactService.category}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">
                Sua mensagem para {contactUser.fullName.split(' ')[0]}:
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Olá ${contactUser.fullName.split(' ')[0]}, estou interessado(a) no seu serviço de ${contactService.serviceName}...`}
                required
                className="block w-full p-2.5 bg-slate-600 border border-slate-500 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white custom-scrollbar"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div>
              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 transition duration-150 ease-in-out"
              >
                <PaperAirplaneIcon className="h-5 w-5 mr-2 transform -rotate-45" />
                Enviar Mensagem e Iniciar Chat
              </button>
            </div>
          </form>
          <p className="mt-4 text-xs text-slate-400 text-center">
            Ao enviar, um chat será iniciado entre você e {contactUser.fullName.split(' ')[0]}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUserPage;
