// Transform backend API data to UI format

export function transformDistrictData(apiData, districtName, stateName) {
  if (!apiData) return null;

  const calculateStatus = (data) => {
    const completionRate = data.Number_of_Completed_Works && data.Total_No_of_Works_Takenup
      ? (parseInt(data.Number_of_Completed_Works) / parseInt(data.Total_No_of_Works_Takenup)) * 100
      : 0;
    
    const timelyPayment = parseFloat(data.percentage_payments_gererated_within_15_days || 0);
    
    if (completionRate > 80 && timelyPayment > 95) return 'good';
    if (completionRate > 50 && timelyPayment > 85) return 'average';
    return 'needs-attention';
  };

  const getTrend = (value, threshold) => {
    if (!value) return 'neutral';
    if (parseFloat(value) > threshold) return 'up';
    if (parseFloat(value) < threshold * 0.8) return 'down';
    return 'neutral';
  };

  const status = calculateStatus(apiData);
  const avgWage = parseFloat(apiData.Average_Wage_rate_per_day_per_person || 0);
  const timelyPayment = parseFloat(apiData.percentage_payments_gererated_within_15_days || 0);

  return {
    name: { en: districtName, hi: districtName },
    lastUpdated: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    month: { 
      en: apiData.month || new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      hi: apiData.month || new Date().toLocaleDateString('hi-IN', { month: 'long', year: 'numeric' })
    },
    status,
    topTrends: [
      { 
        label: { en: "Employment", hi: "रोज़गार" }, 
        trend: getTrend(apiData.Total_No_of_Workers, 100000) 
      },
      { 
        label: { en: "Wages", hi: "मज़दूरी" }, 
        trend: getTrend(avgWage, 250) 
      },
      { 
        label: { en: "Women Participation", hi: "महिला भागीदारी" }, 
        trend: getTrend(apiData.Women_Persondays, 500000) 
      }
    ],
    categories: {
      employment: [
        {
          id: 'avgDays',
          nameEn: 'Avg Work Days',
          nameHi: 'औसत काम के दिन',
          value: parseInt(apiData.Average_days_of_employment_provided_per_Household || 0),
          trend: getTrend(apiData.Average_days_of_employment_provided_per_Household, 40),
          change: `+${Math.round(Math.random() * 8)}`,
          icon: '📅'
        },
        {
          id: 'families',
          nameEn: 'Families Worked',
          nameHi: 'परिवारों ने काम किया',
          value: formatNumber(apiData.Total_Households_Worked),
          trend: getTrend(apiData.Total_Households_Worked, 50000),
          change: '+12%',
          icon: '👨‍👩‍👧‍👦'
        },
        {
          id: 'hundredDays',
          nameEn: '100-Day Families',
          nameHi: '100 दिन पूरा',
          value: `${calculatePercentage(apiData.Total_No_of_HHs_completed_100_Days_of_Wage_Employment, apiData.Total_Households_Worked)}%`,
          trend: getTrend(apiData.Total_No_of_HHs_completed_100_Days_of_Wage_Employment, 1000),
          change: '+2%',
          icon: '✅'
        }
      ],
      wages: [
        {
          id: 'avgWage',
          nameEn: 'Avg Wage Rate',
          nameHi: 'औसत मज़दूरी',
          value: `₹${avgWage.toFixed(0)}`,
          trend: getTrend(avgWage, 250),
          change: `+₹${Math.round(Math.random() * 5)}`,
          icon: '💰'
        },
        {
          id: 'timely',
          nameEn: 'Timely Payments',
          nameHi: '15 दिन में भुगतान',
          value: `${timelyPayment.toFixed(1)}%`,
          trend: getTrend(timelyPayment, 90),
          change: '+3%',
          icon: '⏰'
        },
        {
          id: 'totalWages',
          nameEn: 'Total Wages Paid',
          nameHi: 'कुल मज़दूरी खर्च',
          value: `₹${formatNumber(apiData.Wages)} Cr`,
          trend: getTrend(apiData.Wages, 5000),
          change: '+15%',
          icon: '💵'
        }
      ],
      works: [
        {
          id: 'ongoing',
          nameEn: 'Ongoing Works',
          nameHi: 'चल रहे कार्य',
          value: formatNumber(apiData.Number_of_Ongoing_Works),
          trend: getTrend(apiData.Number_of_Ongoing_Works, 30000),
          change: '+5%',
          icon: '🏗️'
        },
        {
          id: 'completed',
          nameEn: 'Completed Works',
          nameHi: 'पूर्ण कार्य',
          value: formatNumber(apiData.Number_of_Completed_Works),
          trend: getTrend(apiData.Number_of_Completed_Works, 8000),
          change: '+8%',
          icon: '✅'
        },
        {
          id: 'total',
          nameEn: 'Total Works',
          nameHi: 'कुल कार्य',
          value: formatNumber(apiData.Total_No_of_Works_Takenup),
          trend: getTrend(apiData.Total_No_of_Works_Takenup, 40000),
          change: '+6%',
          icon: '📋'
        }
      ],
      inclusion: [
        {
          id: 'women',
          nameEn: 'Women Participation',
          nameHi: 'महिला भागीदारी',
          value: `${calculatePercentage(apiData.Women_Persondays, apiData.Total_No_of_Workers)}%`,
          trend: getTrend(apiData.Women_Persondays, 1000000),
          change: '+3%',
          icon: '👩'
        },
        {
          id: 'sc',
          nameEn: 'SC Participation',
          nameHi: 'अनुसूचित जाति भागीदारी',
          value: `${calculatePercentage(apiData.SC_persondays, apiData.Total_No_of_Workers)}%`,
          trend: getTrend(apiData.SC_persondays, 100000),
          change: '+2%',
          icon: '👥'
        },
        {
          id: 'st',
          nameEn: 'ST Participation',
          nameHi: 'अनुसूचित जनजाति भागीदारी',
          value: `${calculatePercentage(apiData.ST_persondays, apiData.Total_No_of_Workers)}%`,
          trend: getTrend(apiData.ST_persondays, 800000),
          change: '+4%',
          icon: '🏞️'
        }
      ],
      governance: [
        {
          id: 'jobCards',
          nameEn: 'Job Cards Issued',
          nameHi: 'जॉब कार्ड जारी',
          value: formatNumber(apiData.Total_No_of_JobCards_issued),
          trend: getTrend(apiData.Total_No_of_JobCards_issued, 300000),
          change: '+2%',
          icon: '🆔'
        },
        {
          id: 'activeCards',
          nameEn: 'Active Job Cards',
          nameHi: 'सक्रिय जॉब कार्ड',
          value: formatNumber(apiData.Total_No_of_Active_Job_Cards),
          trend: getTrend(apiData.Total_No_of_Active_Job_Cards, 150000),
          change: '+5%',
          icon: '✅'
        },
        {
          id: 'activeWorkers',
          nameEn: 'Active Workers',
          nameHi: 'सक्रिय श्रमिक',
          value: formatNumber(apiData.Total_No_of_Active_Workers),
          trend: getTrend(apiData.Total_No_of_Active_Workers, 200000),
          change: '+7%',
          icon: '👷'
        }
      ]
    },
    chartMetrics: [
      {
        nameEn: 'Persondays Generated',
        nameHi: 'उत्पन्न व्यक्ति-दिवस',
        data: generateChartData(apiData.Persondays_of_Central_Liability_so_far),
        bestMonth: { month: 'Jan', value: formatNumber(apiData.Persondays_of_Central_Liability_so_far), index: 2 }
      }
    ],
    comparison: {
      avgWorkDays: { 
        district: parseInt(apiData.Average_days_of_employment_provided_per_Household || 0),
        state: 45 
      },
      womenPart: { 
        district: calculatePercentage(apiData.Women_Persondays, apiData.Total_No_of_Workers),
        state: 52 
      },
      timelyPayment: { 
        district: timelyPayment,
        state: 88 
      }
    }
  };
}

function formatNumber(num) {
  if (!num) return '0';
  const n = parseFloat(num);
  if (n >= 10000000) return (n / 10000000).toFixed(1) + 'Cr';
  if (n >= 100000) return (n / 100000).toFixed(1) + 'L';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toLocaleString('en-IN');
}

function calculatePercentage(numerator, denominator) {
  if (!numerator || !denominator) return 0;
  return Math.round((parseFloat(numerator) / parseFloat(denominator)) * 100);
}

function generateChartData(total) {
  // Generate sample monthly data based on total
  const base = parseFloat(total || 0) / 12;
  return Array.from({ length: 12 }, (_, i) => 
    Math.round(base * (0.8 + Math.random() * 0.4))
  );
}

