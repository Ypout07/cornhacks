// ============================================================================
// ProducerPortal.jsx
// ============================================================================
import { AlertCircle, CheckCircle, Plus } from "lucide-react";
import React, { useState } from "react";
import { addTransfer, createBatch, getBatchHistory, getBatchHistoryAudit } from '../apiService';

export function ProducerPortal({ setPage }) {
  const [mode, setMode] = useState("create");
  const [formData, setFormData] = useState({
    batch_uuid: "",
    actor_name: "",
    action: "",
    latitude: "",
    longitude: "",
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setMessage(null);

    if (
      (mode === "create" &&
        (!formData.actor_name ||
          !formData.action ||
          !formData.latitude ||
          !formData.longitude)) ||
      (mode === "transfer" &&
        (!formData.batch_uuid ||
          !formData.actor_name ||
          !formData.action ||
          !formData.latitude ||
          !formData.longitude))
    ) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    setLoading(true);
    try {
      if (mode === "create") {
        const data = {
          actor_name: formData.actor_name,
          action: formData.action,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        };
        const result = await apiService.createBatch(data);
        setMessage({
          type: "success",
          text: `✅ Batch created successfully! ID: ${result.batch_uuid}`,
        });
      } else {
        const data = {
          batch_uuid: formData.batch_uuid,
          actor_name: formData.actor_name,
          action: formData.action,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        };
        const result = await apiService.addTransfer(data);
        setMessage({
          type: "success",
          text: `✅ Transfer added to batch ${result.batch_uuid}`,
        });
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "❌ Something went wrong. Check the console for details.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-green-50 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {mode === "create" ? "Create New Batch" : "Add Transfer"}
          </h1>
          <button
            onClick={() => setPage("home")}
            className="text-sm text-blue-500 hover:underline"
          >
            ← Back to Home
          </button>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setMode("create")}
            className={`flex-1 py-2 rounded-lg font-semibold ${
              mode === "create"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            New Batch
          </button>
          <button
            onClick={() => setMode("transfer")}
            className={`flex-1 py-2 rounded-lg font-semibold ${
              mode === "transfer"
                ? "bg-yellow-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Add Transfer
          </button>
        </div>

        <div className="space-y-4">
          {mode === "transfer" && (
            <input
              type="text"
              name="batch_uuid"
              placeholder="Batch UUID"
              value={formData.batch_uuid}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          )}

          <input
            type="text"
            name="actor_name"
            placeholder="Actor Name"
            value={formData.actor_name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="text"
            name="action"
            placeholder="Action (e.g. Harvested, Shipped, Stored)"
            value={formData.action}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="latitude"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              name="longitude"
              placeholder="Longitude"
              value={formData.longitude}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Processing...</span>
            ) : mode === "create" ? (
              <>
                <Plus size={20} /> <span>Create Batch</span>
              </>
            ) : (
              <>
                <CheckCircle size={20} /> <span>Add Transfer</span>
              </>
            )}
          </button>

          {message && (
            <div
              className={`mt-4 p-3 rounded-lg flex items-center space-x-2 ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span>{message.text}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
