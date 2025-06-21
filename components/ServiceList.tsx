import React from 'react';
import { Service } from '../types';
import ServiceCard from './ServiceCard';
import { BriefcaseIcon } from './icons'; // Assuming BriefcaseIcon can be used for profession

interface ServiceListProps {
  services: Service[];
  onStartContact: (userId: string, serviceId: string) => void;
  allCategories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchText: string;
  onSearchTextChange: (text: string) => void;
  professionSearchText: string;
  onProfessionSearchChange: (text: string) => void;
  citySearchText: string;
  onCitySearchChange: (text: string) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ 
  services, 
  onStartContact, 
  allCategories, 
  selectedCategory, 
  onCategoryChange,
  searchText,
  onSearchTextChange,
  professionSearchText,
  onProfessionSearchChange,
  citySearchText,
  onCitySearchChange,
}) => {
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCategoryChange(e.target.value);
  };

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchTextChange(e.target.value);
  };

  const handleProfessionSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onProfessionSearchChange(e.target.value);
  };

  const handleCitySearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCitySearchChange(e.target.value);
  };

  const hasActiveCategoryFilter = selectedCategory !== "";
  const hasActiveTextSearch = searchText !== "";
  const hasActiveProfessionSearch = professionSearchText !== "";
  const hasActiveCitySearch = citySearchText !== "";
  const hasAnyActiveFilter = hasActiveCategoryFilter || hasActiveTextSearch || hasActiveProfessionSearch || hasActiveCitySearch;

  const clearAllFilters = () => {
    onCategoryChange("");
    onSearchTextChange("");
    onProfessionSearchChange("");
    onCitySearchChange("");
  }

  if (services.length === 0 && !hasAnyActiveFilter) { // Only show "no services YET" if no filters active
    return (
      <div className="text-center py-12 px-4">
        <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-2xl font-medium text-white">Nenhum serviço disponível ainda</h3>
        <p className="mt-1 text-slate-400">Seja o primeiro a oferecer um serviço ou volte mais tarde!</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-white text-center mb-6">Serviços Disponíveis para Troca</h2>
      
      <div className="mb-8 p-4 bg-slate-800 rounded-lg shadow border border-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            {/* Category Filter */}
            <div>
                <label htmlFor="category-filter" className="block text-sm font-medium text-slate-300 mb-1">
                Categoria:
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                        </svg>
                    </div>
                    <select
                        id="category-filter"
                        name="category-filter"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="block w-full pl-10 pr-3 py-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white"
                    >
                        <option value="">Todas as Categorias</option>
                        {allCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Text Search Filter */}
            <div>
                <label htmlFor="search-text-filter" className="block text-sm font-medium text-slate-300 mb-1">
                Palavra-chave:
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
                           <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="search-text-filter"
                        name="search-text-filter"
                        value={searchText}
                        onChange={handleSearchTextChange}
                        placeholder="Nome, descrição, etc."
                        className="block w-full pl-10 pr-10 py-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white"
                    />
                    {searchText && (
                        <button 
                            onClick={() => onSearchTextChange("")}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-sky-400"
                            aria-label="Limpar busca por palavra-chave"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Profession Search Filter */}
            <div>
                <label htmlFor="profession-search-filter" className="block text-sm font-medium text-slate-300 mb-1">
                Profissão:
                </label>
                <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BriefcaseIcon className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        id="profession-search-filter"
                        name="profession-search-filter"
                        value={professionSearchText}
                        onChange={handleProfessionSearchChange}
                        placeholder="Ex: Eletricista"
                        className="block w-full pl-10 pr-10 py-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white"
                    />
                    {professionSearchText && (
                        <button 
                            onClick={() => onProfessionSearchChange("")}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-sky-400"
                            aria-label="Limpar busca por profissão"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                        </button>
                    )}
                </div>
            </div>
             {/* City Search Filter */}
             <div>
                <label htmlFor="city-search-filter" className="block text-sm font-medium text-slate-300 mb-1">
                Cidade:
                </label>
                <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="city-search-filter"
                        name="city-search-filter"
                        value={citySearchText}
                        onChange={handleCitySearchChange}
                        placeholder="Ex: São Paulo"
                        className="block w-full pl-10 pr-10 py-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white"
                    />
                    {citySearchText && (
                        <button 
                            onClick={() => onCitySearchChange("")}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-sky-400"
                            aria-label="Limpar busca por cidade"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
        {hasAnyActiveFilter && (
             <button 
                onClick={clearAllFilters}
                className="mt-6 w-full md:w-auto px-4 py-2 bg-sky-600 text-white text-sm rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
            >
                Limpar Todos os Filtros
            </button>
        )}
      </div>
      
      {services.length === 0 && hasAnyActiveFilter && ( // Show "no services FOUND" if filters active and no results
            <div className="text-center py-12 px-4">
                <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <h3 className="mt-2 text-2xl font-medium text-white">Nenhum serviço encontrado</h3>
                <p className="mt-1 text-slate-400">Tente ajustar seus filtros de busca ou remova-os para ver mais opções.</p>
                <button 
                    onClick={clearAllFilters}
                    className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
                >
                    Limpar Todos os Filtros
                </button>
            </div>
        )}

      {services.length > 0 && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(service => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              onStartContact={onStartContact}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceList;