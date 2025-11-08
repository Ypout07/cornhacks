// ============================================================================
// LogisticsPortal.jsx
// ============================================================================
import { ArrowRight, Package, Plus, Search } from 'lucide-react';
import React from 'react';

export function LogisticsPortal({ setPage }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-amber-50 via-yellow-100 to-green-100 p-6">
      <div className="w-full max-w-6xl mx-auto">
        {/* Icon and Title - Centered with Animation */}
        <div className="flex flex-col items-center text-center space-y-8 mb-16 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative inline-flex p-10 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 rounded-full shadow-2xl">
              <Package size={72} className="text-white drop-shadow-lg" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-green-600 to-emerald-600 drop-shadow-sm">
              🍌 Banana Blockchain
            </h1>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-yellow-400 to-green-500 rounded-full"></div>
          </div>
          <p className="text-2xl text-gray-700 max-w-3xl font-medium leading-relaxed">
            Transparent, verifiable produce tracking from farm to table
          </p>
        </div>

        {/* Buttons - Enhanced Cards */}
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <button
            onClick={() => setPage('producer')}
            className="group relative flex flex-col items-center justify-center p-12 bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-2xl hover:shadow-green-200 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border-2 border-green-100 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 to-green-500/0 group-hover:from-green-400/5 group-hover:to-green-500/10 transition-all duration-500"></div>
            <div className="relative p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Plus size={56} className="text-white" strokeWidth={2.5} />
            </div>
            <h2 className="relative text-4xl font-black text-gray-800 mb-4 group-hover:text-green-700 transition-colors">Producer</h2>
            <p className="relative text-gray-600 text-lg mb-8 text-center leading-relaxed px-4 max-w-sm">
              Create new batches and record transfers as produce moves through the supply chain
            </p>
            <div className="relative flex items-center justify-center text-green-600 font-bold text-xl group-hover:gap-4 gap-2 transition-all duration-300">
              Get Started 
              <div className="bg-green-100 rounded-full p-2 group-hover:bg-green-200 transition-colors">
                <ArrowRight size={24} className="transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
              </div>
            </div>
          </button>

          <button
            onClick={() => setPage('customer')}
            className="group relative flex flex-col items-center justify-center p-12 bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl hover:shadow-blue-200 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border-2 border-blue-100 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-blue-500/0 group-hover:from-blue-400/5 group-hover:to-blue-500/10 transition-all duration-500"></div>
            <div className="relative p-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Search size={56} className="text-white" strokeWidth={2.5} />
            </div>
            <h2 className="relative text-4xl font-black text-gray-800 mb-4 group-hover:text-blue-700 transition-colors">Customer</h2>
            <p className="relative text-gray-600 text-lg mb-8 text-center leading-relaxed px-4 max-w-sm">
              Verify the complete journey of your produce with full blockchain transparency
            </p>
            <div className="relative flex items-center justify-center text-blue-600 font-bold text-xl group-hover:gap-4 gap-2 transition-all duration-300">
              Track Batch
              <div className="bg-blue-100 rounded-full p-2 group-hover:bg-blue-200 transition-colors">
                <ArrowRight size={24} className="transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}