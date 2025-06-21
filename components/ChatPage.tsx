import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, User, ChatSession } from '../types';
import { PaperAirplaneIcon, ArrowLeftIcon, MicrophoneIcon, StopIcon } from './icons';

interface ChatPageProps {
  currentUser: User;
  chatSession: ChatSession | null;
  messages: ChatMessage[];
  participants: { [userId: string]: User }; // Map of userId to User details
  onSendMessage: (messageText?: string, audioPayload?: { dataUrl: string, type: string }) => void;
  onNavigateBack: () => void; // To go back to service list or chat list
  onNavigateToUserProfile: (userId: string) => void; // New prop
}

const ChatPage: React.FC<ChatPageProps> = ({ 
    currentUser, 
    chatSession, 
    messages, 
    participants, 
    onSendMessage, 
    onNavigateBack,
    onNavigateToUserProfile // New prop
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    // Cleanup MediaRecorder when component unmounts or recording stops unexpectedly
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  if (!chatSession) {
    return (
      <div className="text-center py-12 px-4 text-slate-300">
        <p>Sessão de chat não encontrada ou inválida.</p>
        <button
            onClick={onNavigateBack}
            className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 flex items-center mx-auto"
        >
            <ArrowLeftIcon className="mr-2" /> Voltar
        </button>
      </div>
    );
  }

  const otherParticipantId = chatSession.participantIds.find(id => id !== currentUser.id);
  const otherParticipant = otherParticipantId ? participants[otherParticipantId] : null;

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    if (isRecording) { // Prevent sending text while actively recording audio to avoid confusion
      alert("Por favor, pare a gravação de áudio antes de enviar uma mensagem de texto.");
      return;
    }
    onSendMessage(newMessage.trim());
    setNewMessage('');
  };

  const handleToggleRecording = async () => {
    setPermissionError(null);
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: audioChunksRef.current[0]?.type || 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Audio = reader.result as string;
            onSendMessage(undefined, { dataUrl: base64Audio, type: audioBlob.type });
          };
          reader.readAsDataURL(audioBlob);
          audioChunksRef.current = []; // Reset chunks
          // Clean up the stream tracks
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Erro ao acessar o microfone:", err);
        setPermissionError("Não foi possível acessar o microfone. Verifique as permissões.");
        setIsRecording(false);
      }
    }
  };


  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-180px)] md:h-[calc(100vh-200px)] flex flex-col bg-slate-800 shadow-xl rounded-lg border border-slate-700 overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 bg-slate-700/80 border-b border-slate-600 flex items-center space-x-3">
        <button
            onClick={onNavigateBack}
            className="p-1 rounded-full text-slate-300 hover:bg-slate-600 focus:outline-none"
            aria-label="Voltar"
        >
            <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <button
          onClick={() => {
            if (otherParticipant) {
              onNavigateToUserProfile(otherParticipant.id);
            }
          }}
          className="flex items-center space-x-3 rounded-lg p-1 hover:bg-slate-600/70 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-1 focus:ring-offset-slate-700/80 transition-colors"
          disabled={!otherParticipant}
          aria-label={otherParticipant ? `Ver perfil de ${otherParticipant.fullName}` : "Informações do usuário indisponíveis"}
        >
          {otherParticipant?.userProfileImageUrl && (
            <img 
              src={otherParticipant.userProfileImageUrl} 
              alt={otherParticipant.fullName} 
              className="w-10 h-10 rounded-full border-2 border-sky-400 object-cover"
            />
          )}
          {!otherParticipant?.userProfileImageUrl && otherParticipant && (
             <img 
              src={`https://ui-avatars.com/api/?name=${otherParticipant.fullName.replace(/\s/g,'+')}&background=random&color=fff&size=128`} 
              alt={otherParticipant.fullName} 
              className="w-10 h-10 rounded-full border-2 border-sky-400 object-cover"
            />
          )}
          <div>
              <h2 className="text-lg font-semibold text-white text-left">
              {otherParticipant ? otherParticipant.fullName : 'Usuário Desconhecido'}
              </h2>
              {otherParticipant && <p className="text-xs text-slate-400 text-left">{otherParticipant.profession}</p>}
          </div>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-grow p-4 space-y-4 overflow-y-auto custom-scrollbar bg-slate-800">
        {messages.map((msg) => {
          const isCurrentUserSender = msg.senderId === currentUser.id;
          const sender = participants[msg.senderId];
          return (
            <div key={msg.id} className={`flex ${isCurrentUserSender ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end max-w-xs md:max-w-md lg:max-w-lg ${isCurrentUserSender ? 'flex-row-reverse' : 'flex-row'}`}>
                {sender && !isCurrentUserSender && (
                    <img src={sender.userProfileImageUrl || `https://ui-avatars.com/api/?name=${sender.fullName.replace(/\s/g,'+')}&background=random&color=fff`} alt={sender.fullName} className="w-8 h-8 rounded-full mr-2 self-start border border-slate-600 object-cover"/>
                )}
                 {sender && isCurrentUserSender && (
                    <img src={sender.userProfileImageUrl || `https://ui-avatars.com/api/?name=${sender.fullName.replace(/\s/g,'+')}&background=random&color=fff`} alt={sender.fullName} className="w-8 h-8 rounded-full ml-2 self-start border border-slate-600 object-cover"/>
                )}
                <div
                  className={`px-4 py-2 rounded-xl shadow ${
                    isCurrentUserSender
                      ? 'bg-sky-500 text-white rounded-br-none'
                      : 'bg-slate-600 text-slate-100 rounded-bl-none'
                  }`}
                >
                  {msg.audioDataUrl && msg.audioType ? (
                    <audio controls src={msg.audioDataUrl} type={msg.audioType} className="max-w-full rounded-md shadow my-1 w-[200px] h-[40px] sm:w-[250px] sm:h-[45px]">
                      Seu navegador não suporta o elemento de áudio.
                    </audio>
                  ) : null}
                  {msg.text && <p className="text-sm break-words">{msg.text}</p>}
                  <p className={`text-xs mt-1 ${isCurrentUserSender ? 'text-sky-200' : 'text-slate-400'} text-right`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <div className="p-4 border-t border-slate-600 bg-slate-700/80">
        {permissionError && <p className="text-xs text-red-400 mb-2 text-center">{permissionError}</p>}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleToggleRecording}
            className={`p-2.5 rounded-full hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-700 transition-colors ${
              isRecording 
                ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500' 
                : 'bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-500'
            }`}
            aria-label={isRecording ? "Parar gravação" : "Gravar áudio"}
          >
            {isRecording ? <StopIcon className="h-5 w-5" /> : <MicrophoneIcon className="h-5 w-5" />}
          </button>
          <form onSubmit={handleTextSubmit} className="flex-grow flex items-center space-x-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleTextSubmit(e);
                  }
              }}
              placeholder={isRecording ? "Gravando áudio..." : "Digite sua mensagem..."}
              rows={1}
              disabled={isRecording}
              className="flex-grow p-2.5 bg-slate-600 border border-slate-500 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-sm text-white custom-scrollbar resize-none disabled:bg-slate-500 disabled:cursor-not-allowed"
              style={{ maxHeight: '100px', minHeight: '44px' }}
            />
            <button
              type="submit"
              disabled={isRecording || !newMessage.trim()}
              className="p-2.5 bg-sky-500 text-white rounded-full hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Enviar mensagem"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;