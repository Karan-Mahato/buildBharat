import dotenv from 'dotenv';
import { fetchDistrictData } from './src/services/mgnregaService.js';
import prisma from './src/config/prisma.js';

// Multi-state district mapping
const stateDistrictsMap = {
    "ANDAMAN AND NICOBAR":["NICOBARS","NORTH AND MIDDLE ANDAMAN","SOUTH ANDAMAN"],
    "ANDHRA PRADESH":["VIZIANAGARAM","EAST GODAVARI","BAPATLA","NANDYAL","KAKINADA","WEST GODAVARI","KRISHNA","ANANTAPUR","ALLURI SITHARAMA RAJU","Y.S.R","ELURU","TIRUPATI","CHITTOOR","KURNOOL","SRI SATHYA SAI","VISAKHAPATANAM","KONASEEMA","ANNAMAYYA","PARVATHIPURAM MANYAM","GUNTUR","PRAKASAM","PALNADU","NTR","NELLORE","SRIKAKULAM","ANAKAPALLI"],
    "ARUNACHAL PRADESH":["UPPER SUBANSIRI","LOHIT","PAPUM PARE","UPPER SIANG","KRA-DAADI","SIANG","UPPER DIBANG VALLEY","ANJAW","NAMSAI","PAKKE KESSANG","TAWANG","WEST SIANG","TIRAP","KURUNG KUMEY","LEPARADA","EAST KAMENG","LOWER DIBANG VALLEY","LONGDING","SHI YOMI","LOWER SUBANSIRI","EAST SIANG","KAMLE","WEST KAMENG","LOWER SIANG","CHANGLANG"],
    "ASSAM":["LAKHIMPUR","DHEMAJI","JORHAT","TINSUKIA","MAJULI","WEST KARBI ANGLONG","GOALPARA","KAMRUP","SONITPUR","NAGAON","CACHAR","KAMRUP (METRO)","UDALGURI","DHUBRI","BARPETA","DARRANG","Morigaon","GOLAGHAT","CHARAIDEO","TAMULPUR","HAILAKANDI","BAKSA","BAJALI","BONGAIGAON","DIBRUGARH","KARBI ANGLONG","KARIMGANJ","Biswanath","SIVASAGAR","SOUTH SALMARA-MANKACHAR","Dima Hasao","KOKRAJHAR","NALBARI","HOJAI","CHIRANG","Sribhumi"],
    "BIHAR":["PATNA","NALANDA","JEHANABAD","SAMASTIPUR","SUPAUL","ROHTAS","NAWADA","PURBI CHAMPARAN","MADHUBANI","ARARIA","KISHANGANJ","BANKA ","KAIMUR (BHABUA)","ARWAL","BHOJPUR","MUZAFFARPUR","KATIHAR","KHAGARIA","SHEOHAR","JAMUI","GOPALGANJ","SITAMARHI","PURNIA","MUNGER","BHAGALPUR","BEGUSARAI","DARBHANGA","BUXAR ","AURANAGABAD","Sheikhpura ","VAISHALI","GAYA","MADHEPURA","LAKHISARAI","SARAN","SIWAN","PASHCHIM CHAMPARAN","SAHARSA"],
    "CHHATTISGARH":["BASTAR","RAIGARH","RAIPUR","BALODA BAZAR","GAURELA PENDRA MARWAHI","MOHLA MANPUR AMBAGARH CHOWKI","KAWARDHA","DURG","KANKER","MAHASAMUND","GAURELA PENDRA MARWAHI","BALRAMPUR","SAKTI","KOREA","KONDAGAON","KHAIRAGARH CHHUIKHADAN GANDAI","BILASPUR","JANJGIR-CHAMPA","KORBA","MUNGELI","SARANGARH BILAIGARH","SURGUJA","JASHPUR","DHAMTARI","DANTEWADA","BIJAPUR","GARIYABAND","BEMETARA","BALOD","MANENDRAGARH CHIRMIRI BHARATPUR","RAJNANDAGON","NARAYANPUR","SUKMA","SURAJPUR"],
    "DN HAVELI AND DD":["DADRA AND NAGAR HAVELI"],
    "GOA":["SOUTH GOA","NORTH GOA"],
    "GUJARAT":["KACHCHH","BHARUCH","VALSAD","ANAND","ARVALLI","GIR SOMNATH","DEVBHUMI DWARKA","MAHISAGAR","JAMNAGAR","DANG","DOHAD","JUNAGADH","SABAR KANTHA","KHEDA","Botad","BANAS KANTHA","NARMADA","Morbi","BHAVNAGAR","VADODARA","MAHESANA","TAPI","Chhotaudepur","PORBANDAR","AMRELI","GANDHINAGAR","AHMADABAD","NAVSARI  ","RAJKOT","SURAT","SURENDRANAGAR","PANCH MAHALS","PATAN"],
    "HARYANA":["KURUKSHETRA","SONIPAT","GURUGRAM","MAHENDRAGARH","KAITHAL","REWARI","JHAJJAR","CHARKI DADRI","PANIPAT","HISAR","YAMUNANAGAR","SIRSA","BHIWANI","FATEHABAD","PALWAL","FARIDABAD","AMBALA","KARNAL","JIND","MEWAT","ROHTAK","PANCHKULA"],
    "HIMACHAL PRADESH":["LAHUL AND SPITI","KANGRA","KINNAUR","SHIMLA","SIRMAUR","HAMIRPUR","KULLU","UNA","MANDI","SOLAN","CHAMBA","BILASPUR"],
    "JAMMU AND KASHMIR":["ANANTNAG","POONCH","JAMMU","KISHTWAR","BARAMULLA","RAJAURI","KULGAM","SRINAGAR","DODA","BANDIPORA","SAMBA","PULWAMA","GANDERBAL","SHOPIAN","KUPWARA","BADGAM","UDHAMPUR","KATHUA","RAMBAN","REASI"],
    "JHARKHAND":["RANCHI","PAKUR","KHUNTI","SIMDEGA","EAST SINGHBUM","SAHEBGANJ","HAZARIBAGH","DHANBAD","DEOGHAR","DUMKA","GODDA","CHATRA","GIRIDIH","GUMLA","KODERMA","LOHARDAGA","WEST SINGHBHUM","LATEHAR","GARHWA","JAMTARA","PALAMU","RAMGARH","BOKARO","SARAIKELA KHARSAWAN"],
    "KARNATAKA":["BALLARI","VIJAYPURA","GADAG","HAVERI","RAICHUR","SHIVAMOGGA","UTTARA KANNADA","RAMANAGARA","Yadgir","BAGALKOTE","BENGALURU","TUMAKURU","CHITRADURGA","KALABURAGI","KOPPAL","VIJAYANAGARA","BIDAR","DAKSHINA KANNADA","DAVANAGERE","MYSURU","CHAMARAJA NAGARA","HASSAN","KOLAR","UDUPI","BENGALURU RURAL","BELAGAVI","DHARWAR","KODAGU","CHIKKAMAGALURU","CHIKKABALLAPURA","MANDYA"],
    "KERALA":["KOZHIKODE","MALAPPURAM","IDUKKI","KOTTAYAM","KOLLAM","ALAPPUZHA","KANNUR","PALAKKAD","THRISSUR","PATHANAMTHITTA","ERNAKULAM","WAYANAD","THIRUVANANTHAPURAM","KASARGOD"],
    "LADAKH":["LEH (LADAKH)","KARGIL"],
    "LAKSHADWEEP":["LAKSHADWEEP DISTRICT"],
    "MADHYA PRADESH":["NIWARI","TIKAMGARH","PANNA","SATNA","SHAHDOL","SHAJAPUR","SEHORE","BETUL","CHHINDWARA","HARDA ","GUNA","SAGAR","REWA","MANDSAUR","BHOPAL","MANDLA","UMARIA","BURHANPUR","SIDHI","NARMADAPURAM","SHEOPUR","NEEMUCH","BARWANI","ALIRAJPUR","AGAR-MALWA","DEWAS","KHANDWA","DATIA","CHHATARPUR","DAMOH","RAJGARH","NARSINGHPUR","SEONI","BALAGHAT","KATNI ","SINGRAULI","SHIVPURI","DINDORI","GWALIOR","MORENA","VIDISHA","RAISEN","ASHOK NAGAR","RATLAM","DHAR","JHABUA","INDORE","BHIND","KHARGONE","ANUPPUR","JABALPUR","UJJAIN"],
    "MAHARASHTRA":["RAIGAD","PUNE","JALNA","PARBHANI","AMRAVATI","WASHIM","DHULE","SANGLI","KOLHAPUR","BULDHANA","GONDIA","PALGHAR","THANE","AKOLA","YAVATMAL","BHANDARA","CHANDRAPUR","AHMEDNAGAR","BEED","JALGAON","LATUR","WARDHA","SATARA","SINDHUDURG","GADCHIROLI","SOLAPUR","NANDURBAR","NASHIK","Dharashiv","HINGOLI","RATNAGIRI","Chatrapati Sambhaji Nagar","NAGPUR","NANDED"],
    "MANIPUR":["SENAPATI","PHERZAWL","THOUBAL","KAMJONG","BISHNUPUR","IMPHAL WEST","KANGPOKPI","IMPHAL EAST","TAMENGLONG","CHURACHANDPUR","CHANDEL","UKHRUL","JIRIBAM","KAKCHING","TENGNOUPAL","NONEY"],
    "MEGHALAYA":["NORTH GARO HILLS","WEST KHASI HILLS","East Jaintia Hills","WEST JAINTIA HILLS","EAST KHASI HILLS","SOUTH GARO HILLS","SOUTH WEST KHASI HILLS","RI BHOI  ","EAST GARO HILLS","SOUTH WEST GARO HILLS","EASTERN WEST KHASI HILLS","WEST GARO HILLS"],
    "MIZORAM":["AIZAWL","LUNGLEI","SERCHHIP","LAWNGTLAI","Siaha","SAITUAL","KHAWZAWL","MAMIT","HNAHTHIAL","KOLASIB","CHAMPHAI "],
    "NAGALAND":["WOKHA","MON","DIMAPUR","KIPHIRE","LONGLENG","PHEK","ZUNHEBOTO","KOHIMA","MOKOKCHUNG","PEREN","TUENSANG"],
    "ODISHA":["BALESHWAR","DHENKANAL","KORAPUT","JHARSUGUDA","RAYAGADA","SAMBALPUR","ANGUL","GAJAPATI","MALKANGIRI","SUNDARGARH","CUTTACK","BHADRAK","BOUDH","BARGARH","DEOGARH","JAGATSINGHAPUR","NUAPADA","NABARANGAPUR","BOLANGIR","GANJAM","KALAHANDI","PURI","NAYAGARH","KANDHAMAL","JAJPUR","MAYURBHANJ","KENDRAPARA","KHORDHA","KENDUJHAR","SONEPUR"],
    "PUDUCHERRY":["KARAIKAL","PONDICHERRY"],
    "PUNJAB":["AMRITSAR","LUDHIANA","JALANDHAR","PATIALA","FARIDKOT","MOGA","SAS NAGAR MOHALI","TARN TARAN","Pathankot","GURDASPUR","MUKATSAR","FATEHGARH SAHIB","FEROZEPUR","ROPAR","BARNALA","NAWANSHAHR ","SANGRUR","MALERKOTLA","KAPURTHALA","BHATINDA","HOSHIARPUR","MANSA","Fazilka"],
    "RAJASTHAN":["JHUNJHUNU","BHARATPUR","DAUSA","AJMER","UDAIPUR","DUNGARPUR","KOTA","CHURU","BARMER","PALI","CHURU","BHILWARA","DHOLPUR","KARAULI","NAGAUR","JALORE","SIROHI","TONK","CHITTORGARH","BARAN","JHALAWAR","PRATAPGARH","ALWAR","BANSWARA","HANUMANGARH","JODHPUR","JAISALMER","BUNDI","RAJSAMAND","SRI GANGANAGAR","SIKAR","BIKANER","JAIPUR","SAWAI MADHOPUR"],
    "SIKKIM":["PAKYONG","Namchi District","SORENG","Gangtok District","Gyalshing District","Mangan District"],
    "TAMIL NADU":["TIRUVALLUR","CUDDALORE","COIMBATORE","CHENGALPATTU","TENKASI","THE NILGIRIS","RAMANATHAPURAM","TIRUPPUR","VILLUPURAM","VELLORE","NAMAKKAL","ERODE","MADURAI","THENI","DINDIGUL","THOOTHUKKUDI","KARUR","PERAMBALUR","TIRUNELVELI","ARIYALUR","TIRUPATHUR","MAYILADUTHURAI","TIRUVANNAMALAI","DHARMAPURI","PUDUKKOTTAI","TIRUCHIRAPPALLI","KALLAKURICHI","SALEM","SIVAGANGAI","KRISHNAGIRI","VIRUDHUNAGAR","KANNIYAKUMARI","Ranipet","TIRUVARUR","THANJAVUR","KANCHIPURAM","NAGAPATTINAM"],
    "TELANGANA":["Warangal","Hanumakonda","Jagtial","Sangareddy","Kamareddy","Rangareddy","Siddipet","Mulugu","Karimnagar","Nalgonda","Jangaon","Jayashanker Bhopalapally","Kumram Bheem(Asifabad)","Nagarkurnool","Peddapalli","Rajanna Sirsilla","Vikarabad","Nizamabad","Khammam","Bhadradri Kothagudem","Nirmal","Suryapet","Mahabubabad","Adilabad","Mancherial","Medak","Mahabubnagar","Jogulamba Gadwal","Wanaparthy","Narayanpet","Medchal","Yadadri Bhuvanagiri"],
    "TRIPURA":["Gomati","Sepahijala","DHALAI","WEST TRIPURA","SOUTH TRIPURA","NORTH TRIPURA","Unakoti","Khowai"],
    "UTTAR PRADESH":["MORADABAD","SAHARANPUR","BULANDSHAHR","BUDAUN","RAE BARELI","KANPUR DEHAT","LALITPUR","BANDA","FATEHPUR","PRATAPGARH","BAHRAICH","GONDA","GORAKHPUR","AZAMGARH","HATHRAS","AURAIYA","AMBEDKAR NAGAR","SAMBHAL","ALIGARH","FIROZABAD","SHAHJAHANPUR","SIDDHARTH NAGAR","DEORIA","MIRZAPUR","BAGHPAT","KASHGANJ","BIJNOR","ETAH","JALAUN","BARABANKI","AYODHYA","SULTANPUR","JAUNPUR","BALLIA","AMROHA","CHANDAULI","KUSHI NAGAR","CHITRAKOOT","HAPUR","PILIBHIT","PRAYAGRAJ","GHAZIPUR","KANNAUJ","RAMPUR","KHERI","HARDOI","JHANSI","SHRAVASTI","MAHOBA","MEERUT","BAREILLY","SITAPUR","LUCKNOW","MAHARAJGANJ","BASTI","SANT KABEER NAGAR","SHAMLI","UNNAO","HAMIRPUR","ETAWAH","VARANASI","KANPUR NAGAR","KAUSHAMBI","MATHURA","AGRA","SANT RAVIDAS NAGAR","MUZAFFARNAGAR","FARRUKHABAD","MAINPURI","SONBHADRA","AMETHI","MAU","BALRAMPUR","GHAZIABAD","GAUTAM BUDDHA NAGAR"],
    "UTTARAKHAND":["HARIDWAR","CHAMOLI","PAURI GARHWAL","ALMORA","UDAM SINGH NAGAR","CHAMPAWAT","RUDRA PRAYAG","UTTAR KASHI","BAGESHWAR","PITHORAGARH","NAINITAL","DEHRADUN","TEHRI GARHWAL"],
    "WEST BENGAL":["24 PARGANAS SOUTH","PURBA MEDINIPUR","DINAJPUR UTTAR","NADIA","BIRBHUM","PURULIA","ALIPURDUAR","MURSHIDABAD","PASCHIM BARDHAMAN","JALPAIGURI","HOWRAH","HOOGHLY","MALDAH","24 PARGANAS (NORTH)","COOCHBEHAR","JHARGRAM","BANKURA","PASCHIM MEDINIPUR","PURBA BARDHAMAN","Darjeeling Gorkha Hill Council (DGHC)","SILIGURI MAHAKUMA PARISAD","DINAJPUR DAKSHIN","KALIMPONG"]
};

