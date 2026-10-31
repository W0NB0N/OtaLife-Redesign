// Extends app.json. EXPO_BASE_URL lets the showcase build serve the web app from a sub-path (/app).
module.exports = ({ config }) => ({
  ...config,
  experiments: { ...(config.experiments || {}), ...(process.env.EXPO_BASE_URL ? { baseUrl: process.env.EXPO_BASE_URL } : {}) },
});
