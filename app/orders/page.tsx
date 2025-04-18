'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import Header from '@/components/Header';
import OrderDetailsModal from '@/components/OrderDetailsModal';
import AddReturnOrderModal from '@/components/AddReturnOrderModal';
import TrackOrderModal from '@/components/TrackOrderModal';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Upload, 
  Search, 
  RotateCcw,
  Plus,
  ChevronDown,
  ChevronLeft, 
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Package
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Interface for order data
interface Order {
  company: string;
  companyId: string;
  user: string;
  timeAgo: string;
  awb: string;
  orderNumber: string;
  source: string;
  destination: string;
  reason: string;
  status: string;
}

// Interface for pagination data
interface Pagination {
  total: number;
  total_pages: number;
  current_page: number;
  per_page: number;
}

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // Orders data state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    total_pages: 0,
    current_page: 1,
    per_page: 10
  });

  // Filters state
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [days, setDays] = useState<number>(30);
  
  // Modal states
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTrackOrderModalOpen, setIsTrackOrderModalOpen] = useState(false);
  const [selectedOrderAwb, setSelectedOrderAwb] = useState('');

  // Add a state for maintenance mode
  const [maintenanceMode, setMaintenanceMode] = useState(true); // Set to true to enable maintenance mode

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);
  
  // Fetch orders data
  const fetchOrders = async (page = 1) => {
    // If maintenance mode is on, don't make any API calls
    if (maintenanceMode) {
      // Just display mock data instead or show a maintenance message
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // We're not setting any orders, so it will show the empty state
      }, 500);
      return;
    }
    
    // Original code continues here if not in maintenance mode
    setLoading(true);
    setError(null);
    
    try {
      // Construct the API URL with query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.per_page.toString(),
        days: days.toString()
      });
      
      // Add optional filters if provided
      if (statusFilter) {
        queryParams.append('status', statusFilter);
      }
      
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      
      // Make the API request
      const response = await fetch(`/api/shipdelight/get-reverse-orders?${queryParams.toString()}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error Response: ${errorText}`);
        throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setOrders(result.data.orders);
        setPagination(result.data.pagination);
      } else {
        console.error('API Error:', result.error);
        throw new Error(result.error || 'Failed to fetch orders');
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setError(error.message || 'An error occurred while fetching orders');
      toast.error('Failed to load orders', {
        description: `${error.message || 'Please try again later'} - This may be due to the API endpoint change.`
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch orders on component mount and when filters change
  useEffect(() => {
    if (user) {
      fetchOrders(pagination.current_page);
    }
  }, [user, statusFilter, days, pagination.per_page]);
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(1); // Reset to first page when searching
  };
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchOrders(newPage);
    }
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleTrackOrder = (awb: string) => {
    setSelectedOrderAwb(awb);
    setIsTrackOrderModalOpen(true);
  };

  // Helper function to get status badge styling
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-50 border-green-100 text-green-600 hover:bg-green-100 hover:text-green-700';
      case 'rejected':
        return 'bg-red-50 border-red-100 text-red-600 hover:bg-red-100 hover:text-red-700';
      case 'pending':
        return 'bg-orange-50 border-orange-100 text-orange-600 hover:bg-orange-100 hover:text-orange-700';
      case 'cancelled':
        return 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100 hover:text-gray-700';
      default:
        return 'bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100 hover:text-blue-700';
    }
  };

  // First, add a function to generate mock data near the beginning of the component
  const generateMockData = (): Order[] => {
    // Generate some mock return orders for development/testing
    const mockOrders: Order[] = [
      {
        company: 'Customer One',
        companyId: 'CUST001',
        user: '#ORD1234',
        timeAgo: '3 days ago',
        awb: '12345678',
        orderNumber: '#ORD1234',
        source: 'Mumbai, Maharashtra (400001)',
        destination: 'Delhi, Delhi (110001)',
        reason: 'Size not as expected',
        status: 'Pending'
      },
      {
        company: 'Customer Two',
        companyId: 'CUST002',
        user: '#ORD5678',
        timeAgo: '1 day ago',
        awb: '87654321',
        orderNumber: '#ORD5678',
        source: 'Bangalore, Karnataka (560001)',
        destination: 'Chennai, Tamil Nadu (600001)',
        reason: 'Damaged product',
        status: 'Approved'
      },
      {
        company: 'Customer Three',
        companyId: 'CUST003',
        user: '#ORD9101',
        timeAgo: '4 hours ago',
        awb: '24681012',
        orderNumber: '#ORD9101',
        source: 'Hyderabad, Telangana (500001)',
        destination: 'Kolkata, West Bengal (700001)',
        reason: 'Wrong product received',
        status: 'Rejected'
      }
    ];
    
    return mockOrders;
  };

  // Add a function to load the mock data
  const loadMockData = () => {
    setError(null);
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const mockOrders = generateMockData();
      setOrders(mockOrders);
      setPagination({
        total: mockOrders.length,
        total_pages: 1,
        current_page: 1,
        per_page: 10
      });
      setLoading(false);
      
      toast.success('Loaded mock data for development', {
        description: 'This data is for testing purposes only'
      });
    }, 800);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
        </main>
      </div>
    );
  }

  // If not authenticated and not loading, don't render the page content
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="mb-4">Please log in to access this page.</p>
            <Button onClick={() => router.push('/login')} className="bg-orange-500 hover:bg-orange-600 text-white">
              Go to Login
            </Button>
          </div>
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
              onClick={() => setIsTrackOrderModalOpen(true)}
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

        {/* Search and filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by order number, customer name, or phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border border-gray-300 rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="PENDING">Pending</option>
              </select>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => fetchOrders(pagination.current_page)}
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>

        {/* Returns table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b">
            <div className="text-sm text-gray-600">
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 inline-block h-4 w-4 border-2 border-t-transparent border-orange-500 rounded-full"></span>
                  Loading orders...
                </span>
              ) : error ? (
                <span className="text-red-500">{error}</span>
              ) : (
                <span>Showing {orders.length > 0 ? ((pagination.current_page - 1) * pagination.per_page) + 1 : 0} - {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} Returns</span>
              )}
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
            <div className="hidden md:flex items-center">
              Order Details
              <ChevronDown className="h-4 w-4 ml-1" />
            </div>
            <div className="hidden md:block">Original Order Details</div>
            <div className="hidden md:block">Shipping Details</div>
            <div className="hidden md:block">Return Reason</div>
            <div className="hidden md:block">Actions</div>
            <div className="md:hidden">Return Information</div>
          </div>

          {/* Table rows */}
          <div className="divide-y">
            {maintenanceMode ? (
              <div className="p-8 text-center">
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-6 max-w-xl mx-auto">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <RefreshCw className="h-8 w-8 text-amber-500 animate-spin" />
                    <h3 className="text-lg font-semibold text-amber-700">System Upgrade in Progress</h3>
                  </div>
                  <p className="mb-4 text-amber-700">
                    We're currently upgrading our order tracking system to provide you with better performance and reliability.
                  </p>
                  <p className="text-sm text-amber-600 mb-6">
                    This maintenance is scheduled to be completed soon. Thank you for your patience.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button
                      onClick={loadMockData}
                      className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-2"
                    >
                      <Package className="h-4 w-4" /> View Sample Data
                    </Button>
                    <Button 
                      onClick={() => setIsTrackOrderModalOpen(true)} 
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Search className="h-4 w-4" /> Track Individual Order
                    </Button>
                  </div>
                </div>
              </div>
            ) : loading && orders.length === 0 ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
                <p>Loading return orders...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <div className="text-red-500 mb-6">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold mb-2">Error Loading Orders</h3>
                  <p className="mb-1">{error}</p>
                  <p className="text-sm text-gray-600 mb-4">
                    We are updating our API to use the tracking service instead of the deprecated endpoint.
                    This error may be temporary during the transition.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button 
                    onClick={() => fetchOrders(1)} 
                    className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" /> Refresh Orders
                  </Button>
                  <Button 
                    onClick={() => setIsTrackOrderModalOpen(true)} 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Search className="h-4 w-4" /> Track Specific Order
                  </Button>
                  <Button
                    onClick={loadMockData}
                    variant="outline"
                    className="flex items-center gap-2 border-blue-300 text-blue-600"
                  >
                    <Package className="h-4 w-4" /> Load Mock Data
                  </Button>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center">
                <p className="mb-4">No return orders found</p>
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Return Order
                </Button>
              </div>
            ) : (
              orders.map((returnItem, index) => (
                <div 
                  key={index} 
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 p-4 text-sm hover:bg-gray-50 cursor-pointer gap-y-3"
                  onClick={() => openOrderDetails(returnItem)}
                >
                  {/* Mobile view */}
                  <div className="md:hidden col-span-1 sm:col-span-2 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs flex items-center">
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Return
                      </span>
                      <span className="font-medium">{returnItem.company}</span> • <span className="text-gray-500">{returnItem.timeAgo}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">User ID:</span> <span className="font-medium">{returnItem.user}</span>
                    </div>
                    {returnItem.orderNumber && (
                      <div>
                        <span className="text-gray-600">Order Number:</span> <span className="font-medium">{returnItem.orderNumber}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">From:</span> {returnItem.source}
                    </div>
                    <div>
                      <span className="text-gray-600">To:</span> {returnItem.destination}
                    </div>
                    {returnItem.reason !== 'NA' && (
                      <div>
                        <span className="text-gray-600">Reason:</span> {returnItem.reason}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline"
                        className={getStatusStyle(returnItem.status)}
                        onClick={(e) => {
                          e.stopPropagation();
                          openOrderDetails(returnItem);
                        }}
                      >
                        {returnItem.status}
                      </Button>
                      {returnItem.awb && returnItem.status === 'Approved' && (
                        <Button 
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTrackOrder(returnItem.awb);
                          }}
                        >
                          <Search className="h-4 w-4" /> Track
                        </Button>
                      )}
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
                    {returnItem.orderNumber && (
                      <div className="font-medium">Order Number: {returnItem.orderNumber}</div>
                    )}
                    {returnItem.awb && (
                      <div className="text-xs text-gray-500 mt-1">AWB: {returnItem.awb}</div>
                    )}
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
                      className={`${getStatusStyle(returnItem.status)} w-full justify-center`}
                      onClick={(e) => {
                        e.stopPropagation();
                        openOrderDetails(returnItem);
                      }}
                    >
                      {returnItem.status}
                    </Button>
                    {returnItem.awb && returnItem.status === 'Approved' && (
                      <Button 
                        variant="outline"
                        className="flex items-center gap-1 w-full justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTrackOrder(returnItem.awb);
                        }}
                      >
                        <Search className="h-4 w-4" /> Track
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Pagination */}
          {!loading && !error && orders.length > 0 && pagination.total_pages > 1 && (
            <div className="p-4 flex justify-center">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  disabled={pagination.current_page === 1}
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                  // Calculate which page numbers to show
                  let pageNum = i + 1;
                  if (pagination.total_pages > 5) {
                    if (pagination.current_page > 3) {
                      pageNum = pagination.current_page - 2 + i;
                    }
                    if (pagination.current_page > pagination.total_pages - 2) {
                      pageNum = pagination.total_pages - 4 + i;
                    }
                  }
                  
                  return (
                    <Button 
                      key={i}
                      variant={pageNum === pagination.current_page ? "default" : "outline"} 
                      onClick={() => handlePageChange(pageNum)}
                      className={pageNum === pagination.current_page ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button 
                  variant="outline" 
                  disabled={pagination.current_page === pagination.total_pages}
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
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
        onClose={() => {
          setIsAddModalOpen(false);
          // Refresh the orders after adding a new one
          fetchOrders(pagination.current_page);
        }}
      />
      
      {/* Track Order Modal */}
      <TrackOrderModal
        isOpen={isTrackOrderModalOpen}
        onClose={() => {
          setIsTrackOrderModalOpen(false);
          setSelectedOrderAwb('');
        }}
        initialAwb={selectedOrderAwb}
      />
    </div>
  );
} 