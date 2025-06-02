#!/bin/bash

echo "🔧 Starting build process..."

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

# En production Vercel - utiliser les migrations
if [ "$VERCEL" = "1" ]; then
  echo "🗄️ Deploying database migrations in production..."
  npx prisma migrate deploy
else
  # En développement local - utiliser db push pour les tests rapides
  echo "🔧 Development mode - syncing database schema..."
  npx prisma db push --skip-generate
fi

# Build Next.js application
echo "🏗️ Building Next.js application..."
npm run build

echo "✅ Build completed successfully!" 