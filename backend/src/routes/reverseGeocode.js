import express from "express";
import axios from "axios";

const router = express.Router();

/**
 * Proxy endpoint for reverse geocoding using Nominatim.
 * Query parameters: lat, lon
 * Returns the raw Nominatim JSON to the client. CORS is handled by the main app.
 * Note: set NOMINATIM_USER_AGENT in env to a value like 'your-app-name/1.0 (your-email)'
 */
router.get("/", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: "lat and lon required" });

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(
      lat
    )}&lon=${encodeURIComponent(lon)}&zoom=10&addressdetails=1`;

    const headers = {
      // Nominatim requests that clients identify themselves via User-Agent or Referer.
      // Browsers cannot set User-Agent, so we make the server do it. Set an env var for contact.
      "User-Agent": process.env.NOMINATIM_USER_AGENT || "buildBharat/1.0 (+https://example.com)",
      Accept: "application/json",
    };

    const resp = await axios.get(url, { headers, timeout: 8000 });

    // Forward the data
    res.json(resp.data);
  } catch (err) {
    console.error("Reverse geocode failed:", err?.message || err);
    res.status(502).json({ error: "Reverse geocode failed", details: err?.message || String(err) });
  }
});

export default router;
