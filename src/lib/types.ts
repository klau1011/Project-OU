// Type definitions for database models
// These mirror the Prisma schema and can be used as fallbacks

export interface Admission {
  id: string;
  School: string;
  Program: string;
  Average: number;
}

export interface Tip {
  id: string;
  title: string;
  content: string;
  userId: string;
  attachmentFileUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
