/**
 * Products API Service
 * Comprehensive API for product management with validation
 */

import { supabase } from '@/lib/supabase/client';
import type { Product, ProductCategory } from '@/types';
import { validateProduct, sanitizeProduct } from '@/lib/validation/validators';

export interface ProductFilters {
  cooperativeId?: string;
  categoryId?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
}

export interface CreateProductData {
  cooperative_id: string;
  category_id?: string;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
  unit?: string;
  quantity_available?: number;
  harvest_date?: string;
  organic?: boolean;
  certifications?: string[];
  images?: string[];
  metadata?: Record<string, any>;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  is_active?: boolean;
}

/**
 * Get all products with optional filters
 */
export async function getProducts(filters?: ProductFilters): Promise<{
  data: Product[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    let query = supabase.from('products').select('*');

    if (filters?.cooperativeId) {
      query = query.eq('cooperative_id', filters.cooperativeId);
    }

    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    if (filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    } else {
      // Default to active products only
      query = query.eq('is_active', true);
    }

    if (filters?.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters?.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters?.searchQuery) {
      const searchTerm = filters.searchQuery.toLowerCase().trim();
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: (data || []) as Product[], error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<{
  data: Product | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: new Error('Product not found') };
    }

    return { data: data as Product, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Create a new product with validation
 */
export async function createProduct(productData: CreateProductData): Promise<{
  data: Product | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  // Validate product data
  const validation = validateProduct(productData);
  if (!validation.isValid) {
    return {
      data: null,
      error: new Error(`Validation failed: ${validation.errors.join(', ')}`),
    };
  }

  // Sanitize product data
  const sanitized = sanitizeProduct(productData);

  try {
    const { data, error } = await supabase
      .from('products')
      .insert({
        ...sanitized,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as Product, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Update an existing product with validation
 */
export async function updateProduct(
  id: string,
  updates: UpdateProductData
): Promise<{
  data: Product | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  // Validate updates if they include required fields
  if (updates.name || updates.cooperative_id) {
    const validation = validateProduct(updates);
    if (!validation.isValid) {
      return {
        data: null,
        error: new Error(`Validation failed: ${validation.errors.join(', ')}`),
      };
    }
  }

  // Sanitize updates
  const sanitized = sanitizeProduct(updates);

  try {
    const { data, error } = await supabase
      .from('products')
      .update(sanitized)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: new Error('Product not found') };
    }

    return { data: data as Product, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Delete a product (soft delete by setting is_active to false)
 */
export async function deleteProduct(id: string): Promise<{
  error: Error | null;
}> {
  if (!supabase) {
    return { error: new Error('Supabase not configured') };
  }

  try {
    const { error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { error };
  }
}

/**
 * Get all product categories
 */
export async function getProductCategories(): Promise<{
  data: ProductCategory[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching product categories:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: (data || []) as ProductCategory[], error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get products by cooperative
 */
export async function getProductsByCooperative(cooperativeId: string): Promise<{
  data: Product[] | null;
  error: Error | null;
}> {
  return getProducts({ cooperativeId, isActive: true });
}

