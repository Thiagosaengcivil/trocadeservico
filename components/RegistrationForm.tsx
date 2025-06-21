import React, { useState } from 'react';
import { User, Service } from '../types';
import { generateServiceDescriptionWithGemini } from '../services/geminiService';
import { UserIcon, BriefcaseIcon, SparklesIcon, LoadingSpinnerIcon } from './icons';

interface RegistrationFormProps {
  onRegister: (user: User, service: Service) => void;
  onNavigateToLogin: () => void; // For "Already have an account?" link
}

// InputField component (remains the same, but let's ensure it's here for context)
const InputField: React.FC<{label: string, type?: string, value: string, onChange: (val: string) => void, placeholder?: string, required?: boolean, icon?: React.ReactNode, name?: string}> = 
  ({label, type = "text", value, onChange, placeholder, required, icon, name}) => (
  <div>
    <label htmlFor={name || label} className="block text-sm font-medium text-slate-300 mb-1">{label} {required && <span className="text-red-400">*</span>}</label>
    <div className="relative">
      {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
      <input
        type={type}
        id={name || label}
        name={name || label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`block w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white`}
      />
    </div>
  </div>
);

const serviceCategories = [
  "🩺 Saúde e Bem-estar",
  "💇 Beleza e Estética",
  "🏗️ Construção e Reformas",
  "🧹 Serviços Domésticos e Limpeza",
  "💻 Tecnologia e Informática",
  "📚 Educação e Aulas",
  "🧾 Serviços Administrativos e Financeiros",
  "🚚 Transporte e Logística",
  "🐶 Serviços para Pets",
  "📸 Eventos e Entretenimento",
  "🏡 Serviços Imobiliários"
];


const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister, onNavigateToLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [profession, setProfession] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleGenerateDescription = async () => {
    if (!serviceName.trim() || !profession.trim()) {
      setGenerationError("Por favor, insira sua profissão e o nome/palavras-chave do serviço primeiro.");
      return;
    }
    setGenerationError(null);
    setIsGeneratingDesc(true);
    try {
      const description = await generateServiceDescriptionWithGemini(serviceName, profession);
      setServiceDescription(description);
    } catch (error) {
      console.error("Falha ao gerar descrição:", error);
      setGenerationError("Falha ao gerar descrição. Tente novamente ou escreva manualmente.");
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!fullName || !email || !password || !profession || !serviceName || !serviceDescription || !serviceCategory) {
        setFormError("Por favor, preencha todos os campos obrigatórios, incluindo a categoria do serviço.");
        return;
    }
    if (password !== confirmPassword) {
      setFormError("As senhas não coincidem.");
      return;
    }
    // Basic password validation (example)
    if (password.length < 6) {
        setFormError("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    const userId = `user-${Date.now()}`;
    const userProfileImageUrl = `https://picsum.photos/seed/${userId}/100/100`;
    // IMPORTANT: Storing password directly is insecure. In a real app, hash it on the server.
    const newUser: User = { 
      id: userId, 
      fullName, 
      email, 
      password, 
      address, 
      city, 
      profession,
      userProfileImageUrl // Assign the generated URL to the user object
    };
    const newService: Service = {
      id: `service-${Date.now()}`,
      userId,
      serviceName,
      description: serviceDescription,
      category: serviceCategory, // Now mandatory, direct assignment
      offeredByFullName: fullName,
      offeredByProfession: profession,
      userProfileImageUrl // Also assign to service, as currently used by ServiceCard
    };
    onRegister(newUser, newService);
    // After successful registration, App.tsx will navigate to Login
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-800">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-sky-400">Crie seu Perfil em Troca de Serviços</h2>
        <p className="mt-2 text-center text-sm text-slate-300">
          E comece a trocar serviços hoje mesmo! Campos marcados com <span className="text-red-400">*</span> são obrigatórios.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-slate-700/50 backdrop-blur-sm py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-slate-600">
          <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset className="border border-slate-600 p-4 rounded-md">
              <legend className="text-lg font-medium text-sky-400 px-2 flex items-center"><UserIcon className="w-5 h-5 mr-2"/>Informações Pessoais</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <InputField label="Nome Completo" name="fullNameReg" value={fullName} onChange={setFullName} placeholder="Seu Nome Completo" required icon={<UserIcon className="h-5 w-5 text-slate-400" />}/>
                <InputField label="Endereço de Email" name="emailReg" type="email" value={email} onChange={setEmail} placeholder="voce@exemplo.com" required icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>}/>
                <InputField label="Senha" name="passwordReg" type="password" value={password} onChange={setPassword} placeholder="Mínimo 6 caracteres" required icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>}/>
                <InputField label="Confirmar Senha" name="confirmPasswordReg" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Repita sua senha" required icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>}/>
                <InputField label="Endereço (Rua, Nº)" name="addressReg" value={address} onChange={setAddress} placeholder="Rua Principal, 123" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>}/>
                <InputField label="Cidade" name="cityReg" value={city} onChange={setCity} placeholder="Sua Cidade" />
                <InputField label="Profissão" name="professionReg" value={profession} onChange={setProfession} placeholder="Ex: Desenvolvedor Web, Encanador" required icon={<BriefcaseIcon className="h-5 w-5 text-slate-400" />}/>
              </div>
            </fieldset>

            <fieldset className="border border-slate-600 p-4 rounded-md">
              <legend className="text-lg font-medium text-sky-400 px-2 flex items-center"><BriefcaseIcon className="w-5 h-5 mr-2"/>Serviço que Você Oferece</legend>
              <div className="space-y-6 mt-4">
                <InputField label="Nome do Serviço / Palavras-chave" name="serviceNameReg" value={serviceName} onChange={setServiceName} placeholder="Ex: Design de Logotipo, Reparo Hidráulico Básico" required />
                <div>
                  <label htmlFor="serviceDescriptionReg" className="block text-sm font-medium text-slate-300 mb-1">Descrição do Serviço <span className="text-red-400">*</span></label>
                  <textarea
                    id="serviceDescriptionReg"
                    name="serviceDescriptionReg"
                    rows={3}
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                    placeholder="Descreva o serviço que você está oferecendo. Como você pode ajudar os outros?"
                    required
                    className="block w-full p-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isGeneratingDesc || !process.env.API_KEY}
                    className="mt-2 flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingDesc ? <LoadingSpinnerIcon /> : <SparklesIcon />}
                    <span className="ml-2">{isGeneratingDesc ? 'Gerando...' : 'Gerar com IA'}</span>
                  </button>
                  {!process.env.API_KEY && <p className="mt-1 text-xs text-yellow-400">Geração por IA desabilitada. API_KEY não configurada.</p>}
                  {generationError && <p className="mt-1 text-xs text-red-400">{generationError}</p>}
                </div>
                <div>
                  <label htmlFor="serviceCategoryReg" className="block text-sm font-medium text-slate-300 mb-1">Categoria do Serviço <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                      </svg>
                    </div>
                    <select
                      id="serviceCategoryReg"
                      name="serviceCategoryReg"
                      value={serviceCategory}
                      onChange={(e) => setServiceCategory(e.target.value)}
                      required // HTML5 validation for select
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white"
                    >
                      <option value="" disabled>Selecione uma categoria *</option>
                      {serviceCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </fieldset>
            
            {formError && <p className="text-sm text-red-400 text-center">{formError}</p>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 transition duration-150 ease-in-out transform hover:scale-105"
              >
                Cadastrar e Oferecer Serviço
              </button>
            </div>
            <p className="mt-4 text-center text-sm text-slate-400">
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="font-medium text-sky-400 hover:text-sky-300 focus:outline-none"
              >
                Entre aqui
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;