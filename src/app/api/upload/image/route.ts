import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Token invalide ou expiré' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    const type = formData.get('type') as string || 'general';

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Validation du fichier
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Le fichier doit être une image' },
        { status: 400 }
      );
    }

    // Reduce file size limit to respect Vercel's 4.5MB limit
    if (file.size > 4 * 1024 * 1024) { // 4MB max to stay under Vercel's 4.5MB limit
      return NextResponse.json(
        { error: 'L\'image ne doit pas dépasser 4MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop() || 'jpg';
    const fileName = `${type}_${payload.userId}_${timestamp}_${randomString}.${extension}`;

    try {
      // Upload to Vercel Blob instead of local filesystem
      const blob = await put(fileName, file, {
        access: 'public',
        addRandomSuffix: false, // We already added our own suffix
      });

      return NextResponse.json({
        url: blob.url,
        fileName: blob.pathname,
        size: file.size,
        type: file.type,
        message: 'Image téléchargée avec succès'
      });

    } catch (uploadError) {
      console.error('Blob upload error:', uploadError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'upload vers le stockage cloud' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload de l\'image' },
      { status: 500 }
    );
  }
} 