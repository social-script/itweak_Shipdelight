'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Package, 
  Truck, 
  Clock, 
  MapPin, 
  AlignLeft, 
  Copy, 
  Check, 
  X
} from "lucide-react";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order
}: OrderDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [trackingStatus, setTrackingStatus] = useState("Approved");
  const [statusHistory, setStatusHistory] = useState([
    { status: "Approved", timestamp: "2025-04-10 10:30 AM", user: "Admin" },
    { status: "Submitted", timestamp: "2025-04-10 09:15 AM", user: "System" }
  ]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Details 
            <span className="text-purple-600 ml-2">#{order?.awb}</span>
          </DialogTitle>
          <DialogDescription>
            View and manage return order details
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="details">Order Details</TabsTrigger>
            <TabsTrigger value="shipping">Shipping Info</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          {/* Order Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h3 className="font-medium text-purple-800 mb-2">Order Information</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-[120px_1fr] items-center">
                      <span className="text-gray-500">Order ID:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{order?.awb}</span>
                        <button onClick={() => copyToClipboard(order?.awb)} className="text-gray-400 hover:text-gray-600">
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center">
                      <span className="text-gray-500">Company:</span>
                      <span className="font-medium">{order?.company}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center">
                      <span className="text-gray-500">Reason:</span>
                      <span className="font-medium">{order?.reason}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center">
                      <span className="text-gray-500">Created By:</span>
                      <span className="font-medium">{order?.user}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center">
                      <span className="text-gray-500">Status:</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {order?.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-2">Customer Information</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-[120px_1fr] items-center">
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium">John Doe</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center">
                      <span className="text-gray-500">Phone:</span>
                      <span className="font-medium">+91 9876543210</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium">john.doe@example.com</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <h3 className="font-medium text-amber-800 mb-2">Product Information</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-[120px_1fr] items-center">
                      <span className="text-gray-500">Product:</span>
                      <span className="font-medium">Premium Smartwatch</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center">
                      <span className="text-gray-500">SKU:</span>
                      <span className="font-medium">SW-PRO-2025</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center">
                      <span className="text-gray-500">Quantity:</span>
                      <span className="font-medium">1</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center">
                      <span className="text-gray-500">Price:</span>
                      <span className="font-medium">₹3,607.74</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                  <h3 className="font-medium text-emerald-800 mb-2">Details</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-[120px_1fr] items-start">
                      <span className="text-gray-500">Description:</span>
                      <span>Customer reported defective product with issues in display. Requesting replacement under warranty.</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <h3 className="font-medium text-red-800 mb-2">Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="bg-green-50 border-green-100 text-green-600 hover:bg-green-100">
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button variant="outline" className="bg-red-50 border-red-100 text-red-600 hover:bg-red-100">
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Shipping Info Tab */}
          <TabsContent value="shipping" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <h3 className="font-medium text-orange-800 mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" /> Source Address
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="font-medium">John Doe</p>
                    <p>123 Main Street, Apartment 4B</p>
                    <p>{order?.source}</p>
                    <p>Phone: +91 9876543210</p>
                  </div>
                </div>
              </div>

              <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                <h3 className="font-medium text-teal-800 mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" /> Destination Address
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="font-medium">Company Warehouse</p>
                    <p>456 Business Park, Building C</p>
                    <p>{order?.destination}</p>
                    <p>Phone: +91 8765432109</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 md:col-span-2">
                <h3 className="font-medium text-indigo-800 mb-2 flex items-center">
                  <Truck className="h-4 w-4 mr-1" /> Shipping Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-[140px_1fr] items-center">
                      <span className="text-gray-500">Shipping Method:</span>
                      <span className="font-medium">Standard Ground</span>
                    </div>
                    <div className="grid grid-cols-[140px_1fr] items-center">
                      <span className="text-gray-500">Carrier:</span>
                      <span className="font-medium">GO ALT TECHNOLOGIES</span>
                    </div>
                    <div className="grid grid-cols-[140px_1fr] items-center">
                      <span className="text-gray-500">Tracking Number:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{order?.companyId}</span>
                        <button onClick={() => copyToClipboard(order?.companyId)} className="text-gray-400 hover:text-gray-600">
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-[140px_1fr] items-center">
                      <span className="text-gray-500">Ship Date:</span>
                      <span className="font-medium">2025-04-12</span>
                    </div>
                    <div className="grid grid-cols-[140px_1fr] items-center">
                      <span className="text-gray-500">Estimated Arrival:</span>
                      <span className="font-medium">2025-04-15</span>
                    </div>
                    <div className="grid grid-cols-[140px_1fr] items-center">
                      <span className="text-gray-500">Package Weight:</span>
                      <span className="font-medium">0.5 kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Tracking Tab */}
          <TabsContent value="tracking" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-violet-50 p-4 rounded-lg border border-violet-100 h-fit">
                <h3 className="font-medium text-violet-800 mb-4 flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> Update Status
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={trackingStatus} onValueChange={setTrackingStatus}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Submitted">Submitted</SelectItem>
                        <SelectItem value="In Review">In Review</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Add status update notes"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <Button className="w-full button-gradient">
                    Update Status
                  </Button>
                </div>
              </div>
              
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> Status History
                </h3>
                
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-3 top-0 h-full w-0.5 bg-gray-200"></div>
                  
                  {/* Timeline items */}
                  <div className="space-y-6">
                    {statusHistory.map((item, index) => (
                      <div key={index} className="relative pl-10">
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-1 h-6 w-6 rounded-full border-2 border-purple-500 bg-white flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="flex justify-between items-start">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {item.status}
                            </span>
                            <span className="text-xs text-gray-500">{item.timestamp}</span>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            Status updated to <span className="font-medium">{item.status}</span> by {item.user}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                <AlignLeft className="h-4 w-4 mr-1" /> Add Note
              </h3>
              <div className="space-y-4 mt-3">
                <Textarea 
                  placeholder="Add a note about this order..."
                  className="min-h-[120px]"
                />
                <Button className="button-gradient">
                  Add Note
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-medium text-gray-800 mb-4">Order Notes</h3>
              
              <div className="space-y-4">
                <div className="bg-white p-3 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">Support Agent</span>
                    <span className="text-xs text-gray-500">2025-04-10 11:30 AM</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Customer contacted support to confirm the replacement process. Advised that they should receive the replacement within 3-5 business days.
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">System</span>
                    <span className="text-xs text-gray-500">2025-04-10 09:15 AM</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Return request created. Awaiting approval from merchant.
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 