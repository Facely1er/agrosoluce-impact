// API functions for products
// Connects frontend to Supabase database

import { supabase } from '@/lib/supabase/client';
import type { Product, ProductCategory } from '@/types';

/**
 * Fetch all active products
 */
export async function getProducts(cooperativeId?: string): Promise<{
  data: Product[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (cooperativeId) {
      query = query.eq('cooperative_id', cooperativeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return { data: null, error: new Error(error.message) };
    }

    // Transform database fields to match frontend expectations
    const transformed = (data || []).map((product: any) => ({
      ...product,
      // Map legacy fields
      product_name: product.name,
      price_per_unit: product.price,
      quantity_available: product.quantity_available || 0,
      id: product.id.toString(),
    })) as Product[];

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Fetch a single product by ID
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
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: new Error('Product not found') };
    }

    const transformed = {
      ...data,
      product_name: data.name,
      price_per_unit: data.price,
      quantity_available: data.quantity_available || 0,
      id: data.id.toString(),
    } as Product;

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Fetch products by category
 */
export async function getProductsByCategory(categoryId: string): Promise<{
  data: Product[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map((product: any) => ({
      ...product,
      product_name: product.name,
      price_per_unit: product.price,
      quantity_available: product.quantity_available || 0,
      id: product.id.toString(),
    })) as Product[];

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Fetch all product categories
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
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map((cat: any) => ({
      ...cat,
      id: cat.id.toString(),
    })) as ProductCategory[];

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Create a new product (requires authentication)
 */
export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<{
  data: Product | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    // Transform frontend fields to database fields
    const dbProduct = {
      cooperative_id: product.cooperative_id,
      category_id: product.category_id,
      name: product.name || product.product_name,
      description: product.description,
      price: product.price || product.price_per_unit,
      currency: product.currency || 'XOF',
      unit: product.unit,
      quantity_available: product.quantity_available,
      harvest_date: product.harvest_date,
      organic: product.organic,
      certifications: product.certifications,
      images: product.images,
      is_active: product.is_active !== false,
      metadata: product.metadata,
    };

    const { data, error } = await supabase
      .from('products')
      .insert(dbProduct)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = {
      ...data,
      product_name: data.name,
      price_per_unit: data.price,
      quantity_available: data.quantity_available || 0,
      id: data.id.toString(),
    } as Product;

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Update a product (requires authentication)
 */
export async function updateProduct(id: string, updates: Partial<Product>): Promise<{
  data: Product | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const dbUpdates: any = {};
    
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.product_name !== undefined) dbUpdates.name = updates.product_name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.price_per_unit !== undefined) dbUpdates.price = updates.price_per_unit;
    if (updates.currency !== undefined) dbUpdates.currency = updates.currency;
    if (updates.unit !== undefined) dbUpdates.unit = updates.unit;
    if (updates.quantity_available !== undefined) dbUpdates.quantity_available = updates.quantity_available;
    if (updates.harvest_date !== undefined) dbUpdates.harvest_date = updates.harvest_date;
    if (updates.organic !== undefined) dbUpdates.organic = updates.organic;
    if (updates.certifications !== undefined) dbUpdates.certifications = updates.certifications;
    if (updates.images !== undefined) dbUpdates.images = updates.images;
    if (updates.is_active !== undefined) dbUpdates.is_active = updates.is_active;
    if (updates.metadata !== undefined) dbUpdates.metadata = updates.metadata;

    const { data, error } = await supabase
      .from('products')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = {
      ...data,
      product_name: data.name,
      price_per_unit: data.price,
      quantity_available: data.quantity_available || 0,
      id: data.id.toString(),
    } as Product;

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

