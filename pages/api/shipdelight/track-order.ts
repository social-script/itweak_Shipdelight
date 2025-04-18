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

    // Return the tracking data
    return res.status(200).json({
      success: true,
      data: trackingData
    });
  } catch (error: any) {
    console.error('Error tracking order:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to track order'
    });
  }
} 