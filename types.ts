export interface User {
  id: string;
  fullName: string;
  email: string; 
  password?: string; // Added password, optional for now to avoid breaking existing users if any. Will be required for new.
  address: string;
  city: string;
  profession: string;
  userProfileImageUrl?: string; // Optional user profile image URL
}

export interface Service {
  id: string;
  userId: string;
  serviceName: string;
  description: string;
  category: string; 
  offeredByFullName: string; // User's full name
  offeredByProfession: string; // User's profession
  userProfileImageUrl?: string; // Optional user profile image (associated with the service, often the provider's image)
}

export enum AppPage {
  Landing,
  Registration,
  Login, 
  Dashboard,
  ContactUser, // New page to initiate contact
  Chat,        // New page for conversations
  UserProfile, // New page for user profile
  HowItWorks,  // New page for how it works
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  // Other types of chunks could be defined here if needed
}

// New types for Chat functionality
export interface ChatMessage {
  id: string;
  chatSessionId: string;
  senderId: string;
  receiverId: string;
  text?: string; // Text is now optional
  timestamp: number;
  read: boolean; 
  audioDataUrl?: string; // Base64 encoded audio
  audioType?: string;    // e.g., 'audio/webm', 'audio/mp3'
}

export interface ChatSession {
  id: string; // Unique ID for the chat session (e.g., sorted_userId1_userId2)
  participantIds: string[]; // Array of two user IDs
  lastMessageTimestamp: number;
  serviceId?: string; // Optional: link chat to a specific service inquiry
}