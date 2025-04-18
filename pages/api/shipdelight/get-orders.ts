import { NextApiRequest, NextApiResponse } from 'next';
import { getValidToken } from '../../../lib/services/shipdelight-service';

// API endpoint to fetch all orders or filter by type
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get query parameters
    const { orderType, days = '30', page = '1', limit = '50' } = req.query;

    // Get a valid token for Shipdelight API
    const token = await getValidToken();
    
    // Prepare the base URL for the orders API
    const ordersEndpoint = 'https://appapi.shipdelight.com/orders';
    
    // Create URL with query parameters
    const queryParams = new URLSearchParams({
      days: String(days),
      page: String(page),
      limit: String(limit)
    });
    
    // If orderType is specified, add it to the query parameters
    if (orderType) {
      queryParams.append('order_type', String(orderType));
    }
    
    // Construct the final URL
    const url = `${ordersEndpoint}?${queryParams.toString()}`;
    
    // Make the API request
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Return the orders data
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch orders'
    });
  }
} 