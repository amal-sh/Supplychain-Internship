"use client";
import { useState } from 'react';
import Link from 'next/link';
// import { collectionPoints } from '../../lib/locations';

export default function CollectionPoints() {
  const [selectedPoint, setSelectedPoint] = useState(collectionPoints[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPoint, setNewPoint] = useState({
    name: '',
    location: '',
    address: '',
    contact: '',
    email: '',
    hours: '8:00 AM - 6:00 PM',
    days: 'Monday to Saturday',
    distance: '0.5',
    facilities: ['Parking', 'Storage'],
    products: []
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    grade: 'Grade A',
    harvestDate: '',
    price: ''
  });

  const filteredPoints = collectionPoints.filter(point =>
    point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    point.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPoint = () => {
    collectionPoints.push({
      ...newPoint,
      id: `point-${collectionPoints.length + 1}`,
      coordinates: [selectedPoint.coordinates[0] + 0.01, selectedPoint.coordinates[1] + 0.01]
    });
    setShowAddForm(false);
    setNewPoint({
      name: '',
      location: '',
      address: '',
      contact: '',
      email: '',
      hours: '8:00 AM - 6:00 PM',
      days: 'Monday to Saturday',
      distance: '0.5',
      facilities: ['Parking', 'Storage'],
      products: []
    });
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.quantity || !newProduct.price) return;
    
    const productToAdd = {
      name: newProduct.name,
      quantity: `${newProduct.quantity} ${newProduct.unit}`,
      grade: newProduct.grade,
      price: `₹${newProduct.price}/${newProduct.unit}`
    };
    
    setSelectedPoint(prev => ({
      ...prev,
      products: [...prev.products, productToAdd]
    }));
    
    setNewProduct({
      name: '',
      quantity: '',
      unit: 'kg',
      grade: 'Grade A',
      harvestDate: '',
      price: ''
    });
  };

  const openGoogleMaps = (address) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
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
      <main className="flex-grow flex max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12">
        {/* Green Sidebar - Collection Points List */}
        <div className="w-80 bg-green-50 rounded-xl shadow-md p-6 mr-8 hidden lg:block">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-green-800">Collection Points</h2>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-1 text-sm font-medium"
            >
              {showAddForm ? 'Cancel' : '+ Add'}
            </button>
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                className="text-gray-500"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search collection points..."
              className="pl-10 w-full py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
            {filteredPoints.length > 0 ? (
              filteredPoints.map((point) => (
                <div
                  key={point.id}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedPoint?.id === point.id ? 'bg-green-100 border border-green-300' : 'bg-white hover:bg-green-50'}`}
                  onClick={() => setSelectedPoint(point)}
                >
                  <h3 className="font-medium text-gray-800">{point.name}</h3>
                  <p className="text-sm text-gray-600">{point.location}</p>
                  <div className="flex items-center mt-2">
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
                      className="text-green-600 mr-1"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="text-xs text-gray-500">{point.distance} km away</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No collection points found
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Add Collection Point Form */}
          {showAddForm && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Collection Point</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newPoint.name}
                      onChange={(e) => setNewPoint({...newPoint, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newPoint.location}
                      onChange={(e) => setNewPoint({...newPoint, location: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newPoint.address}
                    onChange={(e) => setNewPoint({...newPoint, address: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newPoint.contact}
                      onChange={(e) => setNewPoint({...newPoint, contact: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newPoint.email}
                      onChange={(e) => setNewPoint({...newPoint, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facilities</label>
                  <div className="flex flex-wrap gap-2">
                    {['Parking', 'Storage', 'Refrigeration', 'Weighing', 'Packaging', 'Loading Dock'].map(facility => (
                      <button
                        key={facility}
                        onClick={() => {
                          if (newPoint.facilities.includes(facility)) {
                            setNewPoint({
                              ...newPoint,
                              facilities: newPoint.facilities.filter(f => f !== facility)
                            });
                          } else {
                            setNewPoint({
                              ...newPoint,
                              facilities: [...newPoint.facilities, facility]
                            });
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          newPoint.facilities.includes(facility)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {facility}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2">
                  <button
                    onClick={handleAddPoint}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium"
                  >
                    Add Collection Point
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Details Section */}
          <div className="space-y-6">
            {selectedPoint && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{selectedPoint.name}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-green-100 p-2 rounded-full">
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
                          className="text-green-600"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-500 mb-1">Address</h4>
                        <p className="text-gray-800">{selectedPoint.address}</p>
                        <p className="text-gray-500 text-sm mt-1">{selectedPoint.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-green-100 p-2 rounded-full">
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
                          className="text-green-600"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-500 mb-1">Contact</h4>
                        <p className="text-gray-800">{selectedPoint.contact}</p>
                        <p className="text-gray-800">{selectedPoint.email}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-green-100 p-2 rounded-full">
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
                          className="text-green-600"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-500 mb-1">Operating Hours</h4>
                        <p className="text-gray-800">{selectedPoint.hours}</p>
                        <p className="text-gray-500 text-sm mt-1">{selectedPoint.days}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
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
                          className="text-green-600"
                        >
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-500 mb-1">Facilities</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedPoint.facilities.map((facility, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {facility}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add Product Form */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-4">Add New Product</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="e.g., Organic Tomatoes"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={newProduct.quantity}
                        onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                        placeholder="e.g., 100"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={newProduct.unit}
                        onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                      >
                        <option>kg</option>
                        <option>tons</option>
                        <option>lbs</option>
                        <option>pieces</option>
                        <option>crates</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quality Grade</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={newProduct.grade}
                        onChange={(e) => setNewProduct({...newProduct, grade: e.target.value})}
                      >
                        <option>Grade A</option>
                        <option>Grade B</option>
                        <option>Grade C</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (per unit)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">₹</span>
                        <input
                          type="number"
                          className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                          placeholder="e.g., 50"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <button
                      onClick={handleAddProduct}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium"
                    >
                      Add Product
                    </button>
                  </div>
                </div>

                {/* Products Section */}
                {selectedPoint.products && selectedPoint.products.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-4">Available Products</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedPoint.products.map((product, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.grade}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button 
                    onClick={() => openGoogleMaps(selectedPoint.address)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-3 font-medium flex items-center justify-center gap-2"
                  >
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
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Get Directions on Google Maps
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
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
                <span className="font-bold text-lg text-white">Innovest AgriChain</span>
              </div>
              <p className="text-sm mb-4">
                Revolutionizing agricultural supply chains through blockchain technology and smart solutions.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Solutions</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-sm hover:text-white">Farmers</a></li>
                <li><a href="#" className="text-sm hover:text-white">Distributors</a></li>
                <li><a href="#" className="text-sm hover:text-white">Retailers</a></li>
                <li><a href="#" className="text-sm hover:text-white">Consumers</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-sm hover:text-white">About</a></li>
                <li><a href="#" className="text-sm hover:text-white">Blog</a></li>
                <li><a href="#" className="text-sm hover:text-white">Careers</a></li>
                <li><a href="#" className="text-sm hover:text-white">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-sm hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-sm hover:text-white">Terms</a></li>
                <li><a href="#" className="text-sm hover:text-white">Cookie Policy</a></li>
                <li><a href="#" className="text-sm hover:text-white">GDPR</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-xs text-gray-400 text-center">
              &copy; {new Date().getFullYear()} Innovest AgriChain. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}