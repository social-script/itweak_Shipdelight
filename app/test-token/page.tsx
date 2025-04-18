'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestToken() {
  const [tokenData, setTokenData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateToken = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/shipdelight/test-token');
      
      if (!response.ok) {
        throw new Error('Failed to generate token');
      }
      
      const data = await response.json();
      setTokenData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-3xl shadow-md">
        <CardHeader>
          <CardTitle className="text-center">Shipdelight Token Test</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Button 
              onClick={generateToken} 
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {loading ? 'Generating...' : 'Generate Token'}
            </Button>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
              {error}
            </div>
          )}
          
          {tokenData && (
            <div className="mt-4 space-y-4">
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md">
                {tokenData.success ? 'Token generated successfully!' : 'Failed to generate token'}
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-3 font-medium border-b">Token Information</div>
                <div className="p-4 space-y-2">
                  <div>
                    <div className="font-medium">Access Token:</div>
                    <div className="bg-gray-50 p-2 rounded border mt-1 text-sm overflow-auto break-all">
                      {tokenData.data?.accessToken || 'N/A'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium">Refresh Token:</div>
                    <div className="bg-gray-50 p-2 rounded border mt-1 text-sm overflow-auto break-all">
                      {tokenData.data?.refreshToken || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="font-medium">Expires At:</div>
                      <div className="bg-gray-50 p-2 rounded border mt-1 text-sm">
                        {tokenData.data?.expiresAtReadable || 'N/A'}
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium">Generated At:</div>
                      <div className="bg-gray-50 p-2 rounded border mt-1 text-sm">
                        {tokenData.data?.generatedAt || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-3 font-medium border-b">Full Response</div>
                <pre className="p-4 text-xs overflow-auto bg-gray-50">
                  {JSON.stringify(tokenData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 