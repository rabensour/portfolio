/**
 * Email types and interfaces
 */

export type EmailProvider = 'gmail' | 'outlook';

export interface EmailAccount {
  id: string;
  provider: EmailProvider;
  email: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  createdAt: string;
  updatedAt: string;
}

export interface Email {
  id: string;
  threadId?: string;
  subject: string;
  from: EmailAddress;
  to: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  body: string;
  bodyHtml?: string;
  hasAttachment: boolean;
  attachments?: EmailAttachment[];
  receivedAt: string;
  isRead: boolean;
  labels?: string[];
  folders?: string[];
}

export interface EmailAddress {
  email: string;
  name?: string;
}

export interface EmailAttachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
}

export interface EmailFolder {
  id: string;
  name: string;
  type: 'inbox' | 'sent' | 'draft' | 'trash' | 'custom';
}

export interface EmailLabel {
  id: string;
  name: string;
  color?: string;
}

// DTOs for creating accounts
export interface CreateEmailAccountDTO {
  provider: EmailProvider;
  email: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface UpdateEmailAccountDTO {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}
