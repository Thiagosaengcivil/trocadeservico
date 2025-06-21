
import React from 'react';
import { Service } from '../types';
import { UserIcon, BriefcaseIcon } from './icons';

interface ServiceCardProps {
  service: Service;
  onStartContact: (userId: string, serviceId: string) => void; // Added prop to initiate contact
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onStartContact }) => {
  return (
    <div className="bg-slate-800 shadow-xl rounded-lg overflow-hidden transition-all duration-300 hover:shadow-sky-500/30 hover:scale-[1.02] border border-slate-700 flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex items-start mb-4">
          {service.userProfileImageUrl && (
            <img 
              src={service.userProfileImageUrl} 
              alt={service.offeredByFullName} 
              className="w-16 h-16 rounded-full mr-4 border-2 border-sky-500 object-cover" 
            />
          )}
          <div>
            <h3 className="text-xl font-semibold text-sky-400">{service.serviceName}</h3>
            <p className="text-sm text-slate-400 mt-1">
              Categoria: <span className="font-medium text-slate-300">{service.category}</span>
            </p>
          </div>
        </div>
        
        <p className="text-slate-300 text-sm mb-4 h-20 overflow-y-auto custom-scrollbar">
          {service.description}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-700">
            <div className="flex items-center text-sm text-slate-400 mb-2">
              <UserIcon className="w-4 h-4 mr-2 text-sky-500" />
              Oferecido por: <span className="font-medium text-slate-200 ml-1">{service.offeredByFullName}</span>
            </div>
            <div className="flex items-center text-sm text-slate-400">
              <BriefcaseIcon className="w-4 h-4 mr-2 text-sky-500" />
              Profissão: <span className="font-medium text-slate-200 ml-1">{service.offeredByProfession}</span>
            </div>
        </div>
      </div>
      <div className="bg-slate-700/50 px-6 py-3">
        <button 
          onClick={() => onStartContact(service.userId, service.id)} // Modified onClick
          className="w-full text-center px-4 py-2 border border-sky-500 text-sm font-medium rounded-md text-sky-400 hover:bg-sky-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors duration-150"
        >
          Manifestar Interesse
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
