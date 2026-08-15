import axios from 'axios';

// Separate client for AI service auth endpoints
// The AI service handles full auth including OTP, password reset, etc.
export const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';

const aiClient = axios.create({
  baseURL: `${AI_SERVICE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' }
});

export default aiClient;
