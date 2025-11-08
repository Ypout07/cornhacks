import { ArrowRight, Package, Plus, Search } from 'lucide-react';
import React from 'react';

export function LogisticsPortal({ setPage }) {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-green-50">
      <div className="w-full max-w-2xl text-center">
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-yellow-400 rounded-full mb-4">
            <Package size={48} className="text-yellow-900" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🍌 Banana Blockchain
          </h1>
          <p className="text-xl text-gray-600">
            Transparent, verifiable produce tracking from farm to table
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => setPage('producer')}
            className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <div className="flex items-center justify-center mb-4">
              <Plus size={48} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Producer</h2>
            <p className="text-gray-600 mb-4">
              Create new batches and record transfers as produce moves through the supply chain
            </p>
            <div className="flex items-center justify-center text-green-600 font-semibold">
              Get Started <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
          
          <button
            onClick={() => setPage('customer')}
            className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <div className="flex items-center justify-center mb-4">
              <Search size={48} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Customer</h2>
            <p className="text-gray-600 mb-4">
              Verify the complete journey of your produce with full blockchain transparency
            </p>
            <div className="flex items-center justify-center text-blue-600 font-semibold">
              Track Batch <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}