// Type definitions for database models
// These mirror the Prisma schema and can be used as fallbacks

export interface Admission {
  id: string;
  School: string;
  Program: string;
  Average: number;
  Decision?: string | null;
  OUACCode?: string | null;
  ApplicationDate?: string | null;
  DecisionDate?: string | null;
  Group?: string | null;  // "A" or "B" for OUAC groups
  Citizenship?: string | null;
  Province?: string | null;
  HasSuppApp?: boolean | null;
  SuppAppInfo?: string | null;
  Comments?: string | null;
  Scholarship?: number | null;
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
