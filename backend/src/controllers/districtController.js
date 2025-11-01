import * as dbServices from '../services/dbServices.js'
import { cacheGet, cacheSet } from '../utils/cache.js'

export async function getDistricts(req, res) {
  try {
    const cacheKey = 'districts'
    let districts = await cacheGet(cacheKey)

    if (!districts) {
      districts = await dbServices.getDistricts()
      await cacheSet(cacheKey, districts)
    }

    res.json(districts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}