import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
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

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        annonces: {
          orderBy: { createdAt: 'desc' },
          take: 10 // Get last 10 listings
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      message: 'Profil récupéré avec succès'
    });

  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération du profil' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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

    const body = await request.json();
    const { 
      name, 
      mobile, 
      picture,
      email,
      bio,
      location,
      address,
      dateOfBirth,
      gender,
      profession,
      company,
      website,
      showPhone,
      showEmail,
      allowSms,
      allowCalls,
      emailNotifications,
      smsNotifications,
      pushNotifications,
      marketingEmails,
      language,
      timezone,
      isActive
    } = body;

    // Validation des champs requis seulement s'ils sont fournis
    if (name !== undefined && !name) {
      return NextResponse.json(
        { error: 'Le nom ne peut pas être vide' },
        { status: 400 }
      );
    }

    if (mobile !== undefined && !mobile) {
      return NextResponse.json(
        { error: 'Le numéro de téléphone ne peut pas être vide' },
        { status: 400 }
      );
    }

    // Validation de l'email si fourni
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Validation de l'URL du site web si fournie
    if (website && !/^https?:\/\/.+/.test(website)) {
      return NextResponse.json(
        { error: 'Format d\'URL invalide pour le site web' },
        { status: 400 }
      );
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email,
          id: { not: payload.userId }
        }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Cette adresse email est déjà utilisée' },
          { status: 400 }
        );
      }
    }

    // Vérifier si le mobile est déjà utilisé par un autre utilisateur
    const existingMobileUser = await prisma.user.findFirst({
      where: {
        mobile: mobile,
        id: { not: payload.userId }
      }
    });

    if (existingMobileUser) {
      return NextResponse.json(
        { error: 'Ce numéro de téléphone est déjà utilisé' },
        { status: 400 }
      );
    }

    // Préparer les données de mise à jour
    const updateData: any = {};

    // Ajouter les champs requis seulement s'ils sont fournis
    if (name !== undefined) updateData.name = name;
    if (mobile !== undefined) updateData.mobile = mobile;

    // Ajouter les champs optionnels s'ils sont fournis
    if (picture !== undefined) updateData.picture = picture;
    if (email !== undefined) updateData.email = email || null;
    if (bio !== undefined) updateData.bio = bio || null;
    if (location !== undefined) updateData.location = location || null;
    if (address !== undefined) updateData.address = address || null;
    if (dateOfBirth !== undefined) {
      updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    }
    if (gender !== undefined) updateData.gender = gender || null;
    if (profession !== undefined) updateData.profession = profession || null;
    if (company !== undefined) updateData.company = company || null;
    if (website !== undefined) updateData.website = website || null;
    
    // Préférences de contact
    if (showPhone !== undefined) updateData.showPhone = Boolean(showPhone);
    if (showEmail !== undefined) updateData.showEmail = Boolean(showEmail);
    if (allowSms !== undefined) updateData.allowSms = Boolean(allowSms);
    if (allowCalls !== undefined) updateData.allowCalls = Boolean(allowCalls);
    
    // Préférences de notification
    if (emailNotifications !== undefined) updateData.emailNotifications = Boolean(emailNotifications);
    if (smsNotifications !== undefined) updateData.smsNotifications = Boolean(smsNotifications);
    if (pushNotifications !== undefined) updateData.pushNotifications = Boolean(pushNotifications);
    if (marketingEmails !== undefined) updateData.marketingEmails = Boolean(marketingEmails);
    
    // Métadonnées
    if (language !== undefined) updateData.language = language || 'fr';
    if (timezone !== undefined) updateData.timezone = timezone || 'UTC';
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: updateData
    });

    // Retourner les données utilisateur mises à jour (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      user: userWithoutPassword,
      message: 'Profil mis à jour avec succès'
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour du profil' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { name, picture } = body;

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: 'Le nom est requis' },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        name,
        picture: picture || '',
        updatedAt: new Date()
      }
    });

    // Return updated user data (without password)
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      user: userWithoutPassword,
      message: 'Profil mis à jour avec succès'
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour du profil' },
      { status: 500 }
    );
  }
} 