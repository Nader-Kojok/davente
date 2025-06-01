import { prisma } from './prisma';
import { supabase } from './supabase';

// Database service that combines Prisma and Supabase
export const db = {
  // Prisma ORM operations
  prisma,
  
  // Supabase client for auth and real-time
  supabase,
  
  // Helper functions for common operations
  async testConnection() {
    try {
      const userCount = await prisma.user.count();
      return { success: true, userCount };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },
  
  // User operations via Prisma
  user: {
    create: prisma.user.create,
    findUnique: prisma.user.findUnique,
    findMany: prisma.user.findMany,
    update: prisma.user.update,
    delete: prisma.user.delete,
  },
  
  // Annonce operations via Prisma
  annonce: {
    create: prisma.annonce.create,
    findUnique: prisma.annonce.findUnique,
    findMany: prisma.annonce.findMany,
    update: prisma.annonce.update,
    delete: prisma.annonce.delete,
  },
};

export type DbType = typeof db; 