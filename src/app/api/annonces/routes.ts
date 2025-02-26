// src/app/api/annonces/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Récupère la liste des annonces
export async function GET() {
  try {
    const annonces = await prisma.annonce.findMany({
      include: { user: true }, // si vous voulez inclure les infos de l'utilisateur
    });
    return NextResponse.json(annonces);
  } catch (err) {
    console.error('Error fetching annonces:', err);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des annonces' },
      { status: 500 }
    );
  }
}
