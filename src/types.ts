export type MessageSource = 'cp' | 'customer' | 'admin' | 'system';

export enum RecipientEnum {
  'cp',
  'c',
  'admin',
  'system',
}

export interface Message {
  id: number;
  sourceEnum: MessageSource;
  recipientEnum: RecipientEnum;
  channel: string;
  message: string;
  customerId: number;
  cleanerId: number;
  messageDateTime: string;
}

export interface MessageResponse {
  messages: Message[];
  customerId: string;
  lastWeekMessageCount: number;
}

export interface Conversation {
  isActive: boolean;
  lastName: string;
  firstName: string;
  message: string;
  id: number;
  messageDateTime: string;
}
