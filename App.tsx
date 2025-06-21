import React, { useState, useEffect, useCallback } from 'react';
import { User, Service, AppPage, ChatMessage, ChatSession } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import ServiceList from './components/ServiceList';
import ContactUserPage from './components/ContactUserPage';
import ChatPage from './components/ChatPage';
import UserProfilePage from './components/UserProfilePage';
import HowItWorksPage from './components/HowItWorksPage'; 

// Helper para obter o estado inicial do localStorage ou retornar o padrão
const getInitialState = <T,>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      return JSON.parse(storedValue);
    }
  } catch (error) {
    console.error(`Erro ao ler a chave "${key}" do localStorage:`, error);
  }
  return defaultValue;
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppPage>(() => getInitialState<AppPage>('skillswap_currentPage', AppPage.Landing));
  const [users, setUsers] = useState<User[]>(() => getInitialState<User[]>('skillswap_users', []));
  const [services, setServices] = useState<Service[]>(() => getInitialState<Service[]>('skillswap_services', []));
  const [currentUser, setCurrentUser] = useState<User | null>(() => getInitialState<User | null>('skillswap_currentUser', null));

  // State for messaging
  const [contactTargetUser, setContactTargetUser] = useState<User | null>(null);
  const [contactTargetService, setContactTargetService] = useState<Service | null>(null);
  const [activeChatSessionId, setActiveChatSessionId] = useState<string | null>(() => getInitialState<string | null>('skillswap_activeChatSessionId', null));
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => getInitialState<ChatSession[]>('skillswap_chatSessions', []));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => getInitialState<ChatMessage[]>('skillswap_chatMessages', []));

  // State for user profile viewing
  const [viewingUserProfileId, setViewingUserProfileId] = useState<string | null>(() => getInitialState<string | null>('skillswap_viewingUserProfileId', null));
  
  // State for service filters
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>(() => getInitialState<string>('skillswap_selectedCategoryFilter', ''));
  const [searchTextFilter, setSearchTextFilter] = useState<string>(() => getInitialState<string>('skillswap_searchTextFilter', ''));
  const [professionSearchText, setProfessionSearchText] = useState<string>(() => getInitialState<string>('skillswap_professionSearchText', ''));
  const [citySearchText, setCitySearchText] = useState<string>(() => getInitialState<string>('skillswap_citySearchText', ''));


  // Persistir estado no localStorage
  useEffect(() => { localStorage.setItem('skillswap_currentPage', JSON.stringify(currentPage)); }, [currentPage]);
  useEffect(() => { localStorage.setItem('skillswap_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('skillswap_services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('skillswap_currentUser', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('skillswap_activeChatSessionId', JSON.stringify(activeChatSessionId)); }, [activeChatSessionId]);
  useEffect(() => { localStorage.setItem('skillswap_chatSessions', JSON.stringify(chatSessions)); }, [chatSessions]);
  useEffect(() => { localStorage.setItem('skillswap_chatMessages', JSON.stringify(chatMessages)); }, [chatMessages]);
  useEffect(() => { localStorage.setItem('skillswap_viewingUserProfileId', JSON.stringify(viewingUserProfileId)); }, [viewingUserProfileId]);
  useEffect(() => { localStorage.setItem('skillswap_selectedCategoryFilter', JSON.stringify(selectedCategoryFilter)); }, [selectedCategoryFilter]);
  useEffect(() => { localStorage.setItem('skillswap_searchTextFilter', JSON.stringify(searchTextFilter)); }, [searchTextFilter]);
  useEffect(() => { localStorage.setItem('skillswap_professionSearchText', JSON.stringify(professionSearchText)); }, [professionSearchText]);
  useEffect(() => { localStorage.setItem('skillswap_citySearchText', JSON.stringify(citySearchText)); }, [citySearchText]);


  const handleNavigateHome = useCallback(() => { 
    setCurrentPage(AppPage.Landing); 
    setSelectedCategoryFilter(''); 
    setSearchTextFilter('');
    setProfessionSearchText('');
    setCitySearchText('');
  }, []);
  const handleNavigateToRegistration = useCallback(() => { setCurrentPage(AppPage.Registration); }, []);
  const handleNavigateToLogin = useCallback(() => { setCurrentPage(AppPage.Login); }, []);
  const handleNavigateToHowItWorks = useCallback(() => { setCurrentPage(AppPage.HowItWorks); }, []);
  
  const handleNavigateToDashboard = useCallback(() => {
    if (currentUser) {
      setCurrentPage(AppPage.Dashboard);
    } else {
      setCurrentPage(AppPage.Login);
    }
  }, [currentUser]);

  const handleNavigateToUserProfile = useCallback((userId?: string) => {
    if (!currentUser) {
      setCurrentPage(AppPage.Login);
      return;
    }
    const targetUserId = userId || currentUser.id; 
    const userToView = users.find(u => u.id === targetUserId);
    if (userToView) {
      setViewingUserProfileId(targetUserId);
      setCurrentPage(AppPage.UserProfile);
    } else {
      console.warn("Usuário para perfil não encontrado:", targetUserId);
      handleNavigateToDashboard(); 
    }
  }, [currentUser, users, handleNavigateToDashboard]);


  const handleRegisterUser = useCallback((user: User, service: Service) => {
    if (users.find(u => u.email === user.email)) {
        alert("Este email já está cadastrado. Por favor, use um email diferente ou faça login.");
        return; 
    }
    setUsers(prevUsers => [...prevUsers, user]);
    setServices(prevServices => [...prevServices, service]);
    alert("Cadastro realizado com sucesso! Por favor, faça login para continuar.");
    setCurrentPage(AppPage.Login);
  }, [users]);

  const handleLogin = useCallback((email: string, password?: string): boolean => {
    const user = users.find(u => u.email === email);
    if (user && user.password === password) {
      setCurrentUser(user);
      setCurrentPage(AppPage.Dashboard);
      return true;
    }
    if (user && !user.password && !password) { 
        setCurrentUser(user);
        setCurrentPage(AppPage.Dashboard);
        return true;
    }
    return false;
  }, [users]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setActiveChatSessionId(null);
    setContactTargetUser(null);
    setContactTargetService(null);
    setViewingUserProfileId(null);
    setSelectedCategoryFilter(''); 
    setSearchTextFilter('');
    setProfessionSearchText('');
    setCitySearchText('');
    setCurrentPage(AppPage.Landing);
  }, []);
  
  const handleStartContact = useCallback((targetUserId: string, serviceId: string) => {
    if (!currentUser) {
      alert("Você precisa estar logado para contatar outros usuários.");
      setCurrentPage(AppPage.Login);
      return;
    }
    const userToContact = users.find(u => u.id === targetUserId);
    const serviceToContact = services.find(s => s.id === serviceId && s.userId === targetUserId);

    if (userToContact && serviceToContact) {
      setContactTargetUser(userToContact);
      setContactTargetService(serviceToContact);
      setCurrentPage(AppPage.ContactUser);
    } else {
      alert("Não foi possível encontrar o usuário ou serviço. Tente novamente.");
    }
  }, [currentUser, users, services]);

  const handleInitiateChatAndSendMessage = useCallback((receiverId: string, serviceId: string, messageText: string) => {
    if (!currentUser) return;

    const participantIds = [currentUser.id, receiverId].sort();
    const sessionId = participantIds.join('_');
    
    let session = chatSessions.find(s => s.id === sessionId);
    if (!session) {
      session = {
        id: sessionId,
        participantIds: participantIds,
        lastMessageTimestamp: Date.now(),
        serviceId: serviceId,
      };
      setChatSessions(prev => [...prev, session]);
    } else {
      session.lastMessageTimestamp = Date.now();
      setChatSessions(prev => prev.map(s => s.id === sessionId ? session! : s));
    }

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      chatSessionId: sessionId,
      senderId: currentUser.id,
      receiverId: receiverId,
      text: messageText,
      timestamp: Date.now(),
      read: false,
    };
    setChatMessages(prev => [...prev, newMessage]);
    setActiveChatSessionId(sessionId);
    setCurrentPage(AppPage.Chat);
  }, [currentUser, chatSessions, setChatMessages, setChatSessions]);

  const handleSendMessageToChat = useCallback((messageText?: string, audioPayload?: { dataUrl: string, type: string }) => {
    if (!currentUser || !activeChatSessionId) return;

    const session = chatSessions.find(s => s.id === activeChatSessionId);
    if (!session) return;

    const receiverId = session.participantIds.find(id => id !== currentUser.id);
    if (!receiverId) return;

    if (!messageText && !audioPayload) {
      console.warn("Tentativa de enviar mensagem vazia (sem texto ou áudio).");
      return;
    }

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      chatSessionId: activeChatSessionId,
      senderId: currentUser.id,
      receiverId: receiverId,
      timestamp: Date.now(),
      read: false,
      ...(messageText && { text: messageText }),
      ...(audioPayload && { audioDataUrl: audioPayload.dataUrl, audioType: audioPayload.type }),
    };
    setChatMessages(prev => [...prev, newMessage]);
    
    session.lastMessageTimestamp = Date.now();
    setChatSessions(prev => prev.map(s => s.id === activeChatSessionId ? session : s));

  }, [currentUser, activeChatSessionId, chatSessions, setChatMessages, setChatSessions]);

  const handleUpdateUserProfile = useCallback((userId: string, updatedUserDetails: Partial<User>, newImageBase64?: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, ...updatedUserDetails, ...(newImageBase64 && { userProfileImageUrl: newImageBase64 }) } : user
      )
    );

    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev =>
        prev ? { ...prev, ...updatedUserDetails, ...(newImageBase64 && { userProfileImageUrl: newImageBase64 }) } : null
      );
    }

    setServices(prevServices =>
      prevServices.map(service => {
        if (service.userId === userId) {
          const updatedService = { ...service };
          if (newImageBase64) {
            updatedService.userProfileImageUrl = newImageBase64;
          }
          if (updatedUserDetails.fullName) {
            updatedService.offeredByFullName = updatedUserDetails.fullName;
          }
          if (updatedUserDetails.profession) {
            updatedService.offeredByProfession = updatedUserDetails.profession;
          }
          return updatedService;
        }
        return service;
      })
    );
    alert("Perfil atualizado com sucesso!");
  }, [currentUser, setCurrentUser, setUsers, setServices]);

  const handleCategoryFilterChange = useCallback((category: string) => {
    setSelectedCategoryFilter(category);
  }, []);

  const handleSearchTextFilterChange = useCallback((text: string) => {
    setSearchTextFilter(text);
  }, []);

  const handleProfessionSearchChange = useCallback((text: string) => {
    setProfessionSearchText(text);
  }, []);

  const handleCitySearchChange = useCallback((text: string) => {
    setCitySearchText(text);
  }, []);


  useEffect(() => {
    if (!process.env.API_KEY) {
      console.warn(
        "App Troca de Serviços: A chave da API Gemini (process.env.API_KEY) não está configurada."
      );
    }
  }, []);

  useEffect(() => {
    const protectedPages: AppPage[] = [AppPage.Dashboard, AppPage.ContactUser, AppPage.Chat, AppPage.UserProfile];
    if (protectedPages.includes(currentPage) && !currentUser) {
      setContactTargetUser(null);
      setContactTargetService(null);
      setActiveChatSessionId(null);
      setViewingUserProfileId(null);
      setCurrentPage(AppPage.Login);
    }
    if ((currentPage === AppPage.Login || currentPage === AppPage.Registration || currentPage === AppPage.HowItWorks) && currentUser && currentPage !== AppPage.HowItWorks) { 
      if (currentPage !== AppPage.HowItWorks) setCurrentPage(AppPage.Dashboard);
    }
    
    if (currentPage === AppPage.Chat && activeChatSessionId && currentUser) {
      const hasUnreadInSession = chatMessages.some(
        msg => msg.chatSessionId === activeChatSessionId && msg.receiverId === currentUser.id && !msg.read
      );
      if (hasUnreadInSession) {
        setChatMessages(prevMessages =>
          prevMessages.map(msg =>
            (msg.chatSessionId === activeChatSessionId && msg.receiverId === currentUser!.id && !msg.read)
              ? { ...msg, read: true }
              : msg
          )
        );
      }
    }
  }, [currentPage, currentUser, activeChatSessionId, chatMessages, setChatMessages]);


  const unreadMessagesCount = currentUser
    ? chatMessages.filter(msg => msg.receiverId === currentUser.id && !msg.read).length
    : 0;

  const handleNavigateToRelevantChat = useCallback(() => {
    if (!currentUser) {
      setCurrentPage(AppPage.Login);
      return;
    }

    const unreadUserMessages = chatMessages
      .filter(msg => msg.receiverId === currentUser.id && !msg.read)
      .sort((a, b) => b.timestamp - a.timestamp);

    if (unreadUserMessages.length > 0) {
      setActiveChatSessionId(unreadUserMessages[0].chatSessionId);
      setCurrentPage(AppPage.Chat);
      return;
    }

    const userChatSessions = chatSessions
      .filter(session => session.participantIds.includes(currentUser.id))
      .sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);

    if (userChatSessions.length > 0) {
      setActiveChatSessionId(userChatSessions[0].id);
      setCurrentPage(AppPage.Chat);
    } else {
      alert("Você ainda não tem conversas.");
    }
  }, [currentUser, chatMessages, chatSessions, setActiveChatSessionId, setCurrentPage]);


  const renderPage = () => {
    switch (currentPage) {
      case AppPage.Landing:
        return <HeroSection 
                  onNavigateToRegistration={handleNavigateToRegistration} 
                  onNavigateToDashboard={handleNavigateToDashboard} 
                  onNavigateToLogin={handleNavigateToLogin}
                  onNavigateToHowItWorks={handleNavigateToHowItWorks} 
                />;
      case AppPage.Registration:
        return <RegistrationForm onRegister={handleRegisterUser} onNavigateToLogin={handleNavigateToLogin} />;
      case AppPage.Login:
        return <LoginForm onLogin={handleLogin} onNavigateToRegistration={handleNavigateToRegistration} />;
      case AppPage.Dashboard:
        if (!currentUser) return null; 
        
        let servicesToDisplay = services.filter(service => service.userId !== currentUser.id);
        
        if (selectedCategoryFilter) {
          servicesToDisplay = servicesToDisplay.filter(service => service.category === selectedCategoryFilter);
        }

        if (searchTextFilter) {
          const lowerSearchText = searchTextFilter.toLowerCase();
          servicesToDisplay = servicesToDisplay.filter(service =>
            service.serviceName.toLowerCase().includes(lowerSearchText) ||
            service.description.toLowerCase().includes(lowerSearchText) ||
            service.offeredByFullName.toLowerCase().includes(lowerSearchText) ||
            (service.category && service.category.toLowerCase().includes(lowerSearchText)) || 
            (service.offeredByProfession && service.offeredByProfession.toLowerCase().includes(lowerSearchText))
          );
        }
        
        if (professionSearchText) {
          const lowerProfessionSearch = professionSearchText.toLowerCase();
          servicesToDisplay = servicesToDisplay.filter(service =>
            service.offeredByProfession.toLowerCase().includes(lowerProfessionSearch)
          );
        }

        if (citySearchText) {
          const lowerCitySearch = citySearchText.toLowerCase();
          servicesToDisplay = servicesToDisplay.filter(service => {
            const offeringUser = users.find(u => u.id === service.userId);
            return offeringUser && offeringUser.city.toLowerCase().includes(lowerCitySearch);
          });
        }
        
        const allCategories = Array.from(new Set(services.filter(s => s.userId !== currentUser.id).map(s => s.category))).sort();

        return <ServiceList 
                  services={servicesToDisplay} 
                  onStartContact={handleStartContact} 
                  allCategories={allCategories}
                  selectedCategory={selectedCategoryFilter}
                  onCategoryChange={handleCategoryFilterChange}
                  searchText={searchTextFilter}
                  onSearchTextChange={handleSearchTextFilterChange}
                  professionSearchText={professionSearchText}
                  onProfessionSearchChange={handleProfessionSearchChange}
                  citySearchText={citySearchText}
                  onCitySearchChange={handleCitySearchChange}
                />;
      case AppPage.ContactUser:
        if (!currentUser || !contactTargetUser || !contactTargetService) {
           handleNavigateToDashboard();
           return <p className="text-center text-slate-300">Carregando dados do contato ou redirecionando...</p>;
        }
        return <ContactUserPage 
                    currentUser={currentUser} 
                    contactUser={contactTargetUser} 
                    contactService={contactTargetService}
                    onSendMessage={handleInitiateChatAndSendMessage}
                    onNavigateBack={handleNavigateToDashboard} 
                />;
      case AppPage.Chat:
        if (!currentUser || !activeChatSessionId) {
            handleNavigateToDashboard();
            return <p className="text-center text-slate-300">Carregando chat ou redirecionando...</p>;
        }
        const currentSession = chatSessions.find(s => s.id === activeChatSessionId);
        const messagesForCurrentChat = chatMessages.filter(msg => msg.chatSessionId === activeChatSessionId).sort((a,b) => a.timestamp - b.timestamp);
        
        const participantDetails: { [userId: string]: User } = {};
        currentSession?.participantIds.forEach(id => {
            const user = users.find(u => u.id === id);
            if (user) participantDetails[id] = user;
        });

        return <ChatPage 
                    currentUser={currentUser} 
                    chatSession={currentSession || null}
                    messages={messagesForCurrentChat}
                    participants={participantDetails}
                    onSendMessage={handleSendMessageToChat}
                    onNavigateBack={handleNavigateToDashboard}
                    onNavigateToUserProfile={handleNavigateToUserProfile}
                />;
      case AppPage.UserProfile:
        if (!currentUser || !viewingUserProfileId) {
            handleNavigateToDashboard(); 
            return <p className="text-center text-slate-300">Carregando perfil ou redirecionando...</p>;
        }
        const userToDisplay = users.find(u => u.id === viewingUserProfileId);
        if (!userToDisplay) {
            handleNavigateToDashboard(); 
            return <p className="text-center text-slate-300">Usuário não encontrado. Redirecionando...</p>;
        }
        return <UserProfilePage
                  userToDisplay={userToDisplay}
                  onUpdateProfile={(updatedDetails, newImageBase64) => handleUpdateUserProfile(userToDisplay.id, updatedDetails, newImageBase64)}
                  onNavigateBack={handleNavigateToDashboard}
                  isCurrentUserProfile={currentUser.id === userToDisplay.id}
               />;
      case AppPage.HowItWorks: 
        return <HowItWorksPage onNavigateBack={handleNavigateHome} />;
      default:
        return <HeroSection 
                  onNavigateToRegistration={handleNavigateToRegistration} 
                  onNavigateToDashboard={handleNavigateToDashboard} 
                  onNavigateToLogin={handleNavigateToLogin}
                  onNavigateToHowItWorks={handleNavigateToHowItWorks}
               />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Navbar 
        currentUser={currentUser}
        unreadMessagesCount={unreadMessagesCount}
        onNavigateHome={handleNavigateHome}
        onNavigateToLogin={handleNavigateToLogin}
        onNavigateToRegistration={handleNavigateToRegistration}
        onLogout={handleLogout}
        onNavigateToUserProfile={currentUser ? () => handleNavigateToUserProfile(currentUser.id) : undefined}
        onNavigateToChats={currentUser ? handleNavigateToRelevantChat : undefined}
      />
      <main className="flex-grow container mx-auto px-0 md:px-4 py-8">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;