import { NextRequest, NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
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

    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname: string) => {
        // Generate a client token for the browser to upload the file
        // User is already authenticated at this point

        return {
          allowedContentTypes: [
            'image/jpeg', 
            'image/png', 
            'image/gif', 
            'image/webp',
            'image/svg+xml'
          ],
          maximumSizeInBytes: 50 * 1024 * 1024, // 50MB max for client uploads
          tokenPayload: JSON.stringify({
            userId: payload.userId,
            uploadType: 'user-upload'
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        console.log('Blob upload completed:', blob.url);
        
        try {
          const payload = tokenPayload ? JSON.parse(tokenPayload) : {};
          console.log('Upload completed for user:', payload.userId);
          
          // Here you could update your database with the new image URL
          // await prisma.user.update({
          //   where: { id: payload.userId },
          //   data: { picture: blob.url }
          // });
          
        } catch (error) {
          console.error('Error processing upload completion:', error);
          // Don't throw here as it would cause the upload to fail
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du token d\'upload' },
      { status: 500 }
    );
  }
} 