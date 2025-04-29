export interface Notification {
  id: number | string;
  type: string;
  message: string;
  match?: any;
  matchId?: number;
  timestamp: Date;
  senderId?: number; 
  
}