import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Upload API called');
    
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
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    console.log(`📁 Processing ${files.length} files`);

    const uploadedFiles = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue; // Skip non-image files
      }

      // Validate file size (4MB limit for server upload)
      if (file.size > 4 * 1024 * 1024) {
        return NextResponse.json(
          { error: `Fichier ${file.name} trop volumineux. Maximum 4MB.` },
          { status: 400 }
        );
      }

      try {
        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = file.name.split('.').pop() || 'jpg';
        const filename = `annonces/${timestamp}_${randomString}.${extension}`;

        // Upload to Vercel Blob
        const blob = await put(filename, file, {
          access: 'public',
        });

        uploadedFiles.push(blob.url);
        console.log(`✅ Uploaded to Blob: ${filename} -> ${blob.url}`);
      } catch (uploadError) {
        console.error(`❌ Error uploading ${file.name}:`, uploadError);
        return NextResponse.json(
          { error: `Erreur lors du téléchargement de ${file.name}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });

  } catch (error) {
    console.error('Error in upload:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors du téléchargement' },
      { status: 500 }
    );
  }
} 