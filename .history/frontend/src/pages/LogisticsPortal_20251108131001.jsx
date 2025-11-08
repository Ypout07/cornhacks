// ============================================================================
// LogisticsPortal.jsx
// ============================================================================
import { ArrowRight, Package, Plus, Search } from 'lucide-react';
import React from 'react';

export function LogisticsPortal({ setPage }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-yellow-50 p-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Icon and Title - Centered */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="mb-8 p-12 bg-yellow-400 rounded-full shadow-2xl">
            <Package size={80} className="text-yellow-900" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            🍌 Banana Blockchain
          </h1>
          <div className="w-24 h-1 bg-yellow-500 rounded mb-6"></div>
          <p className="text-2xl text-gray-700 max-w-3xl">
            Transparent, verifiable produce tracking from farm to table
          </p>
        </div>

        {/* Buttons - Enhanced Cards */}
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <button
            onClick={() => setPage('producer')}
            className="group flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-2xl hover:shadow-green-300 border-4 border-green-200"
          >
            <div className="p-8 bg-green-500 rounded-3xl mb-8 shadow-xl">
              <Plus size={64} className="text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Producer</h2>
            <p className="text-gray-700 text-lg mb-8 text-center px-4">
              Create new batches and record transfers as produce moves through the supply chain
            </p>
            <div className="flex items-center text-green-600 font-bold text-xl">
              Get Started 
              <div className="ml-3 bg-green-200 rounded-full p-3">
                <ArrowRight size={24} />
              </div>
            </div>
          </button>

          <button
            onClick={() => setPage('customer')}
            className="group flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-2xl hover:shadow-blue-300 border-4 border-blue-200"
          >
            <div className="p-8 bg-blue-500 rounded-3xl mb-8 shadow-xl">
              <Search size={64} className="text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Customer</h2>
            <p className="text-gray-700 text-lg mb-8 text-center px-4">
              Verify the complete journey of your produce with full blockchain transparency
            </p>
            <div className="flex items-center text-blue-600 font-bold text-xl">
              Track Batch
              <div className="ml-3 bg-blue-200 rounded-full p-3">
                <ArrowRight size={24} />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}