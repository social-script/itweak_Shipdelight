/**
 * Shipdelight API Service
 * Handles authentication and API calls to Shipdelight
 */

// API key from environment variable or direct assignment
const SHIPDELIGHT_API_KEY = process.env.NEXT_PUBLIC_SHIPDELIGHT_API_KEY || '67c6c29e9b7f37bcc4692e0a';
const TOKEN_ENDPOINT = 'https://appapi.shipdelight.com/generate-token';
const BOOKING_ENDPOINT = 'https://appapi.shipdelight.com/booking';

// Interface for authentication response
interface ShipdelightAuthResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
  created_on: null | string;
}

// Interface for token storage
interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// Token storage (in memory for simplicity - consider more persistent storage for production)
let tokenData: TokenData | null = null;

/**
 * Generate a new token from Shipdelight API
 * @returns Promise with the token data
 */
export async function generateToken(): Promise<TokenData> {
  try {
    // Use POST with query parameter approach as confirmed working
    const response = await fetch(`${TOKEN_ENDPOINT}?api_key=${SHIPDELIGHT_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to generate token: ${response.status} ${response.statusText}`);
    }
    
    const data: ShipdelightAuthResponse = await response.json();
    
    if (!data.success) {
      throw new Error(`API error: ${data.message}`);
    }
    
    // Store token data
    tokenData = {
      accessToken: data.data.access_token,
      refreshToken: data.data.refresh_token,
      expiresAt: data.data.expires_at
    };
    
    console.log('Token generated successfully');
    return tokenData;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
}

/**
 * Get a valid token, generating a new one if needed
 * @returns Promise with valid token data
 */
export async function getValidToken(): Promise<TokenData> {
  // If we have no token or token is expired, generate a new one
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  
  if (!tokenData || tokenData.expiresAt <= now) {
    return generateToken();
  }
  
  return tokenData;
}

/**
 * Create a reverse pickup with QC enabled
 * @param formData The form data for creating a reverse pickup
 * @returns Promise with the booking response
 */
