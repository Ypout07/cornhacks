// ============================================================================
// LogisticsPortal.jsx (Homepage)
// ============================================================================
import React, { useState } from "react";

export function LogisticsPortal({ setPage }) {
  const [batchId, setBatchId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!batchId.trim()) return;
    // For now, just go to the customer page
    setPage("customer");
  };

  return (
    <div className="min-h-screen bg-[#F9FAF9] flex flex-col items-center justify-center px-4">
      {/* Logo / Header */}
      <header className="absolute top-10 text-center">
        <h1 className="text-5xl font-[Playfair_Display] text-[#0B3D2E] tracking-wide">
          Banana Blockchain
        </h1>
      </header>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 text-center">
        <h2 className="text-3xl font-semibold text-[#0B3D2E] mb-6">
          Track Your Produce
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Enter Batch ID"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E] focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0B3D2E] hover:bg-[#145A43] text-white text-lg font-semibold py-3 rounded-xl transition-colors"
          >
            Track Batch
          </button>
        </form>

        <p className="mt-6 text-gray-600">
          Are you a producer?{" "}
          <button
            onClick={() => setPage("producer")}
            className="text-[#0B3D2E] font-medium hover:underline"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}
