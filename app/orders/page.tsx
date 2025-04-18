'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import Header from '@/components/Header';
import OrderDetailsModal from '@/components/OrderDetailsModal';
import AddReturnOrderModal from '@/components/AddReturnOrderModal';
import TrackOrderModal from '@/components/TrackOrderModal';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Upload, 
  Search, 
  MoreVertical, 
  Plus,
  RotateCcw
} from 'lucide-react';

export default function Orders() {
  const { user, loading } = useAuth();
  
  // Order details modal state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Add Return Order modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Track Order modal state
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackingAwb, setTrackingAwb] = useState('');

  const openOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const openTrackOrder = (awb: string) => {
    setTrackingAwb(awb);
    setIsTrackModalOpen(true);
  };

  // Mock data for returns
  const mockReturns = [
    {
      company: 'GO ALT TECHNOLOGIES',
      companyId: '9741623600',
      user: 'R-Dnamitha832C',
      timeAgo: '2 hours ago',
      awb: 'SDnamitha',
      source: 'Mysore, KA (570022)',
      destination: 'Bangalore, KA (560037)',
      reason: 'Replacement',
      status: 'Approved'
    },
    {
      company: 'GO ALT TECHNOLOGIES',
      companyId: '9741623600',
      user: 'R-Ddarshan794F',
      timeAgo: '9 hours ago',
      awb: 'SDdarshan',
      source: 'Bhavnagar, GJ (364002)',
      destination: 'Bangalore, KA (560037)',
      reason: 'Replacement',
      status: 'Approved'
    },
    {
      company: 'GO ALT TECHNOLOGIES',
      companyId: '9741623600',
      user: 'R-SDSahil078F',
      timeAgo: 'a day ago',
      awb: 'SDSahil',
      source: 'Ahmedabad, GJ (380058)',
      destination: 'Bangalore, KA (560037)',
      reason: 'Replacement',
      status: 'Approved'
    },
    {
      company: 'GO ALT TECHNOLOGIES',
      companyId: '9741623600',
      user: 'R-SDRahulADDF',
      timeAgo: 'a day ago',
      awb: 'SDRahul',
      source: 'Baroda, GJ (390021)',
      destination: 'Bangalore, KA (560037)',
      reason: 'Replacement',
      status: 'Approved'
    },
    {
      company: 'GO ALT TECHNOLOGIES',
      companyId: '9741623600',
      user: 'R-SDKasturi',
      timeAgo: '2 days ago',
      awb: 'SDKasturi',
      source: 'Thane, MH (401303)',
      destination: 'Bangalore, KA (560037)',
      reason: 'Replacement',
      status: 'Approved'
    }
  ];

  // Calculate total orders
  const totalOrders = mockReturns.length;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-gray-200 w-8 h-8 rounded-md flex items-center justify-center text-slate-700">
              <RotateCcw className="h-4 w-4 text-purple-600" />
            </div>
            <h1 className="text-xl font-semibold">Return Orders</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => setIsTrackModalOpen(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Track Order
            </Button>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Return Order
            </Button>
          </div>
        </div>

        {/* Returns table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b">
            <div className="text-sm text-gray-600">
              Showing 1 of {totalOrders} of {totalOrders} Returns
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Upload className="h-4 w-4" />
                <span>Add Returns</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 bg-gray-50 p-4 text-sm font-medium text-gray-600 border-b">
            <div className="hidden md:block">Order Details</div>
            <div className="hidden md:block">Original Order Details</div>
            <div className="hidden md:block">Shipping Details</div>
            <div className="hidden md:block">Return Reason</div>
            <div className="hidden md:block">Actions</div>
            <div className="md:hidden">Return Information</div>
          </div>

          {/* Table rows */}
          <div className="divide-y">
            {mockReturns.map((returnItem, index) => (
              <div 
                key={index} 
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 p-4 text-sm hover:bg-gray-50 cursor-pointer gap-y-3"
                onClick={() => openOrderDetails(returnItem)}
              >
                {/* Mobile view */}
                <div className="md:hidden col-span-1 sm:col-span-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs flex items-center">
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Return
                    </span>
                    <span className="font-medium">{returnItem.company}</span> • <span className="text-gray-500">{returnItem.timeAgo}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">AWB:</span> <span className="font-medium">{returnItem.awb}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">From:</span> {returnItem.source}
                  </div>
                  <div>
                    <span className="text-gray-600">To:</span> {returnItem.destination}
                  </div>
                  <div>
                    <span className="text-gray-600">Reason:</span> {returnItem.reason}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline"
                      className="bg-green-50 border-green-100 text-green-600 hover:bg-green-100 hover:text-green-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        openOrderDetails(returnItem);
                      }}
                    >
                      {returnItem.status}
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        openTrackOrder(returnItem.awb);
                      }}
                    >
                      <Search className="h-4 w-4" /> Track
                    </Button>
                  </div>
                </div>

                {/* Desktop view */}
                <div className="hidden md:block">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs flex items-center">
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Return
                    </span>
                  </div>
                  <div className="font-medium">{returnItem.company} | {returnItem.companyId}</div>
                  <div>{returnItem.user}</div>
                  <div className="text-gray-500 text-xs mt-1">{returnItem.timeAgo}</div>
                </div>
                <div className="hidden md:block">
                  <div className="text-gray-600">AWB:</div>
                  <div className="font-medium">Order Number: {returnItem.awb}</div>
                </div>
                <div className="hidden md:block">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5"></div>
                    <div>{returnItem.source}</div>
                  </div>
                  <div className="flex items-start gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                    <div>{returnItem.destination}</div>
                  </div>
                </div>
                <div className="hidden md:block">{returnItem.reason}</div>
                <div className="hidden md:flex flex-col gap-2">
                  <Button 
                    variant="outline"
                    className="bg-green-50 border-green-100 text-green-600 hover:bg-green-100 hover:text-green-700 w-full justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      openOrderDetails(returnItem);
                    }}
                  >
                    {returnItem.status}
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-1 w-full justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      openTrackOrder(returnItem.awb);
                    }}
                  >
                    <Search className="h-4 w-4" /> Track
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          order={selectedOrder}
        />
      )}

      {/* Add Return Order Modal */}
      <AddReturnOrderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      
      {/* Track Order Modal */}
      <TrackOrderModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
      />
    </div>
  );
} 