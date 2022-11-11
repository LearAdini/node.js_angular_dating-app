export interface Message {
    _id: number;
    senderId: number;
    senderUsername: string;
    senderPhotoUrl?: string;
    recipientId: number;
    recipientUsername: string;
    recipientPhotoUrl?: string;
    content: string;
    dateRead?: Date;
    createdAt: Date;
  }
  