
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { ArrowLeftIcon, CameraIcon, UploadIcon, UserIcon as DefaultUserIcon, BriefcaseIcon, LoadingSpinnerIcon, EditIcon } from './icons';

interface UserProfilePageProps {
  userToDisplay: User;
  onUpdateProfile: (updatedUserDetails: Partial<User>, newImageBase64?: string) => void;
  onNavigateBack: () => void;
  isCurrentUserProfile: boolean;
}

const InputField: React.FC<{label: string, type?: string, value: string, onChange: (val: string) => void, placeholder?: string, required?: boolean, icon?: React.ReactNode, name?: string, disabled?: boolean, rows?: number}> = 
  ({label, type = "text", value, onChange, placeholder, required, icon, name, disabled, rows}) => (
  <div>
    <label htmlFor={name || label} className="block text-sm font-medium text-slate-300 mb-1">{label} {required && <span className="text-red-400">*</span>}</label>
    <div className="relative">
      {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
      {type === 'textarea' ? (
        <textarea
          id={name || label}
          name={name || label}
          rows={rows || 3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`block w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 bg-slate-600 border border-slate-500 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white disabled:bg-slate-700 disabled:text-slate-400 custom-scrollbar`}
        />
      ) : (
        <input
          type={type}
          id={name || label}
          name={name || label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`block w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 bg-slate-600 border border-slate-500 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white disabled:bg-slate-700 disabled:text-slate-400`}
        />
      )}
    </div>
  </div>
);


const InfoRowDisplay: React.FC<{ label: string, value: string | undefined, icon?: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-slate-400 flex items-center">
      {icon && <span className="mr-2 text-sky-400">{icon}</span>}
      {label}
    </dt>
    <dd className="mt-1 text-sm text-slate-200 sm:mt-0 sm:col-span-2">{value || '-'}</dd>
  </div>
);

const UserProfilePage: React.FC<UserProfilePageProps> = ({ 
  userToDisplay, 
  onUpdateProfile, 
  onNavigateBack,
  isCurrentUserProfile
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableUser, setEditableUser] = useState<Partial<User>>({ ...userToDisplay });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Base64 for preview
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Reset editableUser when userToDisplay changes (e.g., navigating between profiles)
    // or when exiting edit mode
    if (!isEditing) {
      setEditableUser({ ...userToDisplay });
      setPreviewImage(null); // Clear preview when not editing or user changes
      setSelectedFile(null);
      setError(null);
    }
  }, [userToDisplay, isEditing]);

  const handleInputChange = (field: keyof User, value: string) => {
    setEditableUser(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError("O arquivo é muito grande. O limite é 2MB.");
        setSelectedFile(null);
        setPreviewImage(null);
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        setError("Tipo de arquivo inválido. (JPEG, PNG, GIF, WebP).");
        setSelectedFile(null);
        setPreviewImage(null);
        return;
      }
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = async () => {
    if (!editableUser.fullName?.trim() || !editableUser.email?.trim() || !editableUser.profession?.trim()) {
      setError("Nome Completo, Email e Profissão são obrigatórios.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      onUpdateProfile(editableUser, previewImage || undefined); // Pass base64 image if exists
      setIsEditing(false); // Exit edit mode on successful save
      // Preview image will be cleared by useEffect reacting to isEditing
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      setError("Falha ao salvar o perfil. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // editableUser, previewImage, selectedFile, error will be reset by useEffect
  };
  
  const currentProfileImageSrc = previewImage || editableUser.userProfileImageUrl || `https://ui-avatars.com/api/?name=${(editableUser.fullName || userToDisplay.fullName).replace(/\s/g, '+')}&background=random&color=fff&size=128`;
  const displayUser = isEditing ? editableUser : userToDisplay;


  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={isEditing ? handleCancelEdit : onNavigateBack}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-sky-400 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
        >
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          {isEditing ? 'Cancelar Edição' : 'Voltar'}
        </button>
        {isCurrentUserProfile && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-sky-500 text-sm font-medium rounded-md text-sky-400 hover:bg-sky-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
          >
            <EditIcon className="mr-2 h-5 w-5" />
            Editar Perfil
          </button>
        )}
      </div>

      <div className="bg-slate-700/50 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden border border-slate-600">
        <div className="p-6">
          <div className="md:flex md:items-center md:space-x-6">
            <div className="relative mx-auto md:mx-0 mb-6 md:mb-0 w-32 h-32 md:w-40 md:h-40">
              <img
                src={currentProfileImageSrc}
                alt={displayUser.fullName}
                className="w-full h-full rounded-full object-cover border-4 border-sky-500 shadow-md"
              />
              {isCurrentUserProfile && isEditing && (
                <button
                  onClick={handleTriggerFileInput}
                  title="Alterar foto de perfil"
                  className="absolute bottom-1 right-1 bg-slate-600 hover:bg-sky-500 text-white p-2 rounded-full shadow-md transition-colors duration-150"
                  aria-label="Alterar foto de perfil"
                >
                  <CameraIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                 <InputField 
                    label="Nome Completo" 
                    name="fullNameProfile"
                    value={editableUser.fullName || ''} 
                    onChange={(val) => handleInputChange('fullName', val)} 
                    placeholder="Seu Nome Completo"
                    required
                    // No icon for direct h1 replacement for cleaner look
                />
              ) : (
                <h1 className="text-3xl font-bold text-white">{displayUser.fullName}</h1>
              )}
               {isEditing ? (
                 <InputField 
                    label="Profissão"
                    name="professionProfile" 
                    value={editableUser.profession || ''} 
                    onChange={(val) => handleInputChange('profession', val)} 
                    placeholder="Sua Profissão"
                    required
                />
              ) : (
                <p className="text-sky-400 text-lg">{displayUser.profession}</p>
              )}
               {isEditing ? (
                 <InputField 
                    label="Email"
                    name="emailProfile"
                    type="email" 
                    value={editableUser.email || ''} 
                    onChange={(val) => handleInputChange('email', val)} 
                    placeholder="seu@email.com"
                    required
                />
              ) : (
                <p className="text-sm text-slate-400 mt-1">{displayUser.email}</p>
              )}
            </div>
          </div>
          
          {isCurrentUserProfile && isEditing && (
             <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg, image/png, image/gif, image/webp"
                className="hidden"
              />
          )}
          {error && <p className="mt-4 text-sm text-red-400 text-center bg-red-900/30 p-2 rounded-md border border-red-500">{error}</p>}

        </div>

        <div className="border-t border-slate-600 px-6 py-5">
          {isEditing && isCurrentUserProfile ? (
            <div className="space-y-4">
              <InputField 
                label="Endereço (Rua, Nº)" 
                name="addressProfile"
                value={editableUser.address || ''} 
                onChange={(val) => handleInputChange('address', val)} 
                placeholder="Rua Principal, 123" 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>}
              />
              <InputField 
                label="Cidade" 
                name="cityProfile"
                value={editableUser.city || ''} 
                onChange={(val) => handleInputChange('city', val)} 
                placeholder="Sua Cidade" 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12M3 3v12m0-12h12M3 3L15 15" /></svg>}
              />
               {/* Password fields can be added here if needed, with proper security considerations */}
              <div className="mt-6 flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-3 sm:space-y-0">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-700 focus:ring-green-500 disabled:opacity-70"
                  >
                    {isLoading ? <LoadingSpinnerIcon className="mr-2" /> : <UploadIcon className="mr-2" />}
                    {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isLoading}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 border border-slate-500 text-sm font-medium rounded-md shadow-sm text-slate-300 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-700 focus:ring-slate-500 disabled:opacity-70"
                  >
                    Cancelar
                  </button>
              </div>
            </div>
          ) : (
            <dl className="divide-y divide-slate-600">
              <InfoRowDisplay label="Nome Completo" value={displayUser.fullName} icon={<DefaultUserIcon className="w-4 h-4"/>} />
              <InfoRowDisplay label="Email" value={displayUser.email} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>}/>
              <InfoRowDisplay label="Profissão" value={displayUser.profession} icon={<BriefcaseIcon className="w-4 h-4"/>}/>
              <InfoRowDisplay label="Endereço" value={displayUser.address} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>}/>
              <InfoRowDisplay label="Cidade" value={displayUser.city} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12M3 3v12m0-12h12M3 3L15 15" /></svg>}/>
            </dl>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
