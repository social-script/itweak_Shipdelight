'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import Header from '@/components/Header';
import OrderDetailsModal from '@/components/OrderDetailsModal';
import AddReturnOrderModal from '@/components/AddReturnOrderModal';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Upload, 
  Search, 
  MoreVertical, 
  Calendar 
} from 'lucide-react';

export default function Orders() {
  const { user, loading } = useAuth();
  const [dateRange, setDateRange] = useState({
    start: '2025-03-19 00:00',
    end: '2025-04-18 23:59'
  });
  
  // Order details modal state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Add Return Order modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const openOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const openAddReturnOrder = () => {
    setIsAddModalOpen(true);
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

  // Filter states
  const [filterStatus, setFilterStatus] = useState('Approved');
  const totalOrders = mockReturns.length;
  const totalAmount = '₹3,607.74';

  // Status counts for the filter menu
  const statusCounts = {
    'New Request': 0,
    'Approved': 33,
    'Rejected': 0,
    'Failed': 6,
    'Refund Initiated': 0,
    'Refunded': 0,
    'Refund Failed': 0
  };

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
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-gray-200 w-8 h-8 rounded-md flex items-center justify-center text-slate-700">
              📦
            </div>
            <h1 className="text-xl font-semibold">Orders</h1>
          </div>
          <div className="text-green-600 font-semibold text-xl">{totalAmount}</div>
        </div>

        {/* Filters section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">LSPs</label>
              <Select defaultValue="ALL">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">ALL</SelectItem>
                  <SelectItem value="EKART">EKART</SelectItem>
                  <SelectItem value="DELHIVERY">DELHIVERY</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Date</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input 
                    type="text" 
                    value={dateRange.start} 
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    className="pr-8"
                  />
                  <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <span className="text-gray-400">|</span>
                <div className="relative flex-1">
                  <Input 
                    type="text" 
                    value={dateRange.end} 
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    className="pr-8"
                  />
                  <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Search</label>
              <div className="relative">
                <Select defaultValue="ALL">
                  <SelectTrigger className="w-full rounded-r-none absolute left-0 h-full">
                    <SelectValue placeholder="ALL" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">ALL</SelectItem>
                    <SelectItem value="ORDER">ORDER</SelectItem>
                    <SelectItem value="AWB">AWB</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  type="text" 
                  placeholder="Search by Order No. / Mobile No. / AWB No. (For bulk search provide ',' separated values)" 
                  className="pl-20"
                />
                <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Status filter and returns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Status filter sidebar */}
          <div className="md:col-span-1">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-orange-50 p-4">
                  <div className="flex items-center gap-2 text-orange-600">
                    <span className="text-lg">🔥</span>
                    <span className="font-medium">Your Return Status</span>
                  </div>
                </div>

                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Status</h3>
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  </div>
                </div>

                <div className="divide-y">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <div 
                      key={status}
                      className={`p-4 flex justify-between items-center cursor-pointer ${
                        filterStatus === status ? 'bg-purple-50' : ''
                      }`}
                      onClick={() => setFilterStatus(status)}
                    >
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={filterStatus === status}
                          onChange={() => setFilterStatus(status)}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        <span className={filterStatus === status ? 'text-purple-700 font-medium' : ''}>{status}</span>
                      </div>
                      <span className="text-gray-500">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Returns table */}
          <div className="md:col-span-4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 flex justify-between items-center border-b">
                <div className="text-sm text-gray-600">
                  Showing 1 of {totalOrders} of {totalOrders} Returns
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={openAddReturnOrder}
                  >
                    <Upload className="h-4 w-4" />
                    <span>Import / Add Returns</span>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                </div>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-5 bg-gray-50 p-4 text-sm font-medium text-gray-600 border-b">
                <div>Order Details <ChevronDown className="h-4 w-4 inline-block ml-1" /></div>
                <div>Original Order Details</div>
                <div>Shipping Details</div>
                <div>Return Reason</div>
                <div>Actions</div>
              </div>

              {/* Table rows */}
              <div className="divide-y">
                {mockReturns.map((returnItem, index) => (
                  <div 
                    key={index} 
                    className="grid grid-cols-5 p-4 text-sm hover:bg-gray-50 cursor-pointer"
                    onClick={() => openOrderDetails(returnItem)}
                  >
                    <div>
                      <div className="font-medium">{returnItem.company} | {returnItem.companyId}</div>
                      <div>{returnItem.company}</div>
                      <div className="text-gray-500 text-xs mt-1">{returnItem.user} • {returnItem.timeAgo}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">AWB:</div>
                      <div className="font-medium">Order Number: {returnItem.awb}</div>
                    </div>
                    <div>
                      <div className="flex items-start gap-2">
                        <input type="radio" checked readOnly className="mt-1" />
                        <div>
                          <div>{returnItem.source}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 mt-2">
                        <input type="radio" checked readOnly className="mt-1" />
                        <div>
                          <div>{returnItem.destination}</div>
                        </div>
                      </div>
                    </div>
                    <div>{returnItem.reason}</div>
                    <div className="flex flex-col gap-2">
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
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Show dropdown menu for more actions
                        }}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
    </div>
  );
} 