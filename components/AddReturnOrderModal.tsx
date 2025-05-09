'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface AddReturnOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddReturnOrderModal({
  isOpen,
  onClose
}: AddReturnOrderModalProps) {
  // State for accordion sections
  const [openSections, setOpenSections] = useState({
    orderDetails: true,
    itemDetails: true,
    pickupDetails: false,
    deliveryDetails: false,
    gstDetails: false
  });

  // Loading states for pincode lookups
  const [isLoadingPickupLocation, setIsLoadingPickupLocation] = useState(false);
  const [isLoadingDeliveryLocation, setIsLoadingDeliveryLocation] = useState(false);

  // Toggle section
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Form data state
  const [formData, setFormData] = useState({
    // Order Details
    forwardAirwayBillNo: '',
    forwardOrderNo: '',
    returnOrderNo: '',
    transactionId: '',
    payType: 'Prepaid',
    invoiceValue: '',
    weight: '',
    volumetricWeight: '',
    length: '',
    breadth: '',
    height: '',
    
    // Item Details
    itemDescription: 'GO ALT TECHNOLOGY',
    sku: '',
    quantity: '',
    actualWeight: '',
    unitPrice: '',
    itemVolWeight: '',
    itemLength: '',
    itemBreadth: '',
    itemHeight: '',
    reasonForItem: '',
    
    // Pickup Details
    customerName: '',
    pickupContactNumber: '',
    pickupPincode: '',
    pickupAddressLine1: '',
    pickupAddressLine2: '',
    pickupCity: '',
    pickupState: '',
    
    // Delivery Details
    deliveryLocation: 'GO ALT TECHNOLOGIES',
    vendorName: 'GO ALT TECHNOLOGIES',
    customerLastName: '',
    deliveryContactNumber: '9741623600',
    deliveryPincode: '560037',
    deliveryAddressLine1: 'iTweak, 35/1B, CRM Sowbhagya Complex, Varthur Main Road, Marathalli,Near Spice Garden Bus Stop, Bangalore',
    deliveryAddressLine2: '',
    deliveryCity: 'BANGALORE',
    deliveryState: 'KARNATAKA',
    
    // GST Details
    gstNumber: '',
    hsnNumber: '',
    eWayBillNumber: '',
    cgstPercentage: '',
    sgstPercentage: '',
    igstPercentage: ''
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If the field is pickupPincode and it has 6 digits, fetch city and state
    if (name === 'pickupPincode' && value.length === 6) {
      fetchCityStateFromPincode(value, 'pickup');
    }
    
    // If the field is deliveryPincode and it has 6 digits, fetch city and state
    if (name === 'deliveryPincode' && value.length === 6) {
      fetchCityStateFromPincode(value, 'delivery');
    }
  };

  // Function to fetch city and state from pincode
  const fetchCityStateFromPincode = async (pincode: string, type: 'pickup' | 'delivery') => {
    try {
      // Set loading state based on type
      if (type === 'pickup') {
        setIsLoadingPickupLocation(true);
      } else {
        setIsLoadingDeliveryLocation(true);
      }
      
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      
      if (data && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        
        if (type === 'pickup') {
          setFormData(prev => ({
            ...prev,
            pickupCity: postOffice.District || postOffice.Name,
            pickupState: postOffice.State
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            deliveryCity: postOffice.District || postOffice.Name,
            deliveryState: postOffice.State
          }));
        }
      } else {
        // Handle invalid pincode
        console.log(`Invalid ${type} pincode or no data found`);
        
        // Optional: Reset city and state fields if pincode is invalid
        if (type === 'pickup') {
          setFormData(prev => ({
            ...prev,
            pickupCity: '',
            pickupState: ''
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            deliveryCity: '',
            deliveryState: ''
          }));
        }
      }
    } catch (error) {
      console.error(`Error fetching ${type} pincode data:`, error);
    } finally {
      // Reset loading state
      if (type === 'pickup') {
        setIsLoadingPickupLocation(false);
      } else {
        setIsLoadingDeliveryLocation(false);
      }
    }
  };

  // Calculate volumetric weight when dimensions change
  useEffect(() => {
    const { length, breadth, height } = formData;
    
    // Only calculate if all three dimensions are provided
    if (length && breadth && height) {
      const l = parseFloat(length);
      const b = parseFloat(breadth);
      const h = parseFloat(height);
      
      // Check if all values are valid numbers
      if (!isNaN(l) && !isNaN(b) && !isNaN(h)) {
        // Calculate volumetric weight: l * b * h / 5000
        const volumetricWeight = ((l * b * h) / 5000).toFixed(2);
        
        setFormData(prev => ({
          ...prev,
          volumetricWeight
        }));
      }
    }
  }, [formData.length, formData.breadth, formData.height]);

  // Calculate item volumetric weight when item dimensions change
  useEffect(() => {
    const { itemLength, itemBreadth, itemHeight } = formData;
    
    // Only calculate if all three dimensions are provided
    if (itemLength && itemBreadth && itemHeight) {
      const l = parseFloat(itemLength);
      const b = parseFloat(itemBreadth);
      const h = parseFloat(itemHeight);
      
      // Check if all values are valid numbers
      if (!isNaN(l) && !isNaN(b) && !isNaN(h)) {
        // Calculate volumetric weight: l * b * h / 5000
        const itemVolWeight = ((l * b * h) / 5000).toFixed(2);
        
        setFormData(prev => ({
          ...prev,
          itemVolWeight
        }));
      }
    }
  }, [formData.itemLength, formData.itemBreadth, formData.itemHeight]);

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // List of required fields
  const requiredFields = [
    // Order Details
    'returnOrderNo', 
    'invoiceValue', 
    'weight', 
    'length', 
    'breadth', 
    'height',
    // Item Details
    'itemDescription',
    'quantity',
    'unitPrice',
    'reasonForItem',
    // Pickup Details
    'customerName',
    'pickupContactNumber',
    'pickupPincode',
    'pickupAddressLine1',
    'pickupCity',
    'pickupState',
    // Delivery Details
    'deliveryContactNumber',
    'deliveryPincode',
    'deliveryAddressLine1',
    'deliveryCity',
    'deliveryState'
  ];

  // Numeric fields that need to be validated as valid numbers
  const numericFields = [
    'invoiceValue', 
    'weight', 
    'volumetricWeight', 
    'length', 
    'breadth', 
    'height',
    'quantity',
    'unitPrice',
    'pickupContactNumber',
    'pickupPincode',
    'deliveryContactNumber',
    'deliveryPincode'
  ];

  // Phone fields that need to be 10 digits
  const phoneFields = [
    'pickupContactNumber',
    'deliveryContactNumber'
  ];

  // Pincode fields that need to be 6 digits
  const pincodeFields = [
    'pickupPincode',
    'deliveryPincode'
  ];

  // Field labels for error messages
  const fieldLabels: Record<string, string> = {
    returnOrderNo: 'Return Order No.',
    invoiceValue: 'Invoice Value',
    weight: 'Weight',
    length: 'Length',
    breadth: 'Breadth',
    height: 'Height',
    itemDescription: 'Item Description',
    quantity: 'Quantity',
    unitPrice: 'Unit Price',
    reasonForItem: 'Reason for Item',
    customerName: 'Customer Name',
    pickupContactNumber: 'Pickup Contact Number',
    pickupPincode: 'Pickup Pincode',
    pickupAddressLine1: 'Pickup Address Line 1',
    pickupCity: 'Pickup City',
    pickupState: 'Pickup State',
    deliveryContactNumber: 'Delivery Contact Number',
    deliveryPincode: 'Delivery Pincode',
    deliveryAddressLine1: 'Delivery Address Line 1',
    deliveryCity: 'Delivery City',
    deliveryState: 'Delivery State',
    volumetricWeight: 'Volumetric Weight'
  };

  // Handle form submission
  const handleSubmit = async () => {
    console.log('Form submitted:', formData);
    
    // Check for required fields
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      // Get the first missing field to focus on that section
      const firstMissingField = missingFields[0];
      
      // Determine which section to open
      let sectionToOpen: keyof typeof openSections = 'orderDetails';
      
      if (['itemDescription', 'quantity', 'unitPrice'].includes(firstMissingField)) {
        sectionToOpen = 'itemDetails';
      } else if (['customerName', 'pickupContactNumber', 'pickupPincode', 'pickupAddressLine1', 'pickupCity', 'pickupState'].includes(firstMissingField)) {
        sectionToOpen = 'pickupDetails';
      } else if (['deliveryContactNumber', 'deliveryPincode', 'deliveryAddressLine1', 'deliveryCity', 'deliveryState'].includes(firstMissingField)) {
        sectionToOpen = 'deliveryDetails';
      }
      
      // Open the section that contains the first missing field
      setOpenSections(prev => ({
        ...prev,
        [sectionToOpen]: true
      }));
      
      // Show error toast with missing fields
      let errorMessage = 'Please fill in the following required fields:';
      missingFields.forEach(field => {
        errorMessage += `\n• ${fieldLabels[field] || field}`;
      });
      
      toast.error('Missing Required Fields', {
        description: errorMessage
      });
      
      // Focus on the first missing field if possible
      setTimeout(() => {
        const element = document.getElementById(firstMissingField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }, 100);
      
      return;
    }
    
    // Validate numeric fields
    const invalidNumericFields = numericFields
      .filter(field => {
        const value = formData[field as keyof typeof formData] as string;
        // Check if field has a value and is not a valid number
        return value && (isNaN(Number(value)) || Number(value) <= 0);
      });
    
    if (invalidNumericFields.length > 0) {
      // Get the first invalid field to focus on that section
      const firstInvalidField = invalidNumericFields[0];
      
      // Determine which section to open
      let sectionToOpen: keyof typeof openSections = 'orderDetails';
      
      if (['quantity', 'unitPrice'].includes(firstInvalidField)) {
        sectionToOpen = 'itemDetails';
      } else if (['pickupContactNumber', 'pickupPincode'].includes(firstInvalidField)) {
        sectionToOpen = 'pickupDetails';
      } else if (['deliveryContactNumber', 'deliveryPincode'].includes(firstInvalidField)) {
        sectionToOpen = 'deliveryDetails';
      }
      
      // Open the section that contains the first invalid field
      setOpenSections(prev => ({
        ...prev,
        [sectionToOpen]: true
      }));
      
      // Show error toast with invalid fields
      let errorMessage = 'Please enter valid numbers for the following fields:';
      invalidNumericFields.forEach(field => {
        errorMessage += `\n• ${fieldLabels[field] || field}`;
      });
      
      toast.error('Invalid Numeric Fields', {
        description: errorMessage
      });
      
      // Focus on the first invalid field if possible
      setTimeout(() => {
        const element = document.getElementById(firstInvalidField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }, 100);
      
      return;
    }
    
    // Validate phone numbers (10 digits)
    const invalidPhoneFields = phoneFields
      .filter(field => {
        const value = formData[field as keyof typeof formData] as string;
        // Phone number must be exactly 10 digits
        return value && !/^\d{10}$/.test(value);
      });
    
    if (invalidPhoneFields.length > 0) {
      // Get the first invalid field to focus on that section
      const firstInvalidField = invalidPhoneFields[0];
      
      // Determine which section to open
      let sectionToOpen: keyof typeof openSections = 'pickupDetails';
      
      if (firstInvalidField === 'deliveryContactNumber') {
        sectionToOpen = 'deliveryDetails';
      }
      
      // Open the section that contains the first invalid field
      setOpenSections(prev => ({
        ...prev,
        [sectionToOpen]: true
      }));
      
      // Show error toast with invalid fields
      let errorMessage = 'Please enter valid 10-digit phone numbers for:';
      invalidPhoneFields.forEach(field => {
        errorMessage += `\n• ${fieldLabels[field] || field}`;
      });
      
      toast.error('Invalid Phone Numbers', {
        description: errorMessage
      });
      
      // Focus on the first invalid field if possible
      setTimeout(() => {
        const element = document.getElementById(firstInvalidField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }, 100);
      
      return;
    }
    
    // Validate pincodes (6 digits)
    const invalidPincodeFields = pincodeFields
      .filter(field => {
        const value = formData[field as keyof typeof formData] as string;
        // Pincode must be exactly 6 digits
        return value && !/^\d{6}$/.test(value);
      });
    
    if (invalidPincodeFields.length > 0) {
      // Get the first invalid field to focus on that section
      const firstInvalidField = invalidPincodeFields[0];
      
      // Determine which section to open
      let sectionToOpen: keyof typeof openSections = 'pickupDetails';
      
      if (firstInvalidField === 'deliveryPincode') {
        sectionToOpen = 'deliveryDetails';
      }
      
      // Open the section that contains the first invalid field
      setOpenSections(prev => ({
        ...prev,
        [sectionToOpen]: true
      }));
      
      // Show error toast with invalid fields
      let errorMessage = 'Please enter valid 6-digit pincodes for:';
      invalidPincodeFields.forEach(field => {
        errorMessage += `\n• ${fieldLabels[field] || field}`;
      });
      
      toast.error('Invalid Pincodes', {
        description: errorMessage
      });
      
      // Focus on the first invalid field if possible
      setTimeout(() => {
        const element = document.getElementById(firstInvalidField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }, 100);
      
      return;
    }
    
    try {
      // Show loading toast
      const loadingToast = toast.loading('Creating reverse pickup...');
      
      // Log the payload to verify the return_reasons field is being sent correctly
      console.log('Submitting payload with line_items:', JSON.stringify({
        ...formData,
        line_items: [{
          name: formData.itemDescription,
          quantity: formData.quantity,
          sku: formData.sku || "",
          unit_price: formData.unitPrice,
          actual_weight: formData.actualWeight || formData.weight,
          return_reasons: formData.reasonForItem || ""
        }]
      }, null, 2));
      
      // Call the API to create reverse pickup
      const response = await fetch('/api/shipdelight/reverse-pickup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      if (result.success) {
        // Check if there are errors in the response even if success is true
        if (result.data && result.data.errors) {
          // Show error toast with specific error information
          const errorDetails = result.data.errors.map((err: any) => {
            if (err.loc && err.loc.length > 1) {
              return `${err.loc[1]}: ${err.msg}`;
            }
            return err.msg;
          }).join('\n');
          
          toast.error('Failed to create reverse pickup', {
            description: errorDetails || 'Please check your input data'
          });
          return;
        }
        
        // Get the AWB number from the response
        const awbNumber = result.data?.data?.response?.airwaybilno || 
                         result.data?.response?.airwaybilno || 
                         'Pending approval';
        
        // Show success toast
        toast.success('Reverse pickup created successfully!', {
          description: `AWB: ${awbNumber}`
        });
        
        // Close the modal
        onClose();
      } else {
        // Show error toast
        toast.error('Failed to create reverse pickup', {
          description: result.error || 'Please try again later'
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred', {
        description: 'Please check your connection and try again'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Add Return Order
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Details Section */}
          <div className="border rounded-lg overflow-hidden">
            <div 
              className={`flex justify-between items-center p-4 cursor-pointer ${openSections.orderDetails ? 'border-b' : ''} ${openSections.orderDetails ? 'text-red-500' : ''}`}
              onClick={() => toggleSection('orderDetails')}
            >
              <h3 className="font-medium">Order Details</h3>
              {openSections.orderDetails ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>

            {openSections.orderDetails && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="forwardAirwayBillNo">Forward AirwayBill No.</Label>
                    <Input 
                      id="forwardAirwayBillNo"
                      name="forwardAirwayBillNo"
                      placeholder="Enter Forward AirwayBill Number"
                      value={formData.forwardAirwayBillNo}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="forwardOrderNo">Forward Order No.</Label>
                    <Input 
                      id="forwardOrderNo"
                      name="forwardOrderNo"
                      placeholder="Enter Forward Order Number"
                      value={formData.forwardOrderNo}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="returnOrderNo">Return Order No. <span className="text-red-500">*</span></Label>
                    <Input 
                      id="returnOrderNo"
                      name="returnOrderNo"
                      placeholder="Enter Order Number"
                      value={formData.returnOrderNo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transactionId">Transaction Id</Label>
                    <Input 
                      id="transactionId"
                      name="transactionId"
                      placeholder="Enter Transaction Id"
                      value={formData.transactionId}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payType">Pay Type</Label>
                    <Select 
                      value={formData.payType} 
                      onValueChange={(value) => handleSelectChange('payType', value)}
                    >
                      <SelectTrigger id="payType">
                        <SelectValue placeholder="Select Pay Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Prepaid">Prepaid</SelectItem>
                        <SelectItem value="COD">COD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoiceValue">Invoice Value <span className="text-red-500">*</span></Label>
                    <Input 
                      id="invoiceValue"
                      name="invoiceValue"
                      placeholder="0"
                      value={formData.invoiceValue}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (KG) <span className="text-red-500">*</span></Label>
                    <Input 
                      id="weight"
                      name="weight"
                      placeholder="Weight (In KG)"
                      value={formData.weight}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="volumetricWeight">Volumetric Weight (KG) (l x b x h/5000) <span className="text-red-500">*</span></Label>
                    <Input 
                      id="volumetricWeight"
                      name="volumetricWeight"
                      placeholder="Volumetric Weight (In KG)"
                      value={formData.volumetricWeight}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="length">Length (CM) <span className="text-red-500">*</span></Label>
                    <Input 
                      id="length"
                      name="length"
                      placeholder="Length (In CM)"
                      value={formData.length}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="breadth">Breadth (CM) <span className="text-red-500">*</span></Label>
                    <Input 
                      id="breadth"
                      name="breadth"
                      placeholder="Breadth (In CM)"
                      value={formData.breadth}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (CM) <span className="text-red-500">*</span></Label>
                    <Input 
                      id="height"
                      name="height"
                      placeholder="Height (In CM)"
                      value={formData.height}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Item Details Section */}
          <div className="border rounded-lg overflow-hidden">
            <div 
              className={`flex justify-between items-center p-4 cursor-pointer ${openSections.itemDetails ? 'border-b' : ''} ${openSections.itemDetails ? 'text-red-500' : ''}`}
              onClick={() => toggleSection('itemDetails')}
            >
              <h3 className="font-medium">Item Details</h3>
              {openSections.itemDetails ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>

            {openSections.itemDetails && (
              <div className="p-4 space-y-4">
                <div className="bg-gray-50 p-3 border rounded-md mb-4">
                  <div className="font-medium">Original Item 1</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemDescription">Item Description <span className="text-red-500">*</span></Label>
                    <Select 
                      value={formData.itemDescription} 
                      onValueChange={(value) => handleSelectChange('itemDescription', value)}
                    >
                      <SelectTrigger id="itemDescription">
                        <SelectValue placeholder="Search Product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GO ALT TECHNOLOGY">GO ALT TECHNOLOGY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input 
                      id="sku"
                      name="sku"
                      placeholder="SKU"
                      value={formData.sku}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity <span className="text-red-500">*</span></Label>
                    <Input 
                      id="quantity"
                      name="quantity"
                      placeholder="Quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="actualWeight">Actual Weight (KG)</Label>
                    <Input 
                      id="actualWeight"
                      name="actualWeight"
                      placeholder="Actual Weight (In KG)"
                      value={formData.actualWeight}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unitPrice">Unit Price <span className="text-red-500">*</span></Label>
                    <Input 
                      id="unitPrice"
                      name="unitPrice"
                      placeholder="Unit Price (In INR)"
                      value={formData.unitPrice}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemVolWeight">Volumetric Weight (KG)</Label>
                    <Input 
                      id="itemVolWeight"
                      name="itemVolWeight"
                      placeholder="Volumetric Weight (In KG)"
                      value={formData.itemVolWeight}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemLength">Length (CM)</Label>
                    <Input 
                      id="itemLength"
                      name="itemLength"
                      placeholder="Length (In CM)"
                      value={formData.itemLength}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemBreadth">Breadth (CM)</Label>
                    <Input 
                      id="itemBreadth"
                      name="itemBreadth"
                      placeholder="Breadth (In CM)"
                      value={formData.itemBreadth}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemHeight">Height (CM)</Label>
                    <Input 
                      id="itemHeight"
                      name="itemHeight"
                      placeholder="Height (In CM)"
                      value={formData.itemHeight}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reasonForItem">Reason for Item <span className="text-red-500">*</span></Label>
                  <Select 
                    value={formData.reasonForItem} 
                    onValueChange={(value) => handleSelectChange('reasonForItem', value)}
                  >
                    <SelectTrigger id="reasonForItem">
                      <SelectValue placeholder="Select Reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Size and fit issue">Size and fit issue</SelectItem>
                      <SelectItem value="Product quality/comfort">Product Quality</SelectItem>
                      <SelectItem value="Replacement">Replacement</SelectItem>
                      <SelectItem value="Damaged product">Damaged product</SelectItem>
                      <SelectItem value="Wrong product received">Wrong product received</SelectItem>
                      <SelectItem value="Defective item">Defective item</SelectItem>
                      <SelectItem value="Changed mind">Changed mind</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    This reason will be sent to the courier service as the return reason.
                  </p>
                </div>

                <div className="pt-4">
                  <Button type="button" className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white">
                    <Plus className="h-4 w-4" /> Add More Items
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Pickup Details Section */}
          <div className="border rounded-lg overflow-hidden">
            <div 
              className={`flex justify-between items-center p-4 cursor-pointer ${openSections.pickupDetails ? 'border-b' : ''} ${openSections.pickupDetails ? 'text-red-500' : ''}`}
              onClick={() => toggleSection('pickupDetails')}
            >
              <h3 className="font-medium">Pickup Details</h3>
              {openSections.pickupDetails ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>

            {openSections.pickupDetails && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name <span className="text-red-500">*</span></Label>
                    <Input 
                      id="customerName"
                      name="customerName"
                      placeholder="Customer Name"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickupContactNumber">Contact Number <span className="text-red-500">*</span></Label>
                    <Input 
                      id="pickupContactNumber"
                      name="pickupContactNumber"
                      placeholder="Contact Number"
                      value={formData.pickupContactNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pickupPincode">Pickup Pincode <span className="text-red-500">*</span></Label>
                  <Input 
                    id="pickupPincode"
                    name="pickupPincode"
                    placeholder="Pickup Pincode"
                    value={formData.pickupPincode}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pickupAddressLine1">Pickup Address Line 1 <span className="text-red-500">*</span></Label>
                  <Input 
                    id="pickupAddressLine1"
                    name="pickupAddressLine1"
                    placeholder="Pickup Address Line 1"
                    value={formData.pickupAddressLine1}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pickupAddressLine2">Pickup Address Line 2</Label>
                  <Input 
                    id="pickupAddressLine2"
                    name="pickupAddressLine2"
                    placeholder="Pickup Address Line 2"
                    value={formData.pickupAddressLine2}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupCity">Pickup City <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input 
                        id="pickupCity"
                        name="pickupCity"
                        placeholder="Pickup City"
                        value={formData.pickupCity}
                        onChange={handleChange}
                        required
                      />
                      {isLoadingPickupLocation && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin h-4 w-4 border-2 border-orange-500 rounded-full border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickupState">Pickup State <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input 
                        id="pickupState"
                        name="pickupState"
                        placeholder="Pickup State"
                        value={formData.pickupState}
                        onChange={handleChange}
                        required
                      />
                      {isLoadingPickupLocation && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin h-4 w-4 border-2 border-orange-500 rounded-full border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Delivery Details Section */}
          <div className="border rounded-lg overflow-hidden">
            <div 
              className={`flex justify-between items-center p-4 cursor-pointer ${openSections.deliveryDetails ? 'border-b' : ''} ${openSections.deliveryDetails ? 'text-red-500' : ''}`}
              onClick={() => toggleSection('deliveryDetails')}
            >
              <h3 className="font-medium">Delivery Details</h3>
              {openSections.deliveryDetails ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>

            {openSections.deliveryDetails && (
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryLocation">Select Delivery Location</Label>
                  <Select 
                    value={formData.deliveryLocation} 
                    onValueChange={(value) => handleSelectChange('deliveryLocation', value)}
                  >
                    <SelectTrigger id="deliveryLocation">
                      <SelectValue placeholder="Select Delivery Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GO ALT TECHNOLOGIES">GO ALT TECHNOLOGIES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendorName">Vendor Name <span className="text-red-500">*</span></Label>
                    <Input 
                      id="vendorName"
                      name="vendorName"
                      placeholder="GO ALT TECHNOLOGIES"
                      value={formData.vendorName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerLastName">Customer Last Name</Label>
                    <Input 
                      id="customerLastName"
                      name="customerLastName"
                      placeholder="Customer Last Name"
                      value={formData.customerLastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deliveryContactNumber">Contact Number <span className="text-red-500">*</span></Label>
                    <Input 
                      id="deliveryContactNumber"
                      name="deliveryContactNumber"
                      value={formData.deliveryContactNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryPincode">Delivery Pincode <span className="text-red-500">*</span></Label>
                    <Input 
                      id="deliveryPincode"
                      name="deliveryPincode"
                      placeholder="Delivery Pincode"
                      value={formData.deliveryPincode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryAddressLine1">Delivery Address Line 1 <span className="text-red-500">*</span></Label>
                  <Input 
                    id="deliveryAddressLine1"
                    name="deliveryAddressLine1"
                    value={formData.deliveryAddressLine1}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryAddressLine2">Delivery Address Line 2</Label>
                  <Input 
                    id="deliveryAddressLine2"
                    name="deliveryAddressLine2"
                    placeholder="Delivery Address Line 2"
                    value={formData.deliveryAddressLine2}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deliveryCity">Delivery City <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input 
                        id="deliveryCity"
                        name="deliveryCity"
                        placeholder="Delivery City"
                        value={formData.deliveryCity}
                        onChange={handleChange}
                        required
                      />
                      {isLoadingDeliveryLocation && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin h-4 w-4 border-2 border-orange-500 rounded-full border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryState">Delivery State <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input 
                        id="deliveryState"
                        name="deliveryState"
                        placeholder="Delivery State"
                        value={formData.deliveryState}
                        onChange={handleChange}
                        required
                      />
                      {isLoadingDeliveryLocation && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin h-4 w-4 border-2 border-orange-500 rounded-full border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* GST Details Section */}
          <div className="border rounded-lg overflow-hidden">
            <div 
              className={`flex justify-between items-center p-4 cursor-pointer ${openSections.gstDetails ? 'border-b' : ''} ${openSections.gstDetails ? 'text-red-500' : ''}`}
              onClick={() => toggleSection('gstDetails')}
            >
              <h3 className="font-medium">GST Details (Above ₹49,999)</h3>
              {openSections.gstDetails ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>

            {openSections.gstDetails && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gstNumber">GST Number</Label>
                    <Input 
                      id="gstNumber"
                      name="gstNumber"
                      placeholder="GST Number"
                      value={formData.gstNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hsnNumber">HSN Number</Label>
                    <Input 
                      id="hsnNumber"
                      name="hsnNumber"
                      placeholder="HSN Number"
                      value={formData.hsnNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eWayBillNumber">Ewaybill Number</Label>
                    <Input 
                      id="eWayBillNumber"
                      name="eWayBillNumber"
                      placeholder="Ewaybill Number"
                      value={formData.eWayBillNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cgstPercentage">CGST%</Label>
                    <Input 
                      id="cgstPercentage"
                      name="cgstPercentage"
                      placeholder="CGST%"
                      value={formData.cgstPercentage}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sgstPercentage">SGST%</Label>
                    <Input 
                      id="sgstPercentage"
                      name="sgstPercentage"
                      placeholder="SGST%"
                      value={formData.sgstPercentage}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="igstPercentage">IGST%</Label>
                    <Input 
                      id="igstPercentage"
                      name="igstPercentage"
                      placeholder="IGST%"
                      value={formData.igstPercentage}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline" type="button">Cancel</Button>
          </DialogClose>
          <Button 
            type="button" 
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 