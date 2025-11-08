import axios from 'axios';

// The real URL. Leave it commented out for now.
// const API_BASE_URL = 'https://provenance-api.onrender.com';

// --- MOCK FUNCTIONS ---

export const createBatch = async (batchData) => {
  console.log("MOCK: Creating batch with:", batchData);
  // Simulate a 1-second network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return the fake data the backend WILL send
  return {
    message: "Mock batch created successfully",
    batch_uuid: "MOCK-FS-110825-A"
  };
};

export const addTransfer = async (transferData) => {
  console.log("MOCK: Adding transfer:", transferData);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return { message: "Mock transfer recorded" };
};

export const getBatchHistory = async (batchUuid) => {
  console.log("MOCK: Fetching history for:", batchUuid);
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return the fake data (the array of blocks)
  return [
    { actor_name: "Mock Farm", action: "Harvested", latitude: 10.32, longitude: -84.22, timestamp: "2025-11-08T09:30:00Z" },
    { actor_name: "Mock Distributor", action: "Received", latitude: 10.35, longitude: -84.20, timestamp: "2025-11-08T14:45:00Z" }
  ];
};

export const getBatchHistoryAudit = async (batchUuid) => {
  console.log("MOCK: Auditing history for:", batchUuid);
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return the fake audit report
  return {
    trust_score: "Verified",
    warnings: []
  };
};