// Load environment variables
dotenv.config();

async function runTest() {
    console.log('\nStarting test with configuration:');
    console.log('- API URL:', process.env.MGNREGA_API_URL);
    console.log('- Database:', process.env.DATABASE_URL ? 'Configured' : 'Missing');
    
    try {
        // Test database connection first
        console.log('\n🔍 Testing database connection...');
        await prisma.$queryRaw`SELECT NOW()`;
        console.log('✅ Database connection successful');
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        console.error('\n💡 Troubleshooting:');
        console.error('   1. Verify DATABASE_URL in .env');
        console.error('   2. Check Supabase is running and accessible');
        console.error('   3. Run: node test-connection.mjs for detailed diagnostics');
        await prisma.$disconnect();
        process.exit(1);
    }
    
    try {
        // Clear old sync logs
        console.log('\n🧹 Clearing old sync logs...');
        await prisma.syncLog.deleteMany({
            where: {
                start_time: {
                    lt: new Date(Date.now() - 24 * 60 * 60 * 1000)
                }
            }
        });
        console.log('✅ Old logs cleared');
        
        console.log('\n🚀 Starting sync for all states...');
        
        const startTime = Date.now();
        let successCount = 0;
        let failCount = 0;
        
        // Create a sync log entry
        const syncLog = await prisma.syncLog.create({
            data: { status: 'running' }
        });
        
        // Iterate through all states and their districts
        for (const [stateName, districts] of Object.entries(stateDistrictsMap)) {
            console.log(`\n📍 Updating ${stateName} (${districts.length} districts)...`);
            
            for (const district of districts) {
                try {
                    // Fetch data for state+district combo
                    await fetchDistrictData(district, stateName);
                    console.log(`  ✅ ${district}`);
                    successCount++;
                } catch (err) {
                    console.error(`  ❌ ${district}:`, err.message);
                    failCount++;
                }
            }
        }
        
        // Update sync log with results
        await prisma.syncLog.update({
            where: { id: syncLog.id },
            data: {
                status: failCount === 0 ? 'completed' : 'completed_with_errors',
                end_time: new Date(),
                records: successCount,
                error: failCount > 0 ? `Failed to update ${failCount} districts` : null
            }
        });
        
        const duration = (Date.now() - startTime) / 1000;
        console.log("\n✅ MGNREGA sync completed:");
        console.log(`   ⏱️  Time taken: ${duration.toFixed(1)}s`);
        console.log(`   ✓  Successful updates: ${successCount}`);
        console.log(`   ✗  Failed updates: ${failCount}`);

        const [latestSync, districtCount] = await Promise.all([
            prisma.syncLog.findFirst({ 
                orderBy: { start_time: 'desc' } 
            }),
            prisma.districtData.count()
        ]);

        console.log('\n📊 Final Results:');
        console.log('Latest sync log:', latestSync);
        console.log('Total districts stored:', districtCount);

        await prisma.$disconnect();

        const success = latestSync?.status === 'completed' && districtCount > 0;
        process.exit(success ? 0 : 1);
    } catch (err) {
        console.error('\n❌ Test error:', err);
        await prisma.$disconnect();
        process.exit(1);
    }
}

runTest().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});