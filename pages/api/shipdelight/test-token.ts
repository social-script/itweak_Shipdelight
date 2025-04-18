import { NextApiRequest, NextApiResponse } from 'next';
import { generateToken } from '../../../lib/services/shipdelight-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Generate token
    const tokenData = await generateToken();

    // Return complete token data for testing purposes
    return res.status(200).json({
      success: true,
      message: 'Token generated successfully',
      data: {
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        expiresAt: tokenData.expiresAt,
        expiresAtReadable: new Date(tokenData.expiresAt * 1000).toLocaleString(),
        generatedAt: new Date().toLocaleString()
      }
    });
  } catch (error) {
    console.error('Error in test token API:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate token',
      errorDetails: error instanceof Error ? error.message : String(error)
    });
  }
} 