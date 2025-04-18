import { NextApiRequest, NextApiResponse } from 'next';

const SHIPDELIGHT_API_KEY = process.env.NEXT_PUBLIC_SHIPDELIGHT_API_KEY || '67c6c29e9b7f37bcc4692e0a';
const TOKEN_ENDPOINT = 'https://appapi.shipdelight.com/generate-token';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Try with query parameter but POST method
    console.log('Attempting token generation with query parameter and POST method...');
    
    const response1 = await fetch(`${TOKEN_ENDPOINT}?api_key=${SHIPDELIGHT_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response1.ok) {
      const data1 = await response1.json();
      console.log('Successfully generated token with query parameter approach');
      
      return res.status(200).json({
        success: true,
        message: 'Token generated successfully (query parameter approach)',
        data: {
          accessToken: data1.data.access_token,
          refreshToken: data1.data.refresh_token,
          expiresAt: data1.data.expires_at,
          expiresAtReadable: new Date(data1.data.expires_at * 1000).toLocaleString(),
          generatedAt: new Date().toLocaleString()
        },
        approach: 'query_parameter'
      });
    }
    
    console.log('First approach failed, status:', response1.status, response1.statusText);
    
    // If the first approach fails, try with body parameter
    console.log('Attempting token generation with body parameter and POST method...');
    
    const response2 = await fetch(`${TOKEN_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ api_key: SHIPDELIGHT_API_KEY })
    });
    
    if (response2.ok) {
      const data2 = await response2.json();
      console.log('Successfully generated token with body parameter approach');
      
      return res.status(200).json({
        success: true,
        message: 'Token generated successfully (body parameter approach)',
        data: {
          accessToken: data2.data.access_token,
          refreshToken: data2.data.refresh_token,
          expiresAt: data2.data.expires_at,
          expiresAtReadable: new Date(data2.data.expires_at * 1000).toLocaleString(),
          generatedAt: new Date().toLocaleString()
        },
        approach: 'body_parameter'
      });
    }
    
    console.log('Second approach failed, status:', response2.status, response2.statusText);
    
    // If both approaches fail, return error
    return res.status(500).json({
      success: false,
      error: 'Failed to generate token using both approaches',
      details: {
        queryParamApproach: {
          status: response1.status,
          statusText: response1.statusText
        },
        bodyParamApproach: {
          status: response2.status,
          statusText: response2.statusText
        }
      }
    });
    
  } catch (error) {
    console.error('Error in alternative test token API:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate token',
      errorDetails: error instanceof Error ? error.message : String(error)
    });
  }
} 