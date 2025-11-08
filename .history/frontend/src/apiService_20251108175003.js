import axios from 'axios';

// const API_BASE_URL = 'https://cornhackshaa.onrender.com'; PRODUCTION
const API_BASE_URL = 'http://127.0.0.1:5000';

/**
 * Creates new batch. 
 * @param {object} batchData JSON object for batch data
 * @returns {object} JSON object with message
 */
export const createBatch = async (batchData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/batch`, batchData);
    return response.data; 
  } catch (error) {
    console.error("Error creating batch:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Adds a transfer step to a batch. 
 * @param {object} transferData JSON object with transfer information
 * @returns {object} completion message
 */
export const addTransfer = async (transferData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/transfer`, transferData);
    return response.data;
  } catch (error) {
    console.error("Error adding transfer:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * GET history of the batch. 
 * @param {string} batchUuid - ID of batch we are fetching
 * @returns {Array} batch history objects 
 */
export const getBatchHistory = async (batchUuid) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/batch/${batchUuid}`); // Put UUID in the URL
    return response.data;
  } catch (error) {
    console.error("Error fetching batch history:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * GET the audit report for a batch
 * @param {string} batchUuid UUID of batch
 * @returns {object} The audit report message and warnings
 */
export const getBatchHistoryAudit = async (batchUuid) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/batch/${batchUuid}/audit`); // Same idea, but with /audit endpoint
    return response.data;
  } catch (error) {
    console.error("Error fetching batch audit:", error.response?.data || error.message);
    throw error;
  }
};
