import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.MGNREGA_API_URL;
const API_KEY = process.env.MGNREGA_API_KEY;

async function listDistricts() {
    try {
        const params = {
            'api-key': API_KEY,
            'format': 'json',
            'filters[state_name]': 'JHARKHAND',
            'limit': 100  // get all districts
        };
        
        console.log('API request:', `${BASE_URL}?` + new URLSearchParams(params).toString());
        
        const response = await axios.get(BASE_URL, { params });
        
        if (response.data?.records) {
            const districts = new Set(
                response.data.records
                    .map(r => r.district_name)
                    .filter(Boolean)
            );
            
            console.log('\nAvailable districts in Jharkhand:', 
                Array.from(districts).sort().join('\n'));
        } else {
            console.log('No records found');
        }
        
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

listDistricts();