export async function createReversePickup(formData: any): Promise<any> {
  try {
    // Get a valid token
    const token = await getValidToken();
    
    // Convert payment type to acceptable format (PPD or COD)
    let paymentMethod = "PPD";
    if (formData.payType === "Prepaid") {
      paymentMethod = "PPD";
    } else if (formData.payType === "COD") {
      paymentMethod = "COD";
    }
    
    // Prepare the request payload
    const payload = {
      auto_approve: "false", // Manual review
      order_number: formData.returnOrderNo,
      service_type: "r", // Reverse
      invoice_number: formData.returnOrderNo,
      transaction_ref_no: formData.transactionId || formData.returnOrderNo,
      payment_method: paymentMethod, // PPD or COD
      discount_total: "0.00",
      cod_shipping_charge: "0.00",
      invoice_total: formData.invoiceValue,
      cod_total: paymentMethod === "COD" ? formData.invoiceValue : "0.0",
      length: formData.length,
      breadth: formData.breadth,
      height: formData.height,
      actual_weight: formData.weight,
      volumetric_weight: formData.volumetricWeight,
      qc: "y", // QC enabled for all orders
      
      // Delivery details (shipping)
      shipping: {
        first_name: formData.deliveryLocation,
        last_name: formData.customerLastName || "",
        address_1: formData.deliveryAddressLine1,
        address_2: formData.deliveryAddressLine2 || "",
        city: formData.deliveryCity,
        state: formData.deliveryState,
        postcode: formData.deliveryPincode,
        country: "India",
        phone: formData.deliveryContactNumber,
        cust_email: ""
      },
      
      // Line items
      line_items: [
        {
          name: formData.itemName || formData.itemDescription,
          quantity: formData.quantity,
          sku: formData.sku || "",
          product_id: formData.productId || "",
          variant_id: formData.variantId || "",
          unit_price: formData.unitPrice,
          actual_weight: formData.actualWeight || formData.weight,
          item_color: formData.itemColor || "",
          item_size: formData.itemSize || "",
          item_category: formData.itemCategory || "Electronics",
          item_image: formData.itemImage || "",
          item_brand: formData.itemBrand || "",
          item_imei: formData.itemImei || "",
          special_ins: formData.specialInstructions || "",
          return_reasons: formData.reasonForItem || "",
          item_tag: formData.hasOriginalTag === "none" ? "" : formData.hasOriginalTag || "",
          item_box: formData.hasOriginalBox === "none" ? "" : formData.hasOriginalBox || ""
        }
      ],
      
      // Pickup details
      pickup: {
        vendor_name: formData.customerName,
        address_1: formData.pickupAddressLine1,
        address_2: formData.pickupAddressLine2 || "",
        city: formData.pickupCity,
        state: formData.pickupState,
        postcode: formData.pickupPincode,
        country: "India",
        phone: formData.pickupContactNumber
      },
      
      // RTO details (using delivery as RTO)
      rto: {
        vendor_name: formData.vendorName,
        address_1: formData.deliveryAddressLine1,
        address_2: formData.deliveryAddressLine2 || "",
        city: formData.deliveryCity,
        state: formData.deliveryState,
        postcode: formData.deliveryPincode,
        country: "India",
        phone: formData.deliveryContactNumber
      },
      
      // GST details
      gst_details: {
        gst_number: formData.gstNumber || "",
        cgst: formData.cgstPercentage || "",
        igst: formData.igstPercentage || "",
        sgst: formData.sgstPercentage || "",
        hsn_number: formData.hsnNumber || "",
        ewaybill_number: formData.eWayBillNumber || ""
      }
    };
    
    // Log the request payload for debugging
    console.log('Shipdelight Request Payload:', JSON.stringify(payload, null, 2));
    
    // Make the API request
    const response = await fetch(BOOKING_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.accessToken}`
      },
      body: JSON.stringify(payload)
    });
    
    const responseData = await response.json();
    
    // Log the response for debugging
    console.log('Shipdelight Response:', JSON.stringify(responseData, null, 2));
    
    if (!response.ok) {
      throw new Error(`Failed to create reverse pickup: ${response.status} ${response.statusText}`);
    }
    
    return responseData;
  } catch (error) {
    console.error('Error creating reverse pickup:', error);
    throw error;
  }
}

/**
 * Track an order by airway bill number
 * @param awbNumber The airway bill number to track
 * @returns Promise with the tracking details
 */
export async function trackOrderByAwb(awbNumber: string): Promise<any> {
  try {
    // Get a valid token
    const token = await getValidToken();
    
    // Prepare the tracking request payload
    const payload = {
      filter_type: "airwaybilno",
      filter_value: awbNumber
    };
    
    // Make the API request
    const response = await fetch('https://appapi.shipdelight.com/tracking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.accessToken}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to track order: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error tracking order:', error);
    throw error;
  }
}

/**
 * Query the tracking API directly with a specific payload
 * @param payload The request payload
 * @returns Promise with the tracking response
 */
export async function queryTrackingApi(payload: any = {}): Promise<any> {
  try {
    // Get a valid token
    const token = await getValidToken();
    
    // Log the token and payload for debugging
    console.log('Using token (first 10 chars):', token.accessToken.substring(0, 10) + '...');
    console.log('Tracking API request payload:', JSON.stringify(payload));
    
    // Make the API request
    const response = await fetch('https://appapi.shipdelight.com/tracking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.accessToken}`
      },
      body: JSON.stringify(payload)
    });
    
    // Log the response status
    console.log(`Tracking API response status: ${response.status} ${response.statusText}`);
    
    // Get the response text
    const responseText = await response.text();
    console.log(`Raw response: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);
    
    // Try to parse as JSON
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse tracking API response as JSON:', parseError);
      return {
        success: false,
        error: 'Failed to parse API response',
        rawResponse: responseText
      };
    }
  } catch (error) {
    console.error('Error querying tracking API:', error);
    throw error;
  }
} 