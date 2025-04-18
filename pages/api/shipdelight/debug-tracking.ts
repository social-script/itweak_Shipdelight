import { NextApiRequest, NextApiResponse } from 'next';
import { queryTrackingApi } from '../../../lib/services/shipdelight-service';

/**
 * Debug endpoint for testing the tracking API with different parameters
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Support both GET and POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the payload from query parameters or request body
    let payload = {};
    
    if (req.method === 'GET') {
      const { filter_type, filter_value } = req.query;
      
      if (filter_type && filter_value) {
        payload = { filter_type, filter_value };
      }
    } else {
      // POST - get payload from body
      payload = req.body;
    }
    
    console.log('Debug tracking API call with payload:', payload);
    
    // Test predefined strategies if no payload provided
    if (!payload || Object.keys(payload).length === 0) {
      console.log('No payload provided, testing with predefined strategies');
      
      const strategies = [
        { name: 'Empty payload', payload: {} },
        { name: 'ordertype=REVERSE', payload: { filter_type: 'ordertype', filter_value: 'REVERSE' } },
        { name: 'status_code=R085', payload: { filter_type: 'status_code', filter_value: 'R085' } },
        { name: 'status_code=R087', payload: { filter_type: 'status_code', filter_value: 'R087' } },
        { name: 'status_code=R100', payload: { filter_type: 'status_code', filter_value: 'R100' } }
      ];
      
      const results = {};
      
      // Test each strategy
      for (const strategy of strategies) {
        console.log(`Testing strategy: ${strategy.name}`);
        
        try {
          const result = await queryTrackingApi(strategy.payload);
          
          // Store the result for this strategy
          results[strategy.name] = {
            success: result.success,
            trackingCount: result.tracking?.length || 0,
            error: result.error || null
          };
        } catch (error) {
          results[strategy.name] = {
            success: false,
            error: `${error}`
          };
        }
      }
      
      return res.status(200).json({
        success: true,
        message: 'Tested multiple tracking API strategies',
        results
      });
    }
    
    // Otherwise use the provided payload
    const result = await queryTrackingApi(payload);
    
    return res.status(200).json({
      success: true,
      message: 'Debug tracking API call completed',
      requestPayload: payload,
      apiResponse: result
    });
  } catch (error) {
    console.error('Error in debug-tracking API:', error);
    return res.status(500).json({
      success: false,
      error: `${error}`
    });
  }
} 