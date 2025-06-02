# Guide de déploiement Vercel

## 1. Préparation

### Variables d'environnement à configurer sur Vercel :

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://pfapdbddlnkcunvffwoi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmYXBkYmRkbG5rY3VudmZmd29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NDg3NjEsImV4cCI6MjA2NDEyNDc2MX0.QFOD8Rdvv_dhLNDsBam0kQDdMg0hSaNz7_1_cIMH9wA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmYXBkYmRkbG5rY3VudmZmd29pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU0ODc2MSwiZXhwIjoyMDY0MTI0NzYxfQ.ZfXUl5ZTBvQv3eKenXf48AShrFen2ViTQ54PuJHeeho

# Database
DATABASE_URL=postgresql://postgres.pfapdbddlnkcunvffwoi:zZWM880es6qYsswt@aws-0-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.pfapdbddlnkcunvffwoi:zZWM880es6qYsswt@aws-0-eu-west-3.pooler.supabase.com:5432/postgres

# Site URL (sera mis à jour après déploiement)
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app

# JWT Secret
JWT_SECRET=m2sln+yn85jJGzQ4DBNmg94jl8ZgH3G4gC83G6I3nx+ZUpPkfr4meoWHR87qbCRzWVMKNsz7OF5KKbCR/goI3w==

# Vercel Blob (optionnel)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XmyoPNYrTxcyilsV_VHcOj2A3b6gHAYlButudPeHfzRJ73V
```

## 2. Configuration Supabase

### Mettre à jour les URLs autorisées dans Supabase :

1. Aller sur https://supabase.com/dashboard/project/pfapdbddlnkcunvffwoi
2. Settings > Authentication > URL Configuration
3. Ajouter votre domaine Vercel :
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/auth/callback`

## 3. Commandes de déploiement

```bash
# 1. Installer Vercel CLI (si pas déjà fait)
npm i -g vercel

# 2. Se connecter à Vercel
vercel login

# 3. Déployer
vercel --prod

# 4. Configurer les variables d'environnement
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add DATABASE_URL
vercel env add DIRECT_URL
vercel env add NEXT_PUBLIC_SITE_URL
vercel env add JWT_SECRET
vercel env add BLOB_READ_WRITE_TOKEN
```

## 4. Post-déploiement

1. Mettre à jour `NEXT_PUBLIC_SITE_URL` avec l'URL Vercel réelle
2. Mettre à jour la configuration OAuth dans Supabase
3. Tester l'authentification Google sur la production 