export interface Notification {
    id: number | string ; // Match ID for pending, generated ID for accepted
    type: 'pending' | 'accepted'; // Notification type
    message: string; // Display message
    match?: any; // Match data for pending matches
    timestamp: Date; // Creation time
  }


  