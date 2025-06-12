import Image from "next/image"
import Link from "next/link"


export default function Home() {
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

      {/* Hero Section */}
      <section className="relative w-full">
        <div className="absolute inset-0 z-0">
          <img
            src="https://steg.cepr.org/sites/default/files/styles/wysiwyg_half_image/public/2023-04/TheMacroeconomicsOfIntensiveAgriculture.jpeg?itok=WIniKmO8"
            alt="Agricultural field with tractor" className="w-full h-full z-0  object-fill  blur-[1px]"/>
          <div className="absolute inset-0 0" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-40">
          <div className="flex flex-col items-center text-center mb-12">
            

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 max-w-4xl mb-6">
              Transforming Supply Chains for a Deforestation-Free World
            </h1>

            <p className="text-lg text-white max-w-3xl mb-8">
              AgriChain empowers your business to achieve complete transparency. Track, verify, and protect every link
              in your supply chain, ensuring compliance and safeguarding the environment through innovative, data-driven
              solutions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-7 py-4 rounded-full text-sm font-bold mb-6">
                Book a demo
              </button>
              <button variant="outline" className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-7 py-4 rounded-full text-sm font-bold mb-6">
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-8xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col p-3 border-2 border-neutral-500 rounded-md shadow-lg">
              <div className="mb-4 bg-green-50 w-12 h-12 flex items-center justify-center rounded-full">
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
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Farmer</h3>
              <p className="text-gray-600 text-sm">
                Gain precise geolocation data of suppliers, providing deep insights into your supply chain and ensuring
                compliance with EUDR requirements.
              </p>
              <Link href="/farmer-dashboard" className="mt-4 bg-green-600 text-white hover:bg-green-700 rounded-full px-6 py-3 text-sm font-semibold">
                Get started
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col p-3 border-2 border-neutral-500 rounded-md shadow-lg">
              <div className="mb-4 bg-green-50 w-12 h-12 flex items-center justify-center rounded-full">
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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Collection Point</h3>
              <p className="text-gray-600 text-sm">
                Identify and evaluate environmental and deforestation risks through our advanced analytical tools
                integrated into the platform.
              </p>
              <Link href = "/collection-point" className="mt-4 bg-green-600 text-white hover:bg-green-700 rounded-full px-6 py-3 text-sm font-semibold">
                Get started
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col p-3 border-2 border-neutral-500 rounded-md shadow-lg">
              <div className="mb-4 bg-green-50 w-12 h-12 flex items-center justify-center rounded-full">
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
                  <path d="M18 16h.01" />
                  <path d="M18 20h.01" />
                  <path d="M6 12h.01" />
                  <path d="M6 16h.01" />
                  <path d="M6 20h.01" />
                  <path d="M12 12h.01" />
                  <path d="M12 16h.01" />
                  <path d="M12 20h.01" />
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Warehouse</h3>
              <p className="text-gray-600 text-sm">
                Process large datasets efficiently with the Bulk API, enabling smooth data transfer and faster analysis
                for your operations.
              </p>
              <Link href="/warehouse-dashboard" className="mt-4 bg-green-600 text-white hover:bg-green-700 rounded-full px-6 py-3 text-sm font-semibold">
                Get started
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col p-3 border-2 border-neutral-500 rounded-md shadow-lg">
              <div className="mb-4 bg-green-50 w-12 h-12 flex items-center justify-center rounded-full">
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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Processing Unit</h3>
              <p className="text-gray-600 text-sm">
                Identify and evaluate environmental and deforestation risks through our advanced analytical tools
                integrated into the platform.
              </p>
              <Link href="/processing-dashboard" className="mt-4 bg-green-600 text-white hover:bg-green-700 rounded-full px-6 py-3 text-sm font-semibold">
                Get started
              </Link>
            </div>

            {/* Feature 5 */}
            <div className="flex flex-col p-3 border-2 border-neutral-500 rounded-md shadow-lg">
              <div className="mb-4 bg-green-50 w-12 h-12 flex items-center justify-center rounded-full">
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
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M7 7h10" />
                  <path d="M7 12h10" />
                  <path d="M7 17h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Customer</h3>
              <p className="text-gray-600 text-sm">
                Your data is hosted on a secure, dedicated server, ensuring maximum protection for sensitive information
                from unauthorized access.
              </p>
              <Link href="/customer-dashboard" className="mt-4 bg-green-600 text-white hover:bg-green-700 rounded-full px-6 py-3 text-sm font-semibold">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">How does it work?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mb-12">
            AgriChain's Due Diligence platform is designed to streamline and enhance organizations' due diligence
            processes. The platform facilitates effective and efficient decision-making through blockchain-verified data
            and transparent supply chain tracking.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Supplier Onboarding</h3>
              <p className="text-gray-600">
                Register and verify all suppliers in your chain with secure blockchain identities and digital
                certificates.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Data Collection & Verification</h3>
              <p className="text-gray-600">
                Collect critical supply chain data through our mobile app or API integrations, with automated
                verification.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Risk Analysis & Reporting</h3>
              <p className="text-gray-600">
                Generate comprehensive risk assessments and compliance reports with our AI-powered analytics engine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your supply chain?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join leading agricultural businesses already using our platform to ensure compliance and sustainability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-700 hover:bg-gray-100 rounded-full px-8 py-6 text-base">
              Request a demo
            </button>
            <button
              variant="outline"
              className="border-white text-white hover:bg-green-600 rounded-full px-8 py-6 text-base"
            >
              Contact sales
            </button>
          </div>
        </div>
      </section>

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
      </footer>
    </div>
  )
}
