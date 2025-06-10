"use client"
import Link from "next/link";
import { ethers } from "ethers";
import { useState, useEffect, useCallback } from "react"; // Added useEffect, useCallback

export default function ScanProduct() {
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="w-full py-4 px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-green-600 rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" > <path d="M12 2a10 10 0 1 0 10 10H12V2z" /> <path d="M21 12a9 9 0 0 0-9-9v9h9z" /> </svg>
            </div>
            <span className="font-bold text-lg">Innovest AgriChain</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium"> Home </Link>
            <Link href="/about" className="text-sm font-medium"> About </Link>
            <Link href="/features" className="text-sm font-medium"> Features </Link>
            <Link href="/farmer-dashboard" className="bg-black text-white hover:bg-gray-800 rounded-full px-6 py-2 text-sm" > Dashboard </Link>
          </nav>
          <button className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" > <line x1="4" x2="20" y1="12" y2="12" /> <line x1="4" x2="20" y1="6" y2="6" /> <line x1="4" x2="20" y1="18" y2="18" /> </svg>
          </button>
        </div>
      </header>

      {/* Scan Product Hero Section */}
      <section className="bg-green-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"> Register Product </h1>
              <div className="flex gap-4">
                <Link href="#scan-section" className="bg-green-600 text-white hover:bg-green-700 rounded-full px-6 py-3 text-sm font-semibold" > Enter Details Below </Link>
                <Link href="/farmer-dashboard" className="bg-white text-green-600 hover:bg-gray-100 rounded-full px-6 py-3 text-sm font-semibold border border-green-600" > Back to Dashboard </Link>
              </div>
            </div>
            <div className="md:w-1/2"> {/* Image placeholder */} </div>
          </div>
        </div>
      </section>

      {/* Scan Section */}
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
          
          {/* Scan Benefits - unchanged */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Register Products on Blockchain?</h3>
            {/* ... benefits grid ... */}
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

      {/* CTA Section & Footer - unchanged */}
      <section className="bg-green-700 text-white py-16"> {/* ... CTA ... */} </section>
      <footer className="bg-gray-900 text-gray-300 py-12"> {/* ... Footer ... */} </footer>
    </div>
  );
}