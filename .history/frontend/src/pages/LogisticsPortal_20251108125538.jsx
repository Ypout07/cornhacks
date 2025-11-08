// ============================================================================
// LogisticsPortal.jsx
// ============================================================================
import { ArrowRight, Package, Plus, Search } from 'lucide-react';
import React from 'react';

export function LogisticsPortal({ setPage }) {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-yellow-50 to-green-50 p-4">
      <div className="w-full max-w-4xl text-center space-y-6">
        {/* Icon and Title */}
        <div className="inline-block p-6 bg-yellow-400 rounded-full shadow-lg">
          <Package size={56} className="text-yellow-900" />
        </div>
        <h1 className="text-5xl font-extrabold text-gray-800">
          🍌 Banana Blockchain
        </h1>
        <p className="text-xl text-gray-600">
          Transparent, verifiable produce tracking from farm to table
        </p>

        {/* Buttons */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <button
            onClick={() => setPage('producer')}
            className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
          >
            <Plus size={48} className="text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Producer</h2>
            <p className="text-gray-600 mb-4 text-center">
              Create new batches and record transfers as produce moves through the supply chain
            </p>
            <div className="flex items-center justify-center text-green-600 font-semibold">
              Get Started <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          <button
            onClick={() => setPage('customer')}
            className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
          >
            <Search size={48} className="text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Customer</h2>
            <p className="text-gray-600 mb-4 text-center">
              Verify the complete journey of your produce with full blockchain transparency
            </p>
            <div className="flex items-center justify-center text-blue-600 font-semibold">
              Track Batch <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
