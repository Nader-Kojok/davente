-- Créer la table Bookmark si elle n'existe pas
CREATE TABLE IF NOT EXISTS "Bookmark" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "annonceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- Créer l'index unique pour éviter les doublons
CREATE UNIQUE INDEX IF NOT EXISTS "Bookmark_userId_annonceId_key" ON "Bookmark"("userId", "annonceId");

-- Ajouter les contraintes de clé étrangère si elles n'existent pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Bookmark_userId_fkey'
    ) THEN
        ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Bookmark_annonceId_fkey'
    ) THEN
        ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_annonceId_fkey" FOREIGN KEY ("annonceId") REFERENCES "Annonce"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$; 