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
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, Truck, AlertCircle, Package, RotateCcw, ArrowLeftRight } from 'lucide-react';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAwb?: string;
}

export default function TrackOrderModal({
  isOpen,
  onClose,
  initialAwb = ''
}: TrackOrderModalProps) {
  const [awbNumber, setAwbNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Set the initial AWB when the component mounts or when initialAwb changes
  useEffect(() => {
    if (initialAwb) {
      setAwbNumber(initialAwb);
    }
  }, [initialAwb]);

  // Auto-track when initial AWB is provided and modal is opened
  useEffect(() => {
    if (isOpen && initialAwb && !trackingData && !isLoading) {
      handleTrack();
    }
  }, [isOpen, initialAwb]);

  const handleTrack = async () => {
    if (!awbNumber.trim()) {
      toast.error("Please enter an AWB number");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTrackingData(null);

    try {
      const response = await fetch('/api/shipdelight/track-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ awbNumber: awbNumber.trim() })
      });

      const result = await response.json();

      if (result.success && result.data) {
        setTrackingData(result.data);
      } else {
        setError(result.error || 'Failed to track order');
        toast.error('Tracking failed', {
          description: result.error || 'Could not find tracking information'
        });
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      setError('Failed to connect to tracking service');
      toast.error('Tracking failed', {
        description: 'Could not connect to tracking service'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status: string, orderType: string = '') => {
    status = status.toUpperCase();
    const isReturn = orderType.toUpperCase() === 'REVERSE' || status.includes('REVERSE');
    
    if (status.includes('DELIVERED')) return <CheckCircle className="text-green-500" />;
    if (status.includes('FAILED') || status.includes('UNDELIVERED') || status.includes('REJECTED')) return <XCircle className="text-red-500" />;
    if (status.includes('PENDING')) return <Clock className="text-orange-500" />;
    if (status.includes('TRANSIT') || status.includes('PICKUP DONE')) {
      return isReturn ? <RotateCcw className="text-purple-500" /> : <Truck className="text-blue-500" />;
    }
    if (status.includes('REVERSE')) return <ArrowLeftRight className="text-purple-500" />;
    return <Package className="text-gray-500" />;
  };

  // Helper function to determine if the status is related to return
  const isReturnStatus = (statusCode: string) => {
    return statusCode.startsWith('R') || statusCode === 'Return-Exchange';
  };

  // Helper function to get status color
  const getStatusColor = (status: string, orderType: string = '') => {
    status = status.toUpperCase();
    const isReturn = orderType.toUpperCase() === 'REVERSE' || status.includes('REVERSE');
    
    if (status.includes('DELIVERED')) return 'bg-green-50 text-green-700 border-green-200';
    if (status.includes('FAILED') || status.includes('UNDELIVERED') || status.includes('REJECTED')) return 'bg-red-50 text-red-700 border-red-200';
    if (status.includes('PENDING')) return 'bg-orange-50 text-orange-700 border-orange-200';
    if (isReturn) return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Track Order
          </DialogTitle>
          <p className="text-sm text-gray-500">
            Individual order tracking is still available during system maintenance. Enter an AWB number to track a shipment.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="awbNumber">AWB Number</Label>
              <Input 
                id="awbNumber"
                placeholder="Enter AWB Number"
                value={awbNumber}
                onChange={(e) => setAwbNumber(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleTrack}
              disabled={isLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">○</span>
                  Tracking...
                </>
              ) : (
                'Track'
              )}
            </Button>
          </div>

          {error && (
            <div className="p-4 border rounded-md bg-red-50 text-red-700 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{error}</p>
                <p className="text-sm mt-1">
                  Make sure you've entered a valid AWB number. If you don't have an AWB number,
                  try viewing your original order email or contact customer support.
                </p>
              </div>
            </div>
          )}

          {trackingData && trackingData.tracking && trackingData.tracking.length > 0 && (
            <div className="space-y-4 border rounded-md p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">AWB Number:</span>
                  <div className="font-medium">{trackingData.tracking[0].airwaybilno}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Order Number:</span>
                  <div className="font-medium">{trackingData.tracking[0].orderno}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Order Type:</span>
                  <div className={`font-medium flex items-center gap-1 ${
                    trackingData.tracking[0].ordertype === 'REVERSE' ? 'text-purple-700' : 'text-blue-700'
                  }`}>
                    {trackingData.tracking[0].ordertype === 'REVERSE' ? (
                      <ArrowLeftRight className="h-4 w-4" />
                    ) : (
                      <Truck className="h-4 w-4" />
                    )}
                    {trackingData.tracking[0].ordertype}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Status:</span>
                  <div className={`font-medium flex items-center gap-1 px-2 py-1 rounded-md inline-block ${
                    getStatusColor(trackingData.tracking[0].latest_status, trackingData.tracking[0].ordertype)
                  }`}>
                    {getStatusIcon(trackingData.tracking[0].latest_status, trackingData.tracking[0].ordertype)}
                    {trackingData.tracking[0].latest_status}
                  </div>
                </div>
                {trackingData.tracking[0].exp_delivery && (
                  <div>
                    <span className="text-sm text-gray-500">Expected Delivery:</span>
                    <div className="font-medium">{trackingData.tracking[0].exp_delivery}</div>
                  </div>
                )}
              </div>

              {trackingData.tracking[0].tracking_history && trackingData.tracking[0].tracking_history.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Tracking History</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {trackingData.tracking[0].tracking_history.map((history: any, index: number) => (
                          <tr key={index} className={
                            history.status_code && isReturnStatus(history.status_code) ? 'bg-purple-50' : ''
                          }>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                              <div className="flex items-center gap-1">
                                {getStatusIcon(history.status, trackingData.tracking[0].ordertype)}
                                <span className={history.status_code && isReturnStatus(history.status_code) ? 'text-purple-700' : ''}>
                                  {history.status}
                                  {history.status_code && (
                                    <span className="text-xs ml-1 text-gray-500">({history.status_code})</span>
                                  )}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{history.location}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{history.remarks}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{history.updated_at}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 