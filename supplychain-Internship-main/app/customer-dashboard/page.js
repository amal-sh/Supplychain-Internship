"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CustomerDashboard() {
  const [scannedData, setScannedData] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timelineRefs = useRef([]);

  // Mock product timeline data
  const mockProductData = {
    productId: 'AGRI-2024-56789',
    productName: 'Organic Arabica Coffee Beans',
    origin: 'Colombia',
    timeline: [
      {
        id: 'FARM-001',
        location: 'Medellín, Colombia',
        timestamp: '2024-03-15T08:30:00Z',
        stage: 'Harvested',
        description: 'Coffee cherries harvested from farm',
        coordinates: '6.2442° N, 75.5812° W'
      },
      {
        id: 'COL-002',
        location: 'Medellín Collection Center',
        timestamp: '2024-03-17T14:15:00Z',
        stage: 'Processed',
        description: 'Washed and dried coffee beans',
        coordinates: '6.2518° N, 75.5636° W'
      },
      {
        id: 'WH-003',
        location: 'Bogotá Warehouse',
        timestamp: '2024-03-20T11:45:00Z',
        stage: 'Stored',
        description: 'Quality checked and stored in warehouse',
        coordinates: '4.7110° N, 74.0721° W'
      },
      {
        id: 'PROC-004',
        location: 'Bogotá Processing Plant',
        timestamp: '2024-03-25T09:30:00Z',
        stage: 'Roasted',
        description: 'Medium roast applied, packaged',
        coordinates: '4.6985° N, 74.0932° W'
      },
      {
        id: 'SHIP-005',
        location: 'Cartagena Port',
        timestamp: '2024-04-02T16:20:00Z',
        stage: 'Exported',
        description: 'Shipped to international distributor',
        coordinates: '10.3932° N, 75.4832° W'
      }
    ]
  };

  useEffect(() => {
    if (scannedData) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-fadeInUp');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      timelineRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
      });

      return () => {
        timelineRefs.current.forEach((ref) => {
          if (ref) observer.unobserve(ref);
        });
      };
    }
  }, [scannedData]);

  const handleScan = () => {
    setIsLoading(true);
    // Simulate QR code scanning
    setTimeout(() => {
      setScannedData(mockProductData);
      setIsLoading(false);
      setShowScanner(false);
    }, 1500);
  };

  const resetScan = () => {
    setScannedData(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .timeline-item {
          opacity: 0;
        }
      `}</style>

      {/* Header */}
      <header className="w-full py-4 px-6 md:px-12 lg:px-20 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-green-600 rounded-full p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                <path d="M21 12a9 9 0 0 0-9-9v9h9z" />
              </svg>
            </div>
            <span className="font-bold text-lg">Innovest AgriChain</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-green-600">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-green-600">
              About
            </Link>
            <Link href="/features" className="text-sm font-medium hover:text-green-600">
              Features
            </Link>
            <Link href="/customer-dashboard" className="bg-black text-white hover:bg-gray-800 rounded-full px-6 py-2 text-sm font-medium">
              Dashboard
            </Link>
          </nav>
          <button className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Product Traceability</h1>
          <p className="text-lg text-gray-600">
            Scan product QR codes to view complete supply chain history and verify authenticity
          </p>
        </div>

        {/* Scanner Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">QR Code Scanner</h2>
                <p className="text-gray-600">
                  Scan the product QR code to access its complete journey from farm to you
                </p>
              </div>
              {!scannedData ? (
                <button
                  onClick={() => setShowScanner(true)}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-3 font-medium whitespace-nowrap transition-colors duration-300"
                >
                  {showScanner ? 'Cancel Scan' : 'Scan QR Code'}
                </button>
              ) : (
                <button
                  onClick={resetScan}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full px-8 py-3 font-medium whitespace-nowrap transition-colors duration-300"
                >
                  Scan Another Product
                </button>
              )}
            </div>

            {showScanner && !scannedData && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50 min-h-64">
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mb-4"></div>
                    <p className="text-gray-600">Processing QR code...</p>
                  </div>
                ) : (
                  <>
                    <div className="relative w-64 h-64 mb-6 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                      {/* This would be replaced with an actual QR scanner component */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-48 border-4 border-green-500 rounded-lg animate-pulse"></div>
                      </div>
                      <div className="relative z-10 text-center p-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mx-auto mb-2 text-gray-500"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <path d="M8 3v18" />
                          <path d="M16 3v18" />
                          <path d="M3 8h18" />
                          <path d="M3 16h18" />
                        </svg>
                        <p className="text-sm text-gray-500">QR Scanner Simulation</p>
                      </div>
                    </div>
                    <button
                      onClick={handleScan}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-2 text-sm font-medium transition-colors duration-300"
                    >
                      Simulate Scan
                    </button>
                    <p className="mt-4 text-sm text-gray-500">
                      For demo purposes, click "Simulate Scan" to view sample product timeline
                    </p>
                  </>
                )}
              </div>
            )}

            {scannedData && (
              <div className="mt-8">
                <div className="bg-green-50 rounded-lg p-6 mb-8 transition-all duration-500 ease-in-out">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-600"
                        >
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                          <line x1="7" y1="7" x2="7.01" y2="7" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">{scannedData.productName}</h3>
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Product ID:</span> {scannedData.productId}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Origin:</span> {scannedData.origin}
                      </p>
                    </div>
                    <div className="md:ml-auto mt-4 md:mt-0">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-1"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        Verified Supply Chain
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-6">Product Journey Timeline</h3>
                
                <div className="relative">
                  {/* Timeline line with animation */}
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-green-200 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-green-500 origin-top animate-[grow_1.5s_ease-in-out_forwards]" 
                         style={{ animationDelay: '0.3s' }}></div>
                  </div>
                  
                  <div className="space-y-8">
                    {scannedData.timeline.map((item, index) => (
                      <div 
                        key={index} 
                        className="relative pl-16 timeline-item"
                        ref={el => timelineRefs.current[index] = el}
                        style={{ animationDelay: `${0.3 + index * 0.15}s` }}
                      >
                        {/* Timeline dot with animation */}
                        <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-green-100 border-4 border-white flex items-center justify-center shadow-sm">
                          <div className="w-3 h-3 rounded-full bg-green-600 animate-[pulse_2s_infinite]"></div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                            <h4 className="text-lg font-semibold text-gray-800">{item.stage}</h4>
                            <div className="text-sm text-gray-500">
                              {new Date(item.timestamp).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 font-medium">Location</p>
                              <p className="text-gray-800">{item.location}</p>
                              <p className="text-gray-400 text-xs mt-1">{item.coordinates}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 font-medium">Facility ID</p>
                              <p className="text-gray-800">{item.id}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 font-medium">Details</p>
                              <p className="text-gray-800">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Sustainability Metrics</h3>
            </div>
            <p className="text-gray-600 mb-4">
              View detailed environmental impact data for this product, including carbon footprint and water usage.
            </p>
            <button className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1 transition-colors duration-300">
              View sustainability report
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Certificate Verification</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Access and verify all certifications associated with this product, including organic and fair trade.
            </p>
            <button className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1 transition-colors duration-300">
              View certificates
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-bold text-white mb-4">Innovest AgriChain</h3>
              <p className="text-sm">
                Transforming agricultural supply chains with blockchain technology for a sustainable future.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-300">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-300">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-300">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-300">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-300">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-300">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-300">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-300">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-300">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-300">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-300">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-300">
                    GDPR Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2024 Innovest AgriChain. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" aria-label="Twitter" className="hover:text-white transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </Link>
              <Link href="#" aria-label="LinkedIn" className="hover:text-white transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </Link>
              <Link href="#" aria-label="GitHub" className="hover:text-white transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}