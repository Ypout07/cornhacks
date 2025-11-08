// ============================================================================
// LogisticsPortal.jsx
// ============================================================================
import { ArrowRight, Package, Plus, Search } from 'lucide-react';
import React from 'react';

export function LogisticsPortal({ setPage }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 p-6">
      <div className="w-full max-w-5xl mx-auto">
        {/* Icon and Title - Centered */}
        <div className="flex flex-col items-center text-center space-y-6 mb-12">
          <div className="inline-flex p-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl shadow-2xl transform hover:rotate-6 transition-transform duration-300">
            <Package size={64} className="text-yellow-900" />
          </div>
          <h1 className="text-6xl font-extrabold text-gray-800 tracking-tight">
            🍌 Banana Blockchain
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Transparent, verifiable produce tracking from farm to table
          </p>
        </div>

        {/* Buttons - Centered Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <button
            onClick={() => setPage('producer')}
            className="group flex flex-col items-center justify-center p-10 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-gray-100"
          >
            <div className="p-4 bg-green-50 rounded-2xl mb-5 group-hover:bg-green-100 transition-colors duration-300">
              <Plus size={52} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Producer</h2>
            <p className="text-gray-600 mb-6 text-center leading-relaxed px-2">
              Create new batches and record transfers as produce moves through the supply chain
            </p>
            <div className="flex items-center justify-center text-green-600 font-semibold text-lg">
              Get Started <ArrowRight size={22} className="ml-2 transition-transform group-hover:translate-x-2" />
            </div>
          </button>

          <button
            onClick={() => setPage('customer')}
            className="group flex flex-col items-center justify-center p-10 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-gray-100"
          >
            <div className="p-4 bg-blue-50 rounded-2xl mb-5 group-hover:bg-blue-100 transition-colors duration-300">
              <Search size={52} className="text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Customer</h2>
            <p className="text-gray-600 mb-6 text-center leading-relaxed px-2">
              Verify the complete journey of your produce with full blockchain transparency
            </p>
            <div className="flex items-center justify-center text-blue-600 font-semibold text-lg">
              Track Batch <ArrowRight size={22} className="ml-2 transition-transform group-hover:translate-x-2" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}