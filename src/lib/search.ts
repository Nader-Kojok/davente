import { prisma } from '@/lib/prisma';
import { withPerformanceMonitoring, QueryCache, QueryOptimizations } from './performance';

// Interface pour les paramètres de recherche
export interface SearchParams {
  query?: string;
  category?: string;
  subcategory?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  userType?: 'individual' | 'business';
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'date_desc' | 'date_asc';
  page?: number;
  limit?: number;
}

// Interface pour les résultats de recherche
export interface SearchResult {
  listings: any[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Interface pour les suggestions
export interface SearchSuggestion {
  id: string;
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  type: 'listing' | 'category' | 'location';
}

// Mapping des catégories pour gérer les différentes variantes
function normalizeCategoryName(category: string): string[] {
  const categoryMappings: { [key: string]: string[] } = {
    'Électronique': ['Électronique', 'electronique', 'electronics', 'Electronique'],
    'Véhicules': ['Véhicules', 'vehicules', 'vehicles', 'Vehicules'],
    'Immobilier': ['Immobilier', 'immobilier', 'real-estate', 'real_estate'],
    'Mode': ['Mode', 'mode', 'fashion'],
    'Maison & Jardin': ['Maison & Jardin', 'maison-jardin', 'home', 'Maison et Jardin'],
    'Services': ['Services', 'services'],
    'Emploi': ['Emploi', 'emploi', 'jobs'],
    'Locations de vacances': ['Locations de vacances', 'locations-vacances', 'vacation'],
    'Famille': ['Famille', 'famille', 'family'],
    'Loisirs': ['Loisirs', 'loisirs', 'leisure'],
    'Matériel professionnel': ['Matériel professionnel', 'materiel-professionnel', 'professional'],
    'Autre': ['Autre', 'autre', 'other', 'Divers', 'divers']
  };

  // Rechercher la catégorie normalisée
  for (const [normalizedCategory, variants] of Object.entries(categoryMappings)) {
    if (variants.some(variant => variant.toLowerCase() === category.toLowerCase())) {
      return [normalizedCategory, ...variants];
    }
  }

  // Si aucune correspondance trouvée, retourner la catégorie originale
  return [category];
}

// Mapping des sous-catégories pour gérer les différentes variantes
function normalizeSubcategoryName(subcategory: string): string[] {
  const subcategoryMappings: { [key: string]: string[] } = {
    // Véhicules
    'Voitures': ['Voitures', 'voitures', 'cars'],
    'Motos': ['Motos', 'motos', 'motorcycles'],
    'Camions': ['Camions', 'camions', 'trucks'],
    'Bateaux': ['Bateaux', 'bateaux', 'boats'],
    'Caravaning': ['Caravaning', 'caravaning'],
    'Utilitaires': ['Utilitaires', 'utilitaires', 'utility'],
    'Nautisme': ['Nautisme', 'nautisme', 'nautical'],
    
    // Immobilier
    'Appartements': ['Appartements', 'appartements', 'apartments'],
    'Maisons': ['Maisons', 'maisons', 'houses'],
    'Terrains': ['Terrains', 'terrains', 'land'],
    'Locaux commerciaux': ['Locaux commerciaux', 'locaux-commerciaux', 'commercial'],
    'Colocations': ['Colocations', 'colocations', 'colocation'],
    'Bureaux & Commerces': ['Bureaux & Commerces', 'bureaux-commerces', 'offices'],
    
    // Électronique
    'Téléphones & Objets connectés': ['Téléphones & Objets connectés', 'telephones-objets-connectes', 'phones'],
    'Ordinateurs': ['Ordinateurs', 'ordinateurs', 'computers'],
    'Accessoires informatiques': ['Accessoires informatiques', 'accessoires-informatiques', 'accessories'],
    'Photo & vidéo': ['Photo & vidéo', 'photo-video'],
    
    // Mode
    'Vêtements': ['Vêtements', 'vetements', 'clothing'],
    'Chaussures': ['Chaussures', 'chaussures', 'shoes'],
    'Accessoires': ['Accessoires', 'accessoires', 'accessories'],
    'Montres & Bijoux': ['Montres & Bijoux', 'montres-bijoux', 'watches'],
    
    // Maison & Jardin
    'Ameublement': ['Ameublement', 'ameublement', 'furniture'],
    'Appareils électroménagers': ['Appareils électroménagers', 'electromenager', 'appliances'],
    'Décoration': ['Décoration', 'decoration'],
    'Plantes & jardin': ['Plantes & jardin', 'plantes-jardin', 'garden'],
    'Bricolage': ['Bricolage', 'bricolage', 'diy'],
    
    // Services
    'Services aux entreprises': ['Services aux entreprises', 'services-entreprises', 'business'],
    'Services à la personne': ['Services à la personne', 'services-personne', 'personal'],
    'Événements': ['Événements', 'evenements', 'events'],
    'Artisans & Musiciens': ['Artisans & Musiciens', 'artisans-musiciens', 'artisans'],
    'Baby-Sitting': ['Baby-Sitting', 'baby-sitting', 'babysitting'],
    'Cours particuliers': ['Cours particuliers', 'cours-particuliers', 'courses'],
    
    // Emploi
    'Offres d\'emploi': ['Offres d\'emploi', 'offres-emploi', 'job-offers'],
    'Formations professionnelles': ['Formations professionnelles', 'formations-professionnelles', 'training'],
    
    // Locations de vacances
    'Locations saisonnières': ['Locations saisonnières', 'locations-saisonnieres', 'seasonal'],
    'Ventes flash vacances': ['Ventes flash vacances', 'ventes-flash-vacances', 'flash-sales'],
    'Locations Europe': ['Locations Europe', 'locations-europe', 'europe'],
    
    // Famille
    'Équipement bébé': ['Équipement bébé', 'equipement-bebe', 'baby-equipment'],
    'Mobilier enfant': ['Mobilier enfant', 'mobilier-enfant', 'kids-furniture'],
    'Jouets': ['Jouets', 'jouets', 'toys'],
    
    // Loisirs
    'CD - Musique': ['CD - Musique', 'cd-musique', 'music'],
    'DVD - Films': ['DVD - Films', 'dvd-films', 'movies'],
    'Livres': ['Livres', 'livres', 'books'],
    'Jeux & Jouets': ['Jeux & Jouets', 'jeux-jouets', 'toys-games'],
    'Sport & Plein Air': ['Sport & Plein Air', 'sport-plein-air', 'sports'],
    
    // Matériel professionnel
    'Tracteurs': ['Tracteurs', 'tracteurs', 'tractors'],
    'BTP - Chantier': ['BTP - Chantier', 'btp-chantier', 'construction'],
    'Matériel agricole': ['Matériel agricole', 'materiel-agricole', 'agricultural'],
    'Équipements pros': ['Équipements pros', 'equipements-pros', 'pro-equipment'],
    
    // Autre
    'Divers': ['Divers', 'divers', 'misc'],
    'Non catégorisé': ['Non catégorisé', 'non-categorise', 'uncategorized']
  };

  // Rechercher la sous-catégorie normalisée
  for (const [normalizedSubcategory, variants] of Object.entries(subcategoryMappings)) {
    if (variants.some(variant => variant.toLowerCase() === subcategory.toLowerCase())) {
      return [normalizedSubcategory, ...variants];
    }
  }

  // Si aucune correspondance trouvée, retourner la sous-catégorie originale
  return [subcategory];
}

// Mapping des conditions pour gérer les différentes variantes
function normalizeConditionName(condition: string): string[] {
  const conditionMappings: { [key: string]: string[] } = {
    'Neuf': ['Neuf', 'neuf', 'new', 'nouveau', 'Nouveau'],
    'Excellent': ['Excellent', 'excellent', 'parfait', 'Parfait'],
    'Bon état': ['Bon état', 'bon-etat', 'good', 'bonne condition'],
    'État correct': ['État correct', 'etat-correct', 'fair', 'correct'],
    'À réparer': ['À réparer', 'a-reparer', 'poor', 'mauvais état']
  };

  // Rechercher la condition normalisée
  for (const [normalizedCondition, variants] of Object.entries(conditionMappings)) {
    if (variants.some(variant => variant.toLowerCase() === condition.toLowerCase())) {
      return [normalizedCondition, ...variants];
    }
  }

  // Si aucune correspondance trouvée, retourner la condition originale
  return [condition];
}

// Recherche avancée avec Prisma
export async function searchListings(params: SearchParams): Promise<SearchResult> {
  return withPerformanceMonitoring('searchListings', async () => {
    const {
      query = '',
      category,
      subcategory,
      location,
      minPrice,
      maxPrice,
      condition,
      userType,
      sortBy = 'relevance',
      page = 1,
      limit = QueryOptimizations.getOptimalPageSize(params) // Dynamic page size
    } = params;

    console.log('🔍 Recherche avec paramètres:', params);

    // Check cache for simple queries
    const cacheKey = QueryOptimizations.generateSearchCacheKey(params);
    if (QueryOptimizations.shouldCache(params)) {
      const cachedResult = QueryCache.get(cacheKey);
      if (cachedResult) {
        console.log('📦 Cache hit for search query');
        return cachedResult;
      }
    }

    // Build optimized where clause
    const whereClause: any = {
      status: 'active' // Always filter by active status first (indexed)
    };

    // Category filtering (use categoryId for better performance)
    if (category) {
      const categoryVariants = normalizeCategoryName(category);
      console.log(`📂 Recherche catégorie: "${category}" -> variantes: [${categoryVariants.join(', ')}]`);
      
      // Try to find category by slug first for exact match
      const categoryRecord = await withPerformanceMonitoring('findCategory', () =>
        prisma.category.findFirst({
          where: {
            OR: [
              { slug: category },
              { name: { in: categoryVariants } }
            ]
          },
          select: { id: true }
        })
      );

      if (categoryRecord) {
        whereClause.categoryId = categoryRecord.id;
      } else {
        // Fallback to string matching
        whereClause.category = { in: categoryVariants };
      }
    }

    // Subcategory filtering
    if (subcategory) {
      const subcategoryVariants = normalizeSubcategoryName(subcategory);
      console.log(`📁 Recherche sous-catégorie: "${subcategory}" -> variantes: [${subcategoryVariants.join(', ')}]`);
      
      const subcategoryRecord = await withPerformanceMonitoring('findSubcategory', () =>
        prisma.subcategory.findFirst({
          where: {
            OR: [
              { slug: subcategory },
              { name: { in: subcategoryVariants } }
            ]
          },
          select: { id: true }
        })
      );

      if (subcategoryRecord) {
        whereClause.subcategoryId = subcategoryRecord.id;
      } else {
        whereClause.subcategory = { in: subcategoryVariants };
      }
    }

    // Price range filtering (indexed)
    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.price = {};
      if (minPrice !== undefined) whereClause.price.gte = minPrice;
      if (maxPrice !== undefined) whereClause.price.lte = maxPrice;
      console.log(`💰 Filtre prix: ${minPrice || 'min'} - ${maxPrice || 'max'}`);
    }

    // Location filtering (indexed)
    if (location) {
      console.log(`📍 Recherche localisation: "${location}"`);
      whereClause.location = {
        contains: location
      };
    }

    // Text search optimization - use title index for better performance
    if (query.trim()) {
      console.log(`🔤 Recherche textuelle: "${query}"`);
      
      // Use comprehensive case-insensitive search
      const searchQuery = query.trim();
      
      // Generate comprehensive case variations
      const caseVariations = new Set([
        searchQuery, // Original
        searchQuery.toLowerCase(), // all lowercase
        searchQuery.toUpperCase(), // ALL UPPERCASE
        searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1).toLowerCase(), // First letter capitalized
      ]);
      
      // Add common brand name patterns for tech products
      const lowerQuery = searchQuery.toLowerCase();
      if (lowerQuery === 'iphone') {
        caseVariations.add('iPhone');
        caseVariations.add('IPhone');
      } else if (lowerQuery === 'macbook') {
        caseVariations.add('MacBook');
        caseVariations.add('Macbook');
      } else if (lowerQuery === 'ipad') {
        caseVariations.add('iPad');
        caseVariations.add('IPad');
      } else if (lowerQuery === 'airpods') {
        caseVariations.add('AirPods');
        caseVariations.add('Airpods');
      } else if (lowerQuery === 'samsung') {
        caseVariations.add('Samsung');
        caseVariations.add('SAMSUNG');
      }
      
      // Create search conditions for all variations
      const searchConditions = [];
      for (const variation of caseVariations) {
        searchConditions.push(
          { title: { contains: variation } },
          { description: { contains: variation } }
        );
      }
      
      whereClause.OR = searchConditions;
    }

    // Condition filtering (indexed)
    if (condition) {
      const conditionVariants = normalizeConditionName(condition);
      console.log(`🏷️ Recherche condition: "${condition}" -> variantes: [${conditionVariants.join(', ')}]`);
      
      whereClause.condition = {
        in: conditionVariants
      };
    }

    // User type filtering
    if (userType) {
      whereClause.user = {
        accountType: userType
      };
    }

    console.log('🔍 Clause WHERE finale:', JSON.stringify(whereClause, null, 2));

    // Optimized sorting configuration
    let orderBy: any = { createdAt: 'desc' }; // Default uses index
    let useRelevanceSort = false;
    
    switch (sortBy) {
      case 'price_asc':
        orderBy = [{ price: 'asc' }, { createdAt: 'desc' }]; // Secondary sort for consistency
        break;
      case 'price_desc':
        orderBy = [{ price: 'desc' }, { createdAt: 'desc' }];
        break;
      case 'date_asc':
        orderBy = { createdAt: 'asc' };
        break;
      case 'relevance':
        // For relevance with text search, we'll sort after fetching
        if (query.trim()) {
          useRelevanceSort = true;
          orderBy = { createdAt: 'desc' }; // Initial sort by date, then we'll re-sort by relevance
        } else {
          orderBy = { createdAt: 'desc' };
        }
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    try {
      // Execute optimized parallel queries
      const [rawListings, total] = await Promise.all([
        withPerformanceMonitoring('findManyListings', () =>
          prisma.annonce.findMany({
            where: whereClause,
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  picture: true,
                  mobile: true,
                  accountType: true
                }
              }
            },
            orderBy,
            skip: useRelevanceSort ? 0 : (page - 1) * limit, // Get more for relevance sorting
            take: useRelevanceSort ? Math.min(100, 100) : limit // Limit for performance
          })
        ),
        // Optimize count query - use same where clause but no includes
        withPerformanceMonitoring('countListings', () =>
          prisma.annonce.count({
            where: whereClause
          })
        )
      ]);

      // Apply relevance sorting if needed
      let listings = rawListings;
      if (useRelevanceSort && query.trim()) {
        const searchLower = query.trim().toLowerCase();
        
        listings = rawListings.sort((a: any, b: any) => {
          // Check if search term appears in title (higher priority)
          const aInTitle = a.title.toLowerCase().includes(searchLower);
          const bInTitle = b.title.toLowerCase().includes(searchLower);
          
          // Check if search term appears at the start of title (highest priority)
          const aStartsWithTerm = a.title.toLowerCase().startsWith(searchLower);
          const bStartsWithTerm = b.title.toLowerCase().startsWith(searchLower);
          
          // Priority 1: Title starts with search term
          if (aStartsWithTerm && !bStartsWithTerm) return -1;
          if (!aStartsWithTerm && bStartsWithTerm) return 1;
          
          // Priority 2: Title contains search term
          if (aInTitle && !bInTitle) return -1;
          if (!aInTitle && bInTitle) return 1;
          
          // Priority 3: If both have same relevance, sort by creation date (newest first)
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        // Apply pagination after sorting
        const startIndex = (page - 1) * limit;
        listings = listings.slice(startIndex, startIndex + limit);
      }

      console.log(`📊 Résultats trouvés: ${total} annonces (page ${page}/${Math.ceil(total / limit)})`);

      const totalPages = Math.ceil(total / limit);

      const result = {
        listings,
        total,
        page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      };

      // Cache simple queries
      if (QueryOptimizations.shouldCache(params)) {
        QueryCache.set(cacheKey, result, 300000); // 5 minutes
        console.log('📦 Cached search result');
      }

      return result;
    } catch (error) {
      console.error('❌ Erreur lors de la recherche:', error);
      throw error;
    }
  });
}

