import { NextApiRequest, NextApiResponse } from 'next';
import { createReversePickup } from '../../../lib/services/shipdelight-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get form data from request body
    const formData = req.body;

    // Log request data for testing (remove in production)
    console.log('========== REVERSE PICKUP REQUEST DATA ==========');
    console.log(JSON.stringify(formData, null, 2));
    console.log('================================================');

    // Validate required fields
    const requiredFields = [
      'returnOrderNo', 
      'invoiceValue', 
      'weight', 
      'length', 
      'breadth', 
      'height',
      'itemDescription',
      'quantity',
      'unitPrice',
      'customerName',
      'pickupContactNumber',
      'pickupPincode',
      'pickupAddressLine1',
      'pickupCity',
      'pickupState',
      'deliveryContactNumber',
      'deliveryPincode',
      'deliveryAddressLine1',
      'deliveryCity',
      'deliveryState'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        return res.status(400).json({
          success: false,
          error: `Missing required field: ${field}`
        });
      }
    }

    // Create reverse pickup with QC
    const response = await createReversePickup(formData);

    // Log response data for testing (remove in production)
    console.log('========== REVERSE PICKUP RESPONSE DATA ==========');
    console.log(JSON.stringify(response, null, 2));
    console.log('=================================================');

    // Return response
    return res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error in reverse pickup API:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create reverse pickup'
    });
  }
} 