import * as dbServices from '../services/dbServices.js'
import { getCache, setCache } from '../utils/cache.js'

// ===== New Multi-State Controllers =====

export async function getStates(req, res) {
  try {
    const cacheKey = 'all_states'
    let states = await getCache(cacheKey)

    if (!states) {
      states = await dbServices.getAllStates()
      await setCache(cacheKey, states, 86400)
    }

    res.json(states)
  } catch (error) {
    console.error('Error fetching states:', error)
    res.status(500).json({ error: error.message })
  }
}

export async function getDistrictsByState(req, res) {
  try {
    const { stateName } = req.params
    
    if (!stateName) {
      return res.status(400).json({ error: 'State name is required' })
    }

    const cacheKey = `districts_${stateName}`
    let districts = await getCache(cacheKey)

    if (!districts) {
      districts = await dbServices.getDistrictsByState(stateName)
      
      if (!districts || districts.length === 0) {
        return res.status(404).json({ 
          error: `No districts found for state: ${stateName}`
        })
      }
      
      const districtNames = districts.map(d => d.district_name)
      await setCache(cacheKey, districtNames, 86400)
      districts = districtNames
    }

    res.json(districts)
  } catch (error) {
    console.error('Error fetching districts by state:', error)
    res.status(500).json({ error: error.message })
  }
}

export async function getDistrictDataByStateAndDistrict(req, res) {
  try {
    const { stateName, districtName } = req.params
    
    if (!stateName || !districtName) {
      return res.status(400).json({ 
        error: 'Both state name and district name are required' 
      })
    }

    const cacheKey = `district_${stateName}_${districtName}`
    let data = await getCache(cacheKey)

    if (!data) {
      data = await dbServices.getDistrictDataByStateAndDistrict(stateName, districtName)
      
      if (!data) {
        return res.status(404).json({ 
          error: 'District not found',
          state: stateName,
          district: districtName
        })
      }
      
      await setCache(cacheKey, data, 3600)
    }

    res.json(data)
  } catch (error) {
    console.error('Error fetching district data:', error)
    res.status(500).json({ error: error.message })
  }
}

// ===== Legacy Controllers (Backward Compatibility) =====

export async function getDistricts(req, res) {
  try {
    const cacheKey = 'all_districts'
    let districts = await getCache(cacheKey)

    if (!districts) {
      districts = await dbServices.getDistrictData()
      await setCache(cacheKey, districts, 86400)
    }

    res.json(districts)
  } catch (error) {
    console.error('Error fetching all districts:', error)
    res.status(500).json({ error: error.message })
  }
}

export async function getDistrictData(req, res) {
  try {
    const { districtName } = req.params
    
    if (!districtName) {
      return res.status(400).json({ error: 'District name is required' })
    }

    const cacheKey = `district_${districtName}`
    let data = await getCache(cacheKey)

    if (!data) {
      data = await dbServices.getDistrictData(districtName)
      
      if (!data) {
        const allDistricts = await dbServices.getDistrictData()
        return res.status(404).json({ 
          error: 'District not found',
          requested: districtName,
          availableDistricts: allDistricts.map(d => d.district_name),
          hint: 'Try specifying state: /api/states/{state}/districts/{district}'
        })
      }
      
      await setCache(cacheKey, data, 3600)
    }

    res.json(data)
  } catch (error) {
    console.error('Error fetching district:', error)
    res.status(500).json({ error: error.message })
  }
}