// Suggestions de recherche optimisées
export async function getSearchSuggestions(query: string, limit: number = 8): Promise<SearchSuggestion[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchTerm = query.trim();
  const suggestions: SearchSuggestion[] = [];

  try {
    // Create comprehensive case variations for better matching
    const caseVariations = new Set([
      searchTerm, // Original
      searchTerm.toLowerCase(), // all lowercase
      searchTerm.toUpperCase(), // ALL UPPERCASE
      searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1).toLowerCase(), // First letter capitalized
    ]);
    
    // Add common brand name patterns for tech products
    const lowerTerm = searchTerm.toLowerCase();
    if (lowerTerm === 'iphone') {
      caseVariations.add('iPhone');
      caseVariations.add('IPhone');
    } else if (lowerTerm === 'macbook') {
      caseVariations.add('MacBook');
      caseVariations.add('Macbook');
    } else if (lowerTerm === 'ipad') {
      caseVariations.add('iPad');
      caseVariations.add('IPad');
    } else if (lowerTerm === 'airpods') {
      caseVariations.add('AirPods');
      caseVariations.add('Airpods');
    } else if (lowerTerm === 'samsung') {
      caseVariations.add('Samsung');
      caseVariations.add('SAMSUNG');
    }
    
    // Create search conditions for all variations
    const searchConditions = [];
    for (const variation of caseVariations) {
      searchConditions.push(
        { title: { contains: variation } },
        { description: { contains: variation } }
      );
    }
    
    // Rechercher les annonces correspondantes
    const listings = await prisma.annonce.findMany({
      where: {
        AND: [
          { status: 'active' },
          {
            OR: searchConditions
          }
        ]
      },
      select: {
        id: true,
        title: true,
        price: true,
        location: true,
        picture: true,
        description: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: Math.min(limit * 3, 20) // Get more results to sort by relevance
    });

    // Sort by relevance: prioritize title matches over description matches
    const sortedListings = listings.sort((a, b) => {
      const searchLower = searchTerm.toLowerCase();
      
      // Check if search term appears in title (higher priority)
      const aInTitle = a.title.toLowerCase().includes(searchLower);
      const bInTitle = b.title.toLowerCase().includes(searchLower);
      
      // Check if search term appears at the start of title (highest priority)
      const aStartsWithTerm = a.title.toLowerCase().startsWith(searchLower);
      const bStartsWithTerm = b.title.toLowerCase().startsWith(searchLower);
      
      // Check for exact brand name matches
      const aExactMatch = caseVariations.has(a.title) || 
                         Array.from(caseVariations).some(variation => 
                           a.title.toLowerCase().includes(variation.toLowerCase())
                         );
      const bExactMatch = caseVariations.has(b.title) || 
                         Array.from(caseVariations).some(variation => 
                           b.title.toLowerCase().includes(variation.toLowerCase())
                         );
      
      // Priority 1: Exact brand matches
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;
      
      // Priority 2: Title starts with search term
      if (aStartsWithTerm && !bStartsWithTerm) return -1;
      if (!aStartsWithTerm && bStartsWithTerm) return 1;
      
      // Priority 3: Title contains search term
      if (aInTitle && !bInTitle) return -1;
      if (!aInTitle && bInTitle) return 1;
      
      // Priority 4: If both have same relevance, sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Take only the requested number of results
    const topListings = sortedListings.slice(0, Math.min(limit, 6));

    // Ajouter les suggestions d'annonces
    topListings.forEach(listing => {
      suggestions.push({
        id: listing.id.toString(),
        title: listing.title,
        price: listing.price,
        location: listing.location,
        imageUrl: listing.picture || '/images/placeholder.jpg',
        type: 'listing'
      });
    });

    // Ajouter des suggestions de catégories
    const categories = [
      'Véhicules', 'Immobilier', 'Électronique', 'Mode & Beauté',
      'Maison & Jardin', 'Loisirs & Sports', 'Emploi & Services',
      'Animaux', 'Enfants & Bébés', 'Alimentation'
    ];

    const matchingCategories = categories.filter(category =>
      category.toLowerCase().includes(searchTerm)
    );

    matchingCategories.slice(0, Math.max(0, limit - suggestions.length)).forEach(category => {
      suggestions.push({
        id: `category-${category.toLowerCase().replace(/\s+/g, '-')}`,
        title: category,
        price: 0,
        location: 'Catégorie',
        imageUrl: '/images/category-placeholder.jpg',
        type: 'category'
      });
    });

    // Ajouter des suggestions de lieux si nécessaire
    if (suggestions.length < limit) {
      const commonLocations = ['Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Diourbel'];
      const matchingLocations = commonLocations.filter(location =>
        location.toLowerCase().includes(searchTerm)
      );

      matchingLocations.slice(0, limit - suggestions.length).forEach(location => {
        suggestions.push({
          id: `location-${location.toLowerCase()}`,
          title: `Rechercher à ${location}`,
          price: 0,
          location: location,
          imageUrl: '/images/location-placeholder.jpg',
          type: 'location'
        });
      });
    }

    return suggestions.slice(0, limit);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des suggestions:', error);
    return [];
  }
}

// Recherche de titres pour l'autocomplétion
export async function getTitleSuggestions(query: string, limit: number = 5): Promise<string[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const searchQuery = query.trim();
    
    // Create comprehensive case variations for better matching
    const caseVariations = new Set([
      searchQuery, // Original
      searchQuery.toLowerCase(), // all lowercase
      searchQuery.toUpperCase(), // ALL UPPERCASE
      searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1).toLowerCase(), // First letter capitalized
    ]);
    
    // Add common brand name patterns for tech products
    const lowerQuery = searchQuery.toLowerCase();
    if (lowerQuery === 'iphone') {
      caseVariations.add('iPhone');
      caseVariations.add('IPhone');
    } else if (lowerQuery === 'macbook') {
      caseVariations.add('MacBook');
      caseVariations.add('Macbook');
    } else if (lowerQuery === 'ipad') {
      caseVariations.add('iPad');
      caseVariations.add('IPad');
    } else if (lowerQuery === 'airpods') {
      caseVariations.add('AirPods');
      caseVariations.add('Airpods');
    } else if (lowerQuery === 'samsung') {
      caseVariations.add('Samsung');
      caseVariations.add('SAMSUNG');
    }
    
    // Create search conditions for all variations
    const searchConditions = [];
    for (const variation of caseVariations) {
      searchConditions.push({ title: { contains: variation } });
    }
    
    const listings = await prisma.annonce.findMany({
      where: {
        AND: [
          { status: 'active' },
          {
            OR: searchConditions
          }
        ]
      },
      select: {
        title: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit * 2 // Prendre plus pour filtrer les doublons
    });

    // Supprimer les doublons et limiter
    const uniqueTitles = [...new Set(listings.map(l => l.title))];
    return uniqueTitles.slice(0, limit);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des titres:', error);
    return [];
  }
} 