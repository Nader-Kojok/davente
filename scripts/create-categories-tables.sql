-- Création des tables de catégories pour Davente
-- À exécuter dans Supabase SQL Editor

-- Table Category
CREATE TABLE IF NOT EXISTS "Category" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT UNIQUE NOT NULL,
    "slug" TEXT UNIQUE NOT NULL,
    "icon" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table Subcategory
CREATE TABLE IF NOT EXISTS "Subcategory" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT "Subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Subcategory_categoryId_slug_key" UNIQUE ("categoryId", "slug")
);

-- Ajouter les nouveaux champs à la table Annonce
ALTER TABLE "Annonce" ADD COLUMN IF NOT EXISTS "categoryId" INTEGER;
ALTER TABLE "Annonce" ADD COLUMN IF NOT EXISTS "subcategoryId" INTEGER;
ALTER TABLE "Annonce" ADD COLUMN IF NOT EXISTS "oldCategory" TEXT;
ALTER TABLE "Annonce" ADD COLUMN IF NOT EXISTS "oldSubcategory" TEXT;

-- Ajouter les contraintes de clés étrangères pour Annonce
ALTER TABLE "Annonce" ADD CONSTRAINT IF NOT EXISTS "Annonce_categoryId_fkey" 
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Annonce" ADD CONSTRAINT IF NOT EXISTS "Annonce_subcategoryId_fkey" 
    FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Sauvegarder les anciennes données de catégories
UPDATE "Annonce" SET "oldCategory" = "category" WHERE "category" IS NOT NULL;
UPDATE "Annonce" SET "oldSubcategory" = "subcategory" WHERE "subcategory" IS NOT NULL;

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS "Category_slug_idx" ON "Category"("slug");
CREATE INDEX IF NOT EXISTS "Category_isActive_idx" ON "Category"("isActive");
CREATE INDEX IF NOT EXISTS "Subcategory_categoryId_idx" ON "Subcategory"("categoryId");
CREATE INDEX IF NOT EXISTS "Subcategory_slug_idx" ON "Subcategory"("slug");
CREATE INDEX IF NOT EXISTS "Annonce_categoryId_idx" ON "Annonce"("categoryId");
CREATE INDEX IF NOT EXISTS "Annonce_subcategoryId_idx" ON "Annonce"("subcategoryId");

-- Fonction pour mettre à jour automatiquement updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour automatiquement updatedAt
DROP TRIGGER IF EXISTS update_category_updated_at ON "Category";
CREATE TRIGGER update_category_updated_at 
    BEFORE UPDATE ON "Category" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subcategory_updated_at ON "Subcategory";
CREATE TRIGGER update_subcategory_updated_at 
    BEFORE UPDATE ON "Subcategory" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 