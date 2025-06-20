"use client"
import Link from "next/link";
import { ethers } from "ethers";
import Footer from "../../components/Footer/page";
import { useState, useEffect, useCallback } from "react"; // Added useEffect, useCallback
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
export default function FarmerDashboard() {



  const contractAddress = "0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4"; // Make sure this is your deployed ProductRegistry address
  const contractABI = [ // This ABI should match your ProductRegistry contract
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "farmerId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "productType",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "productName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "harvestDate",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "quantity",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "addedBy",
          "type": "address"
        }
      ],
      "name": "ProductAdded",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_farmerId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_productType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_productName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_harvestDate",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_quantity",
          "type": "string"
        }
      ],
      "name": "addProduct",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getProduct",
      "outputs": [
        {
          "internalType": "string",
          "name": "farmerId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "productType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "productName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "harvestDate",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "quantity",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getProductCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
    // The 'products' public array getter is implicitly part of the ABI if you compile
    // but it's usually better to use specific getter functions like getProduct.
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // State for displaying products
  const [recentProducts, setRecentProducts] = useState([]);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [fetchProductsError, setFetchProductsError] = useState("");

  // Helper to format Solidity timestamp (seconds) to readable date
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  const fetchRecentProducts = useCallback(async () => {
    setIsFetchingProducts(false);
    setFetchProductsError("");
    // setRecentProducts([]); // Optionally clear while fetching

    try {
      let provider;
      if (typeof window.ethereum !== "undefined") {
        provider = new ethers.BrowserProvider(window.ethereum);
      } else {
        // For read-only, you could use a JsonRpcProvider with a public RPC URL
        // provider = new ethers.JsonRpcProvider("YOUR_PUBLIC_RPC_URL_HERE");
        // However, if no wallet, many operations might be limited.
        // For now, we'll assume MetaMask or similar is needed for this page to be fully functional.
        setFetchProductsError("MetaMask not found. Please install MetaMask to interact with the blockchain.");
        setIsFetchingProducts(false);
        return;
      }

      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const countBigInt = await contract.getProductCount();
      const count = Number(countBigInt);

      if (count === 0) {
        setRecentProducts([]);
        setIsFetchingProducts(false);
        return;
      }

      const productsToFetch = [];
      const numToDisplay = Math.min(count, 5); // Display last 5 products or fewer

      for (let i = 0; i < numToDisplay; i++) {
        const productIndex = count - 1 - i; // Fetch in reverse order (newest first)
        if (productIndex < 0) break;

        try {
          // getProduct returns a tuple, ethers.js v6 returns an array-like object (Result)
          // with named properties and indexed properties.
          const productData = await contract.getProduct(productIndex);
          productsToFetch.push({
            farmerId: productData.farmerId,
            productType: productData.productType,
            productName: productData.productName,
            harvestDate: productData.harvestDate,
            quantity: productData.quantity,
            timestamp: productData.timestamp,
            id: productIndex, // Unique key for React list
          });
        } catch (e) {
          console.warn(`Failed to fetch product at index ${productIndex}:`, e);
          // Optionally, display a partial list or an error for specific items
        }
      }
      setRecentProducts(productsToFetch);

    } catch (error) {
      console.error("Failed to fetch recent products:", error);
      setFetchProductsError("Could not load recent products. Ensure you are on the correct network. " + (error.message || ""));
    } finally {
      setIsFetchingProducts(false);
    }
  }, [contractAddress, contractABI]); // Dependencies for useCallback

  useEffect(() => {
    fetchRecentProducts();
  }, [fetchRecentProducts]); // Fetch on mount and when fetchRecentProducts changes (due to its own deps)


  async function handleSubmitToBlockchain(event) {
    event.preventDefault();
    setStatusMessage("");
    setIsError(false);

    const form = event.target;
    const formData = {
      farmerId: form.farmerId.value.trim(),
      productType: form.productType.value,
      productName: form.productName.value.trim(),
      harvestDate: form.harvestDate.value,
      quantity: form.productQuantity.value.trim()
    };

    if (!formData.farmerId || !formData.productName || !formData.quantity) {
        setStatusMessage("Farmer ID, Product Name, and Quantity are required.");
        setIsError(true);
        return;
    }

    setIsLoading(true);
    setStatusMessage("Connecting to wallet...");

    try {
      if (typeof window.ethereum === "undefined") {
        setStatusMessage("Please install MetaMask or another Ethereum-compatible wallet!");
        setIsError(true);
        setIsLoading(false);
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      setStatusMessage("Submitting product details to the blockchain... Please confirm in your wallet.");
      const tx = await contract.addProduct(
        formData.farmerId,
        formData.productType,
        formData.productName,
        formData.harvestDate,
        formData.quantity
      );

      setStatusMessage("Transaction submitted. Waiting for confirmation...");
      await tx.wait();

      setStatusMessage("Product details added to blockchain successfully!");
      setIsError(false);
      form.reset();
      fetchRecentProducts(); // Refresh product list after successful addition

    } catch (error) {
      console.error("Blockchain transaction failed:", error);
      let friendlyMessage = "Failed to submit data to blockchain.";
      if (error.code === 4001) {
        friendlyMessage = "Transaction rejected by user.";
      } else if (error.code === -32002 || (error.info && error.info.error && error.info.error.code === -32002) ) {
        friendlyMessage = "MetaMask request already pending. Please check your MetaMask extension.";
      } else if (error.message) {
        if (error.message.toLowerCase().includes("insufficient funds")) {
            friendlyMessage = "Insufficient funds for transaction.";
        } else if (error.message.toLowerCase().includes("user denied account authorization") || (error.info && error.info.error && error.info.error.message.toLowerCase().includes("user rejected the request"))) {
            friendlyMessage = "Wallet connection or transaction denied by user.";
        }
      }
      const reason = error.reason || (error.data ? error.data.message : (error.info && error.info.error ? error.info.error.message : null));
      setStatusMessage(friendlyMessage + (reason && !friendlyMessage.includes(reason) ? ` Reason: ${reason}` : ''));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

   // Add warehouse-related state
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);

   // Mock data for warehouses - in a real app, this would come from a smart contract or API
  const mockWarehouses = [
    { id: "WH-001", name: "Cold Storage North", location: "Nairobi", capacity: "1000 tons", available: true },
    { id: "WH-002", name: "Dry Storage Central", location: "Mombasa", capacity: "800 tons", available: true },
    { id: "WH-003", name: "Organic Storage West", location: "Kisumu", capacity: "500 tons", available: false },
    { id: "WH-004", name: "Premium Storage East", location: "Nakuru", capacity: "1200 tons", available: true },
  ];

  // Function to fetch warehouses (in a real app, this would be from blockchain)
  const fetchWarehouses = useCallback(async () => {
    try {
      // Simulate API/blockchain call
      setTimeout(() => {
        setWarehouses(mockWarehouses.filter(wh => wh.available));
      }, 500);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      setWarehouses([]);
    }
  }, []);

  // Function to handle warehouse request
  const handleWarehouseRequest = async () => {
    if (!selectedWarehouse) {
      setRequestMessage("Please select a warehouse");
      return;
    }

    setIsRequesting(true);
    setRequestMessage("Processing request...");

    try {
      // In a real app, this would call a smart contract function
      // Simulate blockchain transaction
      setTimeout(() => {
        setRequestMessage(`Success! Request sent to ${selectedWarehouse}`);
        setIsRequesting(false);
        setSelectedWarehouse("");
        // Refresh warehouse list after request
        fetchWarehouses();
      }, 2000);
    } catch (error) {
      console.error("Warehouse request failed:", error);
      setRequestMessage("Failed to send request. Please try again.");
      setIsRequesting(false);
    }
  };
  //sensor data

const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSheetData = async () => {
      const res = await fetch("https://script.google.com/macros/s/AKfycbxm1V-sNB2PiwhlPsaVZLIDE3BYkAHdkBbwIr3hiYi26FZ5TGtTnZRohnWmMmhgc1vK/exec?type=json");
      const json = await res.json();

      const parsed = json.map(entry => ({
        ...entry,
        timestamp: new Date(entry.timestamp).toLocaleTimeString(),
        temperature: Number(entry.temperature),
        humidity: Number(entry.humidity),
        soil: Number(entry.soil),
        rain: Number(entry.rain),
      }));

      setData(parsed);
    };

    fetchSheetData();
    const interval = setInterval(fetchSheetData, 10000); // refresh every 30 sec
    return () => clearInterval(interval);
  }, []);

  const graphBlock = (title, color, dataKey) => (
    <div className="w-full h-[300px] p-4">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="w-full py-4 px-6 md:px-12 lg:px-20 bg-white">
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
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium">
              About
            </Link>
            <Link href="/features" className="text-sm font-medium">
              Features
            </Link>
            <button className="bg-black text-white hover:bg-gray-800 rounded-full px-6">Dashboard</button>
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

      {/* Farmer Dashboard Hero */}
      <section className="bg-green-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Farmer Dashboard
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Manage your farm's supply chain data, track shipments, and receive instant payments—all in one secure blockchain-powered platform.
              </p>
              <div className="flex gap-4">
                <Link href="/register-farm" className="bg-green-600 text-white hover:bg-green-700 rounded-full px-6 py-3 text-sm font-semibold">
                  Register Farm
                </Link>
                <Link href="#scan-section" className="bg-white text-green-600 hover:bg-gray-100 rounded-full px-6 py-3 text-sm font-semibold border border-green-600">
                  Register Product
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://unsplash.com/photos/young-farmer-standing-in-filed-holding-tablet-in-his-hands-and-examining-soybean-corp-wIynk--twug"
                alt="Farmer using AgriChain"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      <section id="scan-section" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="bg-green-50 p-8 rounded-xl shadow-sm border border-green-100">
            <div className="pt-6"> {/* Removed border-t if it's the first element now */}
              <h3 className="text-lg font-semibold text-gray-800 mb-4"> Enter Product Details </h3>
              <form className="space-y-4" onSubmit={handleSubmitToBlockchain}>
                <div>
                  <label htmlFor="farmer-id" className="block text-sm font-medium text-gray-700 mb-1"> Farmer ID * </label>
                  <input type="text" id="farmer-id" name="farmerId" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" placeholder="e.g., FARMER001" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="product-type" className="block text-sm font-medium text-gray-700 mb-1"> Product Type </label>
                    <select id="product-type" name="productType" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" > <option value="">Select product type</option> <option value="grains">Grains</option> <option value="vegetables">Vegetables</option> <option value="fruits">Fruits</option> <option value="dairy">Dairy</option> <option value="meat">Meat</option> <option value="other">Other</option> </select>
                  </div>
                  <div>
                    <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1"> Product Name * </label>
                    <input type="text" id="product-name" name="productName" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" placeholder="e.g., Organic Apples" />
                  </div>
                  <div>
                    <label htmlFor="harvest-date" className="block text-sm font-medium text-gray-700 mb-1"> Harvest Date </label>
                    <input type="date" id="harvest-date" name="harvestDate" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
                  </div>
                  <div>
                    <label htmlFor="product-quantity" className="block text-sm font-medium text-gray-700 mb-1"> Product Quantity * </label>
                    <input type="text" id="product-quantity" name="productQuantity" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" placeholder="e.g., 100 kg" />
                  </div>
                </div>
                {statusMessage && ( <div className={`mt-4 p-3 rounded-md text-sm ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}> {statusMessage} </div> )}
                <div> <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white hover:bg-green-700 rounded-lg px-6 py-3 text-base font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" > {isLoading ? "Submitting..." : "Add Product to Blockchain"} </button> </div>
              </form>
            </div>
          </div>
          

          
          {/* Recently Added Products - DYNAMIC */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recently Added Products</h3>
            <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100">
                {isFetchingProducts && <p className="text-center text-gray-600 py-4">Loading products...</p>}
                {fetchProductsError && <p className="text-center text-red-600 py-4">{fetchProductsError}</p>}
                {!isFetchingProducts && !fetchProductsError && recentProducts.length === 0 && (
                    <p className="text-center text-gray-600 py-4">No products found on the blockchain yet.</p>
                )}
                {!isFetchingProducts && !fetchProductsError && recentProducts.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date Added</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Product Name</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Farmer ID</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentProducts.map((product) => (
                                    <tr key={product.id} className="border-b hover:bg-green-100">
                                        <td className="py-3 px-4 text-sm text-gray-700">{formatTimestamp(product.timestamp)}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{product.productName}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{product.farmerId}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{product.productType || 'N/A'}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{product.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="mt-4 text-center">
                    <button
                        onClick={fetchRecentProducts}
                        disabled={isFetchingProducts}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded disabled:opacity-50"
                    >
                        {isFetchingProducts ? 'Refreshing...' : 'Refresh Products'}
                    </button>
                </div>
            </div>
          </div>
        </div>
      </section>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {graphBlock("Live Temperature", "#FF5733", "temperature")}
      {graphBlock("Live Humidity", "#2980b9", "humidity")}
      {graphBlock("Live Soil Moisture", "#27ae60", "soil")}
      {graphBlock("Live Rain Level", "#8e44ad", "rain")}
    </div>

      {/* Warehouse Request Section */}
  <section className="py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Warehouse Services</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Store your harvest in certified warehouses with optimal conditions and full traceability.
        </p>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Need Storage Space?</h3>
            <p className="text-gray-600 mt-2">
              Request space in our network of certified warehouses with temperature control and real-time monitoring.
            </p>
          </div>
          <button 
            onClick={() => {
              setShowWarehouseModal(true);
              fetchWarehouses();
            }}
            className="bg-green-600 text-white hover:bg-green-700 rounded-full px-8 py-3 text-base font-semibold whitespace-nowrap"
          >
            Request Warehouse
          </button>
        </div>

        {/* Warehouse Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <h4 className="font-semibold mb-2">Secure Storage</h4>
            <p className="text-sm text-gray-600">24/7 monitored facilities with controlled access</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>
            </div>
            <h4 className="font-semibold mb-2">Optimal Conditions</h4>
            <p className="text-sm text-gray-600">Temperature and humidity controlled environments</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <h4 className="font-semibold mb-2">Instant Booking</h4>
            <p className="text-sm text-gray-600">Reserve space instantly with smart contracts</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Warehouse Modal */}
  {showWarehouseModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Request Warehouse Space</h3>
            <button 
              onClick={() => setShowWarehouseModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold mb-3">Available Warehouses</h4>
            {warehouses.length === 0 ? (
              <p className="text-gray-500 py-4">No available warehouses found. Please check back later.</p>
            ) : (
              <div className="space-y-3">
                {warehouses.map(warehouse => (
                  <div 
                    key={warehouse.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedWarehouse === warehouse.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    onClick={() => setSelectedWarehouse(warehouse.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">{warehouse.name}</h5>
                        <p className="text-sm text-gray-600">{warehouse.location} • {warehouse.capacity}</p>
                      </div>
                      {selectedWarehouse === warehouse.id && (
                        <div className="bg-green-100 text-green-800 rounded-full p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {requestMessage && (
            <div className={`mb-4 p-3 rounded-md ${requestMessage.includes("Success") ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {requestMessage}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowWarehouseModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleWarehouseRequest}
              disabled={isRequesting || !selectedWarehouse}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRequesting ? "Sending Request..." : "Confirm Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

      {/* Farmer Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="text-3xl font-bold text-center mb-12">What You Can Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Register Farm */}
            <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
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
              <h3 className="text-xl font-semibold mb-2">Register Farm</h3>
              <p className="text-gray-600 mb-4">
                Securely register your farm on the blockchain with verified location and certification data.
              </p>
              <Link href="/register-farm" className="text-green-600 font-medium text-sm">
                Get Started →
              </Link>
            </div>

            {/* Feature 2: Log Harvest */}
            <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
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
                  <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                  <path d="M8.5 8.5v.01" />
                  <path d="M16 15.5v.01" />
                  <path d="M12 12v.01" />
                  <path d="M11 17v.01" />
                  <path d="M7 14v.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Log Harvest Data</h3>
              <p className="text-gray-600 mb-4">
                Record harvest details (batch, weight, quality) immutably on-chain for full traceability.
              </p>
              <Link href="/log-harvest" className="text-green-600 font-medium text-sm">
                Log Now →
              </Link>
            </div>

            {/* Feature 3: Track Shipments */}
            <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
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
                  <path d="M3 3h18v18H3z" />
                  <path d="M12 8v8" />
                  <path d="M8 12h8" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Shipments</h3>
              <p className="text-gray-600 mb-4">
                Monitor real-time location and condition of your products as they move through the supply chain.
              </p>
              <Link href="/track-shipments" className="text-green-600 font-medium text-sm">
                View Map →
              </Link>
            </div>

            {/* Feature 4: Smart Payments */}
            {/* <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
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
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 16h5v5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Payments</h3>
              <p className="text-gray-600 mb-4">
                Receive instant payments via smart contracts when buyers confirm delivery.
              </p>
              <Link href="/payments" className="text-green-600 font-medium text-sm">
                View Wallet →
              </Link>
            </div> */}

            {/* Feature 5: Verify Buyers */}
            {/* <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
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
              <h3 className="text-xl font-semibold mb-2">Verify Buyers</h3>
              <p className="text-gray-600 mb-4">
                Check buyer authenticity and transaction history before selling.
              </p>
              <Link href="/verify-buyers" className="text-green-600 font-medium text-sm">
                Check Now →
              </Link>
            </div> */}

            {/* Feature 6: Sustainability Credits */}
            {/* <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
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
                  <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                  <path d="M8.5 8.5v.01" />
                  <path d="M16 15.5v.01" />
                  <path d="M12 12v.01" />
                  <path d="M11 17v.01" />
                  <path d="M7 14v.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn Carbon Credits</h3>
              <p className="text-gray-600 mb-4">
                Get rewarded for sustainable farming practices with tokenized carbon credits.
              </p>
              <Link href="/sustainability" className="text-green-600 font-medium text-sm">
                Learn More →
              </Link>
            </div> */}
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      {/* <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="text-3xl font-bold mb-8">Recent Activity</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Batch ID</th>
                    <th className="text-left py-3 px-4">Product</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">#FARM-7890</td>
                    <td className="py-3 px-4">Organic Wheat</td>
                    <td className="py-3 px-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Shipped
                      </span>
                    </td>
                    <td className="py-3 px-4">June 5, 2024</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">#FARM-7889</td>
                    <td className="py-3 px-4">Organic Corn</td>
                    <td className="py-3 px-4">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                        Pending Payment
                      </span>
                    </td>
                    <td className="py-3 px-4">June 3, 2024</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">#FARM-7885</td>
                    <td className="py-3 px-4">Soybeans</td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        Payment Received
                      </span>
                    </td>
                    <td className="py-3 px-4">May 28, 2024</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="bg-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Help?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our team is here to assist you with onboarding, data logging, and smart contract setup.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-700 hover:bg-gray-100 rounded-full px-8 py-6 text-base">
              Contact Support
            </button>
            <button className="border-white text-white hover:bg-green-600 rounded-full px-8 py-6 text-base">
              Watch Tutorial
            </button>
          </div>
        </div>
      </section> */}

      {/* Footer (Same as Homepage) */}
      {/* <footer className="bg-gray-900 text-gray-300 py-12">
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
                  <Link href="#">Features</Link>
                </li>
                <li>
                  <Link href="#">Pricing</Link>
                </li>
                <li>
                  <Link href="#">Case Studies</Link>
                </li>
                <li>
                  <Link href="#">Documentation</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#">About Us</Link>
                </li>
                <li>
                  <Link href="#">Careers</Link>
                </li>
                <li>
                  <Link href="#">Blog</Link>
                </li>
                <li>
                  <Link href="#">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="#">Terms of Service</Link>
                </li>
                <li>
                  <Link href="#">Cookie Policy</Link>
                </li>
                <li>
                  <Link href="#">GDPR Compliance</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2024 Innovest AgriChain. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" aria-label="Twitter">
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
              <Link href="#" aria-label="LinkedIn">
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
              <Link href="#" aria-label="GitHub">
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
      </footer> */}
      <Footer></Footer>
    </div>
  );
}