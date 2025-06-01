import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      mobile, 
      password, 
      name, 
      picture,
      accountType,
      email,
      location,
      profession,
      company,
      website,
      bio,
      dateOfBirth,
      gender,
      language,
      emailNotifications,
      smsNotifications,
      marketingEmails
    } = body;

    // Validation
    if (!mobile || !password || !name) {
      return NextResponse.json(
        { error: 'Téléphone, mot de passe et nom sont requis' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
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

    // Validation pour les comptes business
    if (accountType === 'business' && !company) {
      return NextResponse.json(
        { error: 'Le nom de l\'entreprise est requis pour un compte professionnel' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { mobile }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec ce numéro existe déjà' },
        { status: 409 }
      );
    }

    // Vérifier si l'email est déjà utilisé
    if (email) {
      const existingEmailUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingEmailUser) {
        return NextResponse.json(
          { error: 'Cette adresse email est déjà utilisée' },
          { status: 409 }
        );
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Préparer les données utilisateur
    const userData: any = {
      mobile,
      password: hashedPassword,
      name,
      picture: picture || '',
      accountType: accountType || 'individual'
    };

    // Ajouter les champs optionnels s'ils sont fournis
    if (email) userData.email = email;
    if (location) userData.location = location;
    if (profession) userData.profession = profession;
    if (company) userData.company = company;
    if (website) userData.website = website;
    if (bio) userData.bio = bio;
    if (dateOfBirth) userData.dateOfBirth = new Date(dateOfBirth);
    if (gender) userData.gender = gender;
    if (language) userData.language = language;
    
    // Préférences de notification
    if (emailNotifications !== undefined) userData.emailNotifications = Boolean(emailNotifications);
    if (smsNotifications !== undefined) userData.smsNotifications = Boolean(smsNotifications);
    if (marketingEmails !== undefined) userData.marketingEmails = Boolean(marketingEmails);

    // Create user
    const user = await prisma.user.create({
      data: userData
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      mobile: user.mobile,
      name: user.name
    });

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
      message: 'Compte créé avec succès'
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création du compte' },
      { status: 500 }
    );
  }
} 