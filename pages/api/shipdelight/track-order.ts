import { NextApiRequest, NextApiResponse } from 'next';
import { trackOrderByAwb } from '../../../lib/services/shipdelight-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get AWB number from request body
    const { awbNumber } = req.body;

    if (!awbNumber) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: awbNumber'
      });
    }

    // Log the tracking request
    console.log(`Tracking order with AWB: ${awbNumber}`);

    // Track the order
    const trackingData = await trackOrderByAwb(awbNumber);
    
    // Verify we have valid tracking data
    if (!trackingData.tracking || trackingData.tracking.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No tracking information found for this AWB'
      });
    }
    
    // Determine if this is a return order
    const isReturnOrder = trackingData.tracking[0]?.ordertype === 'REVERSE' || 
                          (trackingData.tracking[0]?.latest_status && 
                          trackingData.tracking[0].latest_status.toUpperCase().includes('REVERSE'));
    
    // Add additional information to the response
    const enhancedResponse = {
      success: true,
      data: trackingData,
      isReturnOrder,
      orderSummary: {
        awb: trackingData.tracking[0]?.airwaybilno,
        orderNumber: trackingData.tracking[0]?.orderno,
        orderType: trackingData.tracking[0]?.ordertype,
        currentStatus: trackingData.tracking[0]?.latest_status,
        statusCode: trackingData.tracking[0]?.latest_status_code,
        expectedDelivery: trackingData.tracking[0]?.exp_delivery || null,
        historyCount: trackingData.tracking[0]?.tracking_history?.length || 0
      }
    };

    // Return the enhanced tracking data
    return res.status(200).json(enhancedResponse);
  } catch (error: any) {
    console.error('Error tracking order:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to track order'
    });
  }
} 