import { NextApiRequest, NextApiResponse } from 'next';
import { getValidToken } from '../../../lib/services/shipdelight-service';

interface TrackingHistoryItem {
  status: string;
  status_code: string;
  location: string;
  remarks: string;
  updated_at: string;
}

interface TrackingItem {
  airwaybilno: string;
  orderno: string;
  ordertype: string;
  latest_status_code: string;
  latest_status: string;
  exp_delivery?: string;
  tracking_history: TrackingHistoryItem[];
}

interface TrackingResponse {
  success: boolean;
  error: boolean;
  tracking: TrackingItem[];
}

interface ProcessedOrder {
  company: string;
  companyId: string;
  user: string;
  timeAgo: string;
  awb: string;
  orderNumber: string;
  source: string;
  destination: string;
  reason: string;
  status: string;
}

interface PaginatedResponse {
  orders: ProcessedOrder[];
  pagination: {
    total: number;
    total_pages: number;
    current_page: number;
    per_page: number;
  };
}

// After the imports and interfaces, add a constant for reverse status codes
// These codes come from the tracking API reference document

const REVERSE_STATUS_CODES = [
  'R001', 'R002', 'R003', 'R004', 'R011', 'R085', 'R086', 'R087', 'R088', 'R100', 'R1000',
  'R101', 'R102', 'R103', 'R104', 'R106', 'R107', 'R109', 'R1100', 'R1101', 'R1102',
  'R1103', 'R111', 'R112', 'R113', 'R114', 'R117', 'R118', 'R119', 'R120', 'R1200',
  'R1201', 'R1202', 'R1203', 'R1204', 'R1205', 'R1206', 'R1207', 'R1208', 'R121',
  'R122', 'R123', 'R124', 'R125', 'R126', 'R127', 'R128', 'R129', 'R130', 'R131',
  'R200', 'R201', 'R202', 'R203', 'R204', 'R205', 'R206', 'R300', 'R400', 'R600', 'R85'
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get query parameters with defaults
    const { 
      page = '1', 
      limit = '50',
      status = '',  // Optional status filter
      search = ''   // Optional search term for order number/customer
    } = req.query;

    // Get a valid token for Shipdelight API
    const token = await getValidToken();
    
    // Use the tracking API endpoint as specified in the documentation
    const endpointUrl = 'https://appapi.shipdelight.com/tracking';
    
    // Determine the initial filter strategy
    let initialFilterType = 'ordertype';
    let initialFilterValue = 'REVERSE';

    // If searching for a specific AWB or order number, use that instead
    if (search) {
      if (/^\d+$/.test(String(search))) {
        initialFilterType = 'airwaybilno';
        initialFilterValue = String(search);
      } else if (String(search).startsWith('#')) {
        initialFilterType = 'orderno';
        initialFilterValue = String(search);
      }
    }
    
    console.log('Initial tracking API parameters:', { 
      filterType: initialFilterType, 
      filterValue: initialFilterValue,
      statusFilter: status, 
      searchTerm: search 
    });

    // Define our API request strategies in order of attempt
    const requestStrategies = [
      // Strategy 1: Empty payload (sometimes API expects this for all records)
      { 
        name: 'empty payload',
        payload: {} 
      },
      
      // Strategy 2: Use the initial filter type/value determined above
      { 
        name: `${initialFilterType}=${initialFilterValue}`,
        payload: {
          filter_type: initialFilterType,
          filter_value: initialFilterValue
        }
      },
      
      // Strategy 3: Try filtering by a specific reverse status code (R085 = Reverse Initiated)
      {
        name: 'status_code=R085',
        payload: {
          filter_type: 'status_code',
          filter_value: 'R085'
        }
      },
      
      // Strategy 4: Try status code for Reverse Approved (R087)
      {
        name: 'status_code=R087',
        payload: {
          filter_type: 'status_code',
          filter_value: 'R087'
        }
      },
      
      // Strategy 5: Try Reverse Pickup Done (R100)
      {
        name: 'status_code=R100',
        payload: {
          filter_type: 'status_code',
          filter_value: 'R100'
        }
      },
      
      // Strategy 6: Try REVERSE order type specifically
      {
        name: 'ordertype=REVERSE',
        payload: {
          filter_type: 'ordertype',
          filter_value: 'REVERSE'
        }
      }
    ];
    
    // Try each strategy until one works
    let data: TrackingResponse | null = null;
    let successfulStrategy = '';
    
    for (const strategy of requestStrategies) {
      try {
        console.log(`Attempting to fetch orders with strategy: ${strategy.name}`);
        console.log('Request payload:', JSON.stringify(strategy.payload));
        
        // Add additional logging for token
        console.log('Using token (first 10 chars):', token.accessToken.substring(0, 10) + '...');
        
        const response = await fetch(endpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.accessToken}`
          },
          body: JSON.stringify(strategy.payload)
        });
        
        // Get the raw response text first for debugging
        const responseText = await response.text();
        console.log(`Response status: ${response.status} ${response.statusText}`);
        console.log(`Raw response: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);
        
        // Try to parse the response as JSON
        let responseData: TrackingResponse;
        try {
          responseData = JSON.parse(responseText) as TrackingResponse;
        } catch (parseError) {
          console.error('Failed to parse response as JSON:', parseError);
          continue; // Skip to next strategy
        }

        // Check if we got a successful response with tracking data
        if (responseData.success && responseData.tracking && responseData.tracking.length > 0) {
          data = responseData;
          successfulStrategy = strategy.name;
          console.log(`Success with strategy ${strategy.name}: found ${responseData.tracking.length} orders`);
          break; // Exit the loop, we have data
        } else {
          console.log(`Strategy ${strategy.name} returned no tracking data:`, JSON.stringify(responseData));
        }
      } catch (err) {
        console.error(`Error with strategy ${strategy.name}:`, err);
      }
    }
    
    // If we still don't have data after all strategies, report failure
    if (!data) {
      console.error('All API request strategies failed');
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch orders: All API strategies failed'
      });
    }
    
    console.log(`Processing orders from successful strategy: ${successfulStrategy}`);
    
    // Initialize tracking array 
    const tracking = data.tracking || [];
    
    // Filter tracking data if needed
    let filteredTracking = tracking;
    
    // Filter by status if specified
    if (status) {
      filteredTracking = filteredTracking.filter(
        item => item.latest_status.toUpperCase().includes(String(status).toUpperCase())
      );
    }
    
    // Additional filtering for customer name searches
    if (search && !/^\d+$/.test(String(search)) && !String(search).startsWith('#')) {
      filteredTracking = filteredTracking.filter(item => {
        return item.orderno.includes(String(search)) || 
               (item.tracking_history && 
                item.tracking_history.some(h => 
                  h.remarks && h.remarks.toLowerCase().includes(String(search).toLowerCase())
                ));
      });
    }
    
    // For generic searches, look for orders with reverse status codes
    if (initialFilterType === 'ordertype' && !search) {
      filteredTracking = filteredTracking.filter(item => {
        // Check if this is explicitly a REVERSE order
        if (item.ordertype === 'REVERSE') return true;
        
        // Check latest status code is in our list of reverse codes
        if (item.latest_status_code && REVERSE_STATUS_CODES.includes(item.latest_status_code)) return true;
        
        // Check if any status in history is a reverse code
        if (item.tracking_history && item.tracking_history.some(h => 
          h.status_code && REVERSE_STATUS_CODES.includes(h.status_code)
        )) return true;
        
        // Check for keywords in status or remarks
        const reverseKeywords = ['REVERSE', 'RETURN', 'EXCHANGE'];
        if (item.latest_status && reverseKeywords.some(kw => item.latest_status.toUpperCase().includes(kw))) return true;
        
        if (item.tracking_history && item.tracking_history.some(h => 
          (h.status && reverseKeywords.some(kw => h.status.toUpperCase().includes(kw))) ||
          (h.remarks && reverseKeywords.some(kw => h.remarks.toUpperCase().includes(kw)))
        )) return true;
        
        return false;
      });
    }
    
    // Paginate the filtered results
    const pageNum = parseInt(String(page), 10);
    const pageSize = parseInt(String(limit), 10);
    const startIndex = (pageNum - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTracking = filteredTracking.slice(startIndex, endIndex);
    
    // Format the data for our frontend
    const formattedOrders: ProcessedOrder[] = paginatedTracking.map(item => {
      // Extract source, destination and creation time from tracking history
      let source = '';
      let destination = '';
      let createdAt = '';
      
      if (item.tracking_history && item.tracking_history.length > 0) {
        // Sort by date to find first and last locations
        const sortedHistory = [...item.tracking_history].sort((a, b) => 
          new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
        );
        
        // First entry should have created time
        createdAt = sortedHistory[0].updated_at;
        
        // Try to find source and destination from the history
        const sourceEntry = sortedHistory.find(h => 
          h.status_code === '99' || 
          h.status.includes('PICKUP') || 
          h.status.includes('ORIGIN')
        );
        
        const destinationEntry = sortedHistory.find(h => 
          h.status_code === '501' || 
          h.status.includes('DELIVERED') || 
          h.status.includes('DESTINATION') ||
          h.status.includes('UNDELIVERED')
        );
        
        if (sourceEntry) {
          source = sourceEntry.location || '';
        }
        
        if (destinationEntry) {
          destination = destinationEntry.location || '';
        }
      }
      
      // Get a reason for the return if available
      const reasonEntry = item.tracking_history?.find(h => h.remarks && h.remarks.trim() !== '');
      const reason = reasonEntry?.remarks || 'Return';
      
      // Format the order for frontend display
      return {
        company: 'Customer', // Not available in tracking data
        companyId: item.orderno || '',
        user: item.orderno || '',
        timeAgo: formatTimeAgo(createdAt),
        awb: item.airwaybilno || '',
        orderNumber: item.orderno || '',
        source: source || 'Not specified',
        destination: destination || 'Not specified',
        reason,
        status: item.latest_status || 'Pending'
      };
    });
    
    // Create pagination information
    const pagination = {
      total: filteredTracking.length,
      total_pages: Math.ceil(filteredTracking.length / pageSize),
      current_page: pageNum,
      per_page: pageSize
    };
    
    // Return the formatted orders data with pagination info
    return res.status(200).json({
      success: true,
      data: {
        orders: formattedOrders,
        pagination
      }
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch orders'
    });
  }
}

// Helper function to format time ago
function formatTimeAgo(timestamp?: string): string {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`;
  } else if (diffDays === 1) {
    return 'a day ago';
  } else {
    return `${diffDays} days ago`;
  }
}