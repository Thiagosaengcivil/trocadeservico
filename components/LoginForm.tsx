
import React, { useState } from 'react';
import { UserIcon } from './icons'; // Assuming UserIcon can be reused or a generic one

// Reusable InputField component (similar to RegistrationForm)
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


interface LoginFormProps {
  onLogin: (email: string, password?: string) => boolean; // Password optional for safety with existing data
  onNavigateToRegistration: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onNavigateToRegistration }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Por favor, preencha o email e a senha.");
      return;
    }
    const loggedIn = onLogin(email, password);
    if (!loggedIn) {
      setError("Email ou senha inválidos. Por favor, tente novamente.");
    }
    // Navigation to dashboard on successful login is handled by App.tsx
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-800">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
            <UserIcon className="h-16 w-16 text-sky-400" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-sky-400">
          Acesse sua Conta em Troca de Serviços
        </h2>
        <p className="mt-2 text-center text-sm text-slate-300">
          Bem-vindo de volta!
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-700/50 backdrop-blur-sm py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-slate-600">
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField 
              label="Endereço de Email"
              name="emailLogin"
              type="email" 
              value={email} 
              onChange={setEmail} 
              placeholder="voce@exemplo.com" 
              required 
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>}
            />
            <InputField 
              label="Senha" 
              name="passwordLogin"
              type="password" 
              value={password} 
              onChange={setPassword} 
              placeholder="Sua Senha" 
              required 
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>}
            />

            {error && (
              <p className="text-sm text-red-400 text-center bg-red-900/30 p-2 rounded-md border border-red-500">
                {error}
              </p>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition duration-150 ease-in-out transform hover:scale-105"
              >
                Entrar
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Não tem uma conta?{' '}
            <button
              onClick={onNavigateToRegistration}
              className="font-medium text-sky-400 hover:text-sky-300 focus:outline-none"
            >
              Cadastre-se aqui
            </button>
          </p>
          <p className="mt-2 text-center text-xs text-slate-500">
            (Esqueceu a senha? Funcionalidade em breve)
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
