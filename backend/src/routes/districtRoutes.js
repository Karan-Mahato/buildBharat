import express from 'express';
import * as districtController from '../controllers/districtController.js';

const router = express.Router();

// ===== New Multi-State Endpoints =====

/**
 * GET /api/states
 * Fetches all available states
 * Response: ["Jharkhand", "Bihar", "Andhra Pradesh", ...]
 */
router.get('/states', districtController.getStates);

/**
 * GET /api/states/:stateName/districts
 * Fetches all districts for a specific state
 * Response: ["RANCHI", "DHANBAD", "BOKARO", ...]
 */
router.get('/states/:stateName/districts', districtController.getDistrictsByState);

/**
 * GET /api/states/:stateName/districts/:districtName
 * Fetches detailed data for a specific district in a state
 * Response: { id, state_name, district_name, data, last_updated }
 */
router.get('/states/:stateName/districts/:districtName', districtController.getDistrictDataByStateAndDistrict);

// ===== Legacy Endpoints (Backward Compatibility) =====

/**
 * GET /api/districts
 * Legacy endpoint - fetches all districts (deprecated, use /states)
 */
router.get('/districts', districtController.getDistricts);

/**
 * GET /api/districts/:districtName
 * Legacy endpoint - fetches data for a district by name (deprecated, use /states/{state}/districts/{district})
 */
router.get('/districts/:districtName', districtController.getDistrictData);

export default router;