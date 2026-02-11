/**
 * Search API Service
 * Comprehensive search and filtering functionality
 */

import { supabase } from '@/lib/supabase/client';
import type { Cooperative, Product } from '@/types';
import { searchCooperatives } from '@/features/cooperatives/api/cooperativesApi';
import { getProducts } from './productsApi';

export interface SearchFilters {
  query?: string;
  region?: string;
  department?: string;
  commodity?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isVerified?: boolean;
  certifications?: string[];
}

export interface SearchResults {
  cooperatives: Cooperative[];
  products: Product[];
  total: number;
}

/**
 * Global search across cooperatives and products
 */
export async function globalSearch(
  query: string,
  filters?: SearchFilters
): Promise<{
  data: SearchResults | null;
  error: Error | null;
}> {
  try {
    const searchTerm = query.trim();

    // Search cooperatives
    const { data: cooperatives, error: coopError } = await searchCooperatives(searchTerm);

    if (coopError) {
      console.error('Error searching cooperatives:', coopError);
    }

    // Search products
    const { data: products, error: productError } = await getProducts({
      searchQuery: searchTerm,
      categoryId: filters?.category,
      minPrice: filters?.minPrice,
      maxPrice: filters?.maxPrice,
    });

    if (productError) {
      console.error('Error searching products:', productError);
    }

    // Apply additional filters to cooperatives
    let filteredCooperatives = (cooperatives || []).filter((coop) => {
      if (filters?.region && coop.region !== filters.region) return false;
      if (filters?.department && coop.department !== filters.department) return false;
      if (filters?.commodity && coop.commodity !== filters.commodity) return false;
      if (filters?.isVerified !== undefined && coop.is_verified !== filters.isVerified) return false;
      if (filters?.certifications && filters.certifications.length > 0) {
        const hasCert = filters.certifications.some((cert) =>
          coop.certifications?.includes(cert)
        );
        if (!hasCert) return false;
      }
      return true;
    });

    return {
      data: {
        cooperatives: filteredCooperatives,
        products: products || [],
        total: filteredCooperatives.length + (products?.length || 0),
      },
      error: null,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Advanced search with multiple criteria
 */
export async function advancedSearch(filters: SearchFilters): Promise<{
  data: SearchResults | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    // Build cooperative query
    let coopQuery = supabase.from('cooperatives').select('*');

    if (filters.region) {
      coopQuery = coopQuery.eq('region', filters.region);
    }

    if (filters.department) {
      coopQuery = coopQuery.eq('department', filters.department);
    }

    if (filters.commodity) {
      coopQuery = coopQuery.eq('commodity', filters.commodity);
    }

    if (filters.isVerified !== undefined) {
      coopQuery = coopQuery.eq('is_verified', filters.isVerified);
    }

    if (filters.query) {
      const searchTerm = filters.query.toLowerCase().trim();
      coopQuery = coopQuery.or(
        `name.ilike.%${searchTerm}%,region.ilike.%${searchTerm}%,department.ilike.%${searchTerm}%`
      );
    }

    const { data: cooperatives, error: coopError } = await coopQuery;

    if (coopError) {
      console.error('Error in advanced search (cooperatives):', coopError);
    }

    // Build product query
    const { data: products, error: productError } = await getProducts({
      searchQuery: filters.query,
      categoryId: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    });

    if (productError) {
      console.error('Error in advanced search (products):', productError);
    }

    // Filter cooperatives by certifications if specified
    let filteredCooperatives = (cooperatives || []).filter((coop: any) => {
      if (filters.certifications && filters.certifications.length > 0) {
        const coopCerts = coop.certifications || [];
        const hasCert = filters.certifications.some((cert) => coopCerts.includes(cert));
        if (!hasCert) return false;
      }
      return true;
    });

    // Transform cooperatives to match frontend format
    const transformedCooperatives: Cooperative[] = (filteredCooperatives || []).map((coop: any) => ({
      ...coop,
      departement: coop.department,
      secteur: coop.sector,
      status: coop.is_verified ? ('verified' as const) : ('pending' as const),
      id: coop.id.toString(),
    }));

    return {
      data: {
        cooperatives: transformedCooperatives,
        products: products || [],
        total: transformedCooperatives.length + (products?.length || 0),
      },
      error: null,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get available filter options (regions, departments, commodities, etc.)
 */
export async function getFilterOptions(): Promise<{
  data: {
    regions: string[];
    departments: string[];
    commodities: string[];
    categories: string[];
  } | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    // Get unique regions
    const { data: regionsData } = await supabase
      .from('cooperatives')
      .select('region')
      .not('region', 'is', null);

    const regions = Array.from(
      new Set((regionsData || []).map((r: any) => r.region).filter(Boolean))
    ).sort() as string[];

    // Get unique departments
    const { data: departmentsData } = await supabase
      .from('cooperatives')
      .select('department')
      .not('department', 'is', null);

    const departments = Array.from(
      new Set((departmentsData || []).map((d: any) => d.department).filter(Boolean))
    ).sort() as string[];

    // Get unique commodities
    const { data: commoditiesData } = await supabase
      .from('cooperatives')
      .select('commodity')
      .not('commodity', 'is', null);

    const commodities = Array.from(
      new Set((commoditiesData || []).map((c: any) => c.commodity).filter(Boolean))
    ).sort() as string[];

    // Get product categories
    const { data: categoriesData } = await supabase
      .from('product_categories')
      .select('name')
      .order('name');

    const categories = (categoriesData || []).map((c: any) => c.name) as string[];

    return {
      data: {
        regions,
        departments,
        commodities,
        categories,
      },
      error: null,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

