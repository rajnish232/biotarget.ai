// BioTarget AI Global Frontend Configuration Gateway
// Automatically reads VITE_API_URL environment parameters during deployment builds.
// Defaults to local development endpoint.

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";
