/**
 * Orders API Service
 * Comprehensive API for order management with validation
 */

import { supabase } from '@/lib/supabase/client';
import type { Order, OrderItem } from '@/types';
import { validateOrder } from '@/lib/validation/validators';

export interface CreateOrderData {
  buyer_id: string;
  cooperative_id: string;
  total_amount: number;
  currency?: string;
  shipping_address?: string;
  notes?: string;
  items: Array<{
    product_id: string;
    quantity: number;
    unit_price: number;
  }>;
}

export interface UpdateOrderData {
  status?: Order['status'];
  shipping_address?: string;
  notes?: string;
}

/**
 * Get all orders with optional filters
 */
export async function getOrders(filters?: {
  buyerId?: string;
  cooperativeId?: string;
  status?: Order['status'];
}): Promise<{
  data: Order[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    let query = supabase.from('orders').select('*');

    if (filters?.buyerId) {
      query = query.eq('buyer_id', filters.buyerId);
    }

    if (filters?.cooperativeId) {
      query = query.eq('cooperative_id', filters.cooperativeId);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: (data || []) as Order[], error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get order by ID with items
 */
export async function getOrderById(id: string): Promise<{
  data: (Order & { items?: OrderItem[] }) | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    // Fetch order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (orderError) {
      console.error('Error fetching order:', orderError);
      return { data: null, error: new Error(orderError.message) };
    }

    if (!order) {
      return { data: null, error: new Error('Order not found') };
    }

    // Fetch order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', id);

    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
      // Return order without items if items fetch fails
      return { data: order as Order, error: null };
    }

    return {
      data: {
        ...(order as Order),
        items: (items || []) as OrderItem[],
      },
      error: null,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Create a new order with validation
 */
export async function createOrder(orderData: CreateOrderData): Promise<{
  data: (Order & { items?: OrderItem[] }) | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  // Validate order data
  const validation = validateOrder(orderData);
  if (!validation.isValid) {
    return {
      data: null,
      error: new Error(`Validation failed: ${validation.errors.join(', ')}`),
    };
  }

  // Validate items
  if (!orderData.items || orderData.items.length === 0) {
    return {
      data: null,
      error: new Error('Order must have at least one item'),
    };
  }

  // Calculate total amount from items if not provided
  const calculatedTotal = orderData.items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );

  if (orderData.total_amount !== calculatedTotal) {
    // Use calculated total if provided total doesn't match
    orderData.total_amount = calculatedTotal;
  }

  try {
    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_id: orderData.buyer_id,
        cooperative_id: orderData.cooperative_id,
        total_amount: orderData.total_amount,
        currency: orderData.currency || 'XOF',
        shipping_address: orderData.shipping_address,
        notes: orderData.notes,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return { data: null, error: new Error(orderError.message) };
    }

    // Create order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price,
    }));

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select();

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Order was created but items failed - this is a problem
      // We should probably delete the order or handle this better
      return {
        data: null,
        error: new Error(`Order created but items failed: ${itemsError.message}`),
      };
    }

    return {
      data: {
        ...(order as Order),
        items: (items || []) as OrderItem[],
      },
      error: null,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Update an existing order
 */
export async function updateOrder(
  id: string,
  updates: UpdateOrderData
): Promise<{
  data: Order | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const updateData: any = { ...updates };

    // Set completed_at if status is delivered
    if (updates.status === 'delivered') {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: new Error('Order not found') };
    }

    return { data: data as Order, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Cancel an order
 */
export async function cancelOrder(id: string): Promise<{
  data: Order | null;
  error: Error | null;
}> {
  return updateOrder(id, { status: 'cancelled' });
}

