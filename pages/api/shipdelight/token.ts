import { NextApiRequest, NextApiResponse } from 'next';
import { generateToken } from '../../../lib/services/shipdelight-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Generate token
    const tokenData = await generateToken();

    // Log token information for testing (remove in production)
    console.log('========== TOKEN INFORMATION FOR TESTING ==========');
    console.log('Access Token:', tokenData.accessToken);
    console.log('Refresh Token:', tokenData.refreshToken);
    console.log('Expires At:', new Date(tokenData.expiresAt * 1000).toLocaleString());
    console.log('====================================================');

    // Return token data (consider not returning refresh token to client)
    return res.status(200).json({
      success: true,
      accessToken: tokenData.accessToken,
      expiresAt: tokenData.expiresAt
    });
  } catch (error) {
    console.error('Error in token API:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate token'
    });
  }
} 