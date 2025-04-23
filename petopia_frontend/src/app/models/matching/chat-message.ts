export interface ChatMessage {
  id?: number;
  matchId: number;
  senderId: number;
  receiverId: number;
  sender: string;
  recipient: string;
  content: string;
  timestamp?: string;
  type: 'CHAT' | 'JOIN' | 'LEAVE' | 'REACTION' | 'CONNECTION';
  reactions?: { id: number; userId: number; reaction: string; timestamp: string }[];
  showReactionPicker?: boolean;

}