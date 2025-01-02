export interface Chat {
  id: string;
  name: string;
}

export interface ChatsResponse {
  chats: Chat[];
}

// Interface for Room Details or Chat Members Endpoint
export interface ChatMember {
  id: string;
  name: string;
}

export interface RoomDetailsOrChatMembersResponse {
  members: ChatMember[];
}

// Interface for Get Messages Endpoint
export interface GetMessagesRequest {
  chatId: string;
  cursor?: string;
  limit?: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  createdAt: Date;
}

export interface PaginatedMessagesResponse {
  page: number;
  limit: number;
  nextCursor?: string;
  messages: Message[];
  totalMessages: number;
  totalPages: number;
}

// Interface for Create Room Endpoint
export interface CreateRoomRequest {
  name: string;
}

export interface CreateRoomResponse {
  success: boolean;
  message: string;
  roomId?: string;
}

// Interface for Join Room Endpoint
export interface JoinRoomResponse {
  success: boolean;
  message: string;
}

// Interface for Send Message Endpoint
export interface SendMessageRequest {
  message: string;
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
}

// Interface for Send Multimedia Endpoint
export interface SendMultimediaResponse {
  success: boolean;
  message: string;
}

// Interface for Delete Messages Endpoint
export interface DeleteMessagesResponse {
  success: boolean;
  message: string;
}
