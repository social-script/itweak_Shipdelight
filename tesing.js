// Function to track shipment by AWB number
async function trackShipment(awbNumber = '77481168811') {
  try {
    // Step 1: Get the token using POST method as shown in shipdelight-service.ts
    const tokenResponse = await fetch('https://appapi.shipdelight.com/generate-token?api_key=67c6c29e9b7f37bcc4692e0a', {
      method: 'POST', // Changed from GET to POST based on working implementation
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token API error response:', errorText);
      throw new Error(`Failed to get authentication token: ${tokenResponse.status} ${tokenResponse.statusText}`);
    }
    
    const tokenData = await tokenResponse.json();
    console.log('Token API response:', JSON.stringify(tokenData, null, 2));
    
    // Extract access token from the response structure
    if (!tokenData.success || !tokenData.data || !tokenData.data.access_token) {
      throw new Error('Invalid token response format');
    }
    
    const token = tokenData.data.access_token;
    console.log('Token obtained successfully');
    
    // Step 2: Make the tracking request
    const trackingResponse = await fetch('https://appapi.shipdelight.com/tracking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        "filter_type": "airwaybilno",
        "filter_value": awbNumber
      })
    });
    
    if (!trackingResponse.ok) {
      const errorText = await trackingResponse.text();
      console.error('Tracking API error response:', errorText);
      throw new Error(`Failed to get tracking information: ${trackingResponse.status} ${trackingResponse.statusText}`);
    }
    
    const trackingData = await trackingResponse.json();
    console.log('Tracking data:', trackingData);
    return trackingData;
    
  } catch (error) {
    console.error('Error tracking shipment:', error);
    throw error;
  }
}

// Example usage
trackShipment('77481168811')
  .then(data => {
    // Process the tracking data
    console.log('Shipment tracking successful');
    // Display tracking information on the page
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(error => {
    console.error('Tracking request failed:', error.message);
  });
