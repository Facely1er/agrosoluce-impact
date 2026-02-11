// API functions for orders
// Connects frontend to Supabase database

import { supabase } from '@/lib/supabase/client';
import type { Order, OrderItem } from '@/types';

/**
 * Fetch all orders for a buyer
 */
export async function getBuyerOrders(buyerId: string): Promise<{
  data: Order[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map((order: any) => ({
      ...order,
      id: order.id.toString(),
    })) as Order[];

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Fetch all orders for a cooperative
 */
export async function getCooperativeOrders(cooperativeId: string): Promise<{
  data: Order[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('cooperative_id', cooperativeId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map((order: any) => ({
      ...order,
      id: order.id.toString(),
    })) as Order[];

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Fetch a single order by ID with items
 */
export async function getOrderById(orderId: string): Promise<{
  data: (Order & { items: OrderItem[] }) | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    // Fetch order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !orderData) {
      return { data: null, error: new Error(orderError?.message || 'Order not found') };
    }

    // Fetch order items
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) {
      return { data: null, error: new Error(itemsError.message) };
    }

    const order = {
      ...orderData,
      id: orderData.id.toString(),
      items: (itemsData || []).map((item: any) => ({
        ...item,
        id: item.id.toString(),
      })) as OrderItem[],
    } as Order & { items: OrderItem[] };

    return { data: order, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Create a new order (requires authentication)
 */
export async function createOrder(
  order: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'completed_at'>,
  items: Omit<OrderItem, 'id' | 'order_id' | 'created_at'>[]
): Promise<{
  data: (Order & { items: OrderItem[] }) | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    // Create order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_id: order.buyer_id,
        cooperative_id: order.cooperative_id,
        status: order.status || 'pending',
        total_amount: order.total_amount,
        currency: order.currency || 'XOF',
        shipping_address: order.shipping_address,
        notes: order.notes,
      })
      .select()
      .single();

    if (orderError || !orderData) {
      return { data: null, error: new Error(orderError?.message || 'Failed to create order') };
    }

    // Create order items
    const orderItems = items.map(item => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    }));

    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select();

    if (itemsError) {
      // Rollback order creation if items fail
      await supabase.from('orders').delete().eq('id', orderData.id);
      return { data: null, error: new Error(itemsError.message) };
    }

    const result = {
      ...orderData,
      id: orderData.id.toString(),
      items: (itemsData || []).map((item: any) => ({
        ...item,
        id: item.id.toString(),
      })) as OrderItem[],
    } as Order & { items: OrderItem[] };

    return { data: result, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Update order status (requires authentication)
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<{
  data: Order | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const updateData: any = { status };
    
    // Set completed_at if order is delivered
    if (status === 'delivered') {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = {
      ...data,
      id: data.id.toString(),
    } as Order;

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

