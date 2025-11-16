import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus, Volume2, HelpCircle, Share2, ArrowRight, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchDistrictData } from "../api/districtAPI";
import { transformDistrictData } from "../utils/dataTransform";

const categories = [
  { id: 'employment', icon: '🌾', labelEn: 'Employment', labelHi: 'रोज़गार' },
  { id: 'wages', icon: '💰', labelEn: 'Wages', labelHi: 'मज़दूरी' },
  { id: 'works', icon: '🏗️', labelEn: 'Works', labelHi: 'कार्य' },
  { id: 'inclusion', icon: '👩‍🌾', labelEn: 'Inclusion', labelHi: 'समावेशन' },
  { id: 'governance', icon: '🧮', labelEn: 'Governance', labelHi: 'शासन' }
];

const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

export default function Dashboard({ 
  selectedState, 
  selectedDistrict,
  onNavigateToHome,
  onNavigateToHelp,
  onNavigateToShare,
  language,
  setLanguage,
  onDistrictDataChange
}) {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState('employment');
  const [activeChart, setActiveChart] = useState(0);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Only fetch when both state and district are present
    if (selectedState && selectedDistrict) {
      setLoading(true);
      setError("");
      // Pass both state and district so the API path becomes /api/states/{state}/districts/{district}
      fetchDistrictData(selectedState, selectedDistrict)
        .then((apiData) => {
          setRawData(apiData);
          const transformed = transformDistrictData(apiData, selectedDistrict, selectedState);
          setData(transformed);
          if (onDistrictDataChange) {
            onDistrictDataChange(apiData);
          }
        })
        .catch((err) => {
          setError(err.message || "Failed to load district data");
          console.error("Error fetching district data:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [selectedDistrict, selectedState, onDistrictDataChange]);

  const getStatusColor = (status) => {
    if (status === 'good') return 'bg-green-600';
    if (status === 'average') return 'bg-amber-500';
    if (status === 'needs-attention') return 'bg-red-600';
    return 'bg-gray-500';
  };

  const getStatusText = (status) => {
    if (status === 'good') return t('title').includes('हमारी') ? '🟢 अच्छा' : '🟢 Good';
    if (status === 'average') return t('title').includes('हमारी') ? '🟠 ठीक-ठाक' : '🟠 Average';
    if (status === 'needs-attention') return t('title').includes('हमारी') ? '🔴 सुधार ज़रूरी' : '🔴 Needs Attention';
    return '';
  };

  const TrendIcon = ({ trend }) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const playAudio = (metricId) => {
    setPlayingAudio(metricId);
    setTimeout(() => setPlayingAudio(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 flex items-center justify-center">
        <p className="text-blue-600 font-medium">{t("loading")}</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">{error || "No data available"}</p>
          <button
            onClick={onNavigateToHome}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            {t("back")}
          </button>
        </div>
      </div>
    );
  }

  const categoryMetrics = data.categories[activeCategory] || [];
  const chartData = data.chartMetrics[activeChart] || data.chartMetrics[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 pb-8">
      {isOffline && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 text-sm">
          {t("offlineMessage")}
        </div>
      )}
      
      <div className="bg-green-700 text-white p-6 rounded-b-3xl shadow-lg">
        <button 
          onClick={onNavigateToHome}
          className="text-white mb-4 flex items-center gap-2 hover:underline"
        >
          ← {t("back")}
        </button>
        
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-2xl font-bold">
              {i18n.language === 'hi' ? data.name.hi : data.name.en}
            </h2>
            <p className="text-green-100 text-sm mt-1">
              {i18n.language === 'hi' ? data.month.hi : data.month.en}
            </p>
            <p className="text-green-200 text-xs">
              {t("lastUpdated")} {data.lastUpdated}
            </p>
          </div>
          <button 
            onClick={() => {
              const newLang = language === 'en' ? 'hi' : 'en';
              setLanguage(newLang);
              i18n.changeLanguage(newLang);
            }}
            className="bg-green-800 px-3 py-1 rounded-full text-sm"
          >
            {language === 'en' ? 'हिंदी' : 'Eng'}
          </button>
        </div>
        
        <div className={`inline-block ${getStatusColor(data.status)} px-4 py-2 rounded-full font-semibold mt-3`}>
          {getStatusText(data.status)}
        </div>
      </div>

      <div className="p-4 bg-white mx-4 mt-4 rounded-2xl shadow-md border-2 border-green-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          {t("topTrends")}
        </h3>
        <div className="space-y-2">
          {data.topTrends.map((trend, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-sm text-gray-800">
                {i18n.language === 'hi' ? trend.label.hi : trend.label.en}
              </span>
              <TrendIcon trend={trend.trend} />
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="flex overflow-x-auto gap-2 pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                activeCategory === cat.id
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200'
              }`}
            >
              {cat.icon} {i18n.language === 'hi' ? cat.labelHi : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {categoryMetrics.map((metric) => {
            const IconComponent = () => <span className="text-2xl">{metric.icon || '📊'}</span>;
            return (
              <div
                key={metric.id}
                className="bg-white p-4 rounded-2xl shadow-md border-2 border-green-200 hover:shadow-lg transition-all hover:-translate-y-1 active:scale-95"
              >
                <div className="flex justify-between items-start mb-2">
                  <IconComponent />
                  <button
                    onClick={() => playAudio(metric.id)}
                    className={`p-1 rounded-full transition-all ${playingAudio === metric.id ? 'bg-green-200 scale-110' : 'bg-gray-100'}`}
                  >
                   
                  </button>
                </div>
                
                <p className="text-xs text-gray-600 mb-1 leading-tight">
                  {i18n.language === 'hi' ? metric.nameHi : metric.nameEn}
                </p>
                
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {typeof metric.value === 'number' ? metric.value.toLocaleString('en-IN') : metric.value}
                </p>
                
                <div className="flex items-center gap-2">
                  <TrendIcon trend={metric.trend} />
                  <span className={`text-sm font-semibold ${
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 
                    'text-gray-600'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {chartData && (
          <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-amber-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-gray-800 text-sm">
                {i18n.language === 'hi' ? chartData.nameHi : chartData.nameEn}
              </h4>
              {data.chartMetrics.length > 1 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveChart(Math.max(0, activeChart - 1))}
                    disabled={activeChart === 0}
                    className="p-2 bg-gray-100 rounded-lg disabled:opacity-30"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveChart(Math.min(data.chartMetrics.length - 1, activeChart + 1))}
                    disabled={activeChart === data.chartMetrics.length - 1}
                    className="p-2 bg-gray-100 rounded-lg disabled:opacity-30"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            <p className="text-xs text-gray-600 mb-4">
              😃 {t("bestMonth")} {chartData.bestMonth?.month} ({chartData.bestMonth?.value})
            </p>
            
            <div className="h-48 flex items-end justify-between gap-1">
              {chartData.data.map((value, idx) => {
                const maxValue = Math.max(...chartData.data);
                const height = (value / maxValue) * 100;
                const isBest = idx === chartData.bestMonth?.index;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full rounded-t-lg transition-all hover:opacity-80 ${
                        isBest ? 'bg-amber-500' : 'bg-green-500'
                      }`}
                      style={{ height: `${height}%` }}
                      title={`${months[idx]}: ${value}`}
                    >
                      {isBest && <div className="text-center text-xs">😃</div>}
                    </div>
                    <p className="text-xs text-gray-600 mt-2">{months[idx]}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {data.comparison && (
          <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-amber-200">
            <h4 className="font-bold text-gray-800 mb-4 text-sm">
              {t("howCompare")}
            </h4>
            
            <div className="space-y-4">
              {Object.entries(data.comparison).map(([key, values]) => {
                const labels = {
                  avgWorkDays: { en: 'Avg Work Days', hi: 'औसत काम के दिन' },
                  womenPart: { en: "Women Participation", hi: 'महिला भागीदारी' },
                  timelyPayment: { en: 'Timely Payment', hi: 'समय पर भुगतान' }
                };
                
                const isAhead = values.district >= values.state;
                
                return (
                  <div key={key}>
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      {i18n.language === 'hi' ? labels[key]?.hi : labels[key]?.en}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-20">{t("districtLabel")}</span>
                        <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${isAhead ? 'bg-green-600' : 'bg-red-600'} rounded-full flex items-center justify-end pr-2`}
                            style={{ width: `${Math.min(100, values.district)}%` }}
                          >
                            <span className="text-xs font-bold text-white">{values.district}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-20">{t("stateLabel")}</span>
                        <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${Math.min(100, values.state)}%` }}
                          >
                            <span className="text-xs font-bold text-white">{values.state}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={onNavigateToShare}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all hover:shadow-xl active:scale-95"
        >
          <Share2 className="w-5 h-5" />
          <span>{t("shareReport")}</span>
        </button>
      </div>

      <button
        onClick={onNavigateToHelp}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-xl hover:bg-green-700 transition-all active:scale-95"
      >
        <HelpCircle className="w-6 h-6" />
      </button>
    </div>
  );
}
