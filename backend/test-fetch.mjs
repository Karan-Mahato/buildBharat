import { fetchDistrictData } from './src/services/mgnregaService.js';
import dotenv from 'dotenv';

dotenv.config();

const districts = [
    'BOKARO',
    'CHATRA',
    'DEOGHAR',
    'DHANBAD',
    'DUMKA',
    'EAST SINGHBUM',
    'GARHWA',
    'GIRIDIH',
    'GODDA',
    'GUMLA',
    'HAZARIBAGH',
    'JAMTARA',
    'KHUNTI',
    'KODERMA',
    'LATEHAR',
    'LOHARDAGA',
    'PAKUR',
    'PALAMU',
    'RAMGARH',
    'RANCHI',
    'SAHEBGANJ',
    'SARAIKELA KHARSAWAN',
    'SIMDEGA',
    'WEST SINGHBHUM',
];

async function test() {
    for (const district of districts) {
        try {
            console.log(`\nTesting fetch for ${district}...`);
            const data = await fetchDistrictData(district);
            console.log(`${district} API data:`, JSON.stringify(data, null, 2));
            console.log(`${district} district_code:`, data?.district_code);
        } catch (error) {
            console.error(`Test failed for ${district}:`, error.message);
        }
    }
}

test();
