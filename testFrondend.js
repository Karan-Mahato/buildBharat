import React, { useState, useEffect } from 'react';
import { Home, MapPin, TrendingUp, TrendingDown, Minus, Volume2, HelpCircle, Share2, ChevronRight, Users, Calendar, IndianRupee, Briefcase, CheckCircle, AlertCircle, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { getString, LANGUAGES, LANGUAGE_NAMES } from './frontend/i18n.js';

export default function MGNREGADashboard() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedDistrict, setSelectedDistrict] = useState('ranchi');
  const [language, setLanguage] = useState('en');
  const [isOffline, setIsOffline] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [activeCategory, setActiveCategory] = useState('employment');
  const [activeChart, setActiveChart] = useState(0);

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

  const tKey = (key) => getString(key, language);

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setSelectedDistrict('ranchi');
          alert(tKey('locationDetected'));
        },
        () => alert(tKey('locationFailed'))
      );
    }
  };

  const playAudio = (metricId) => {
    setPlayingAudio(metricId);
    setTimeout(() => setPlayingAudio(null), 2000);
  };

  const getStatusColor = (status) => {
    if (status === 'good') return 'bg-green-600';
    if (status === 'average') return 'bg-amber-500';
    if (status === 'needs-attention') return 'bg-red-600';
    return 'bg-gray-500';
  };

  const getStatusText = (status) => {
    if (status === 'good') return tKey('title').includes('हमारी') ? '🟢 अच्छा' : '🟢 Good';
    if (status === 'average') return tKey('title').includes('हमारी') ? '🟠 ठीक-ठाक' : '🟠 Average';
    if (status === 'needs-attention') return tKey('title').includes('हमारी') ? '🔴 सुधार ज़रूरी' : '🔴 Needs Attention';
    return '';
  };

  const TrendIcon = ({ trend }) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 p-4">
        {isOffline && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl mb-4 text-sm">
            {tKey('offlineMessage')}
          </div>
        )}
        
        <header className="text-center mb-8 pt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white px-3 py-2 rounded-full shadow-md border-2 border-green-200 font-semibold text-sm"
              >
                {LANGUAGES.map(code => (
                  <option key={code} value={code}>{LANGUAGE_NAMES[code] ?? code}</option>
                ))}
              </select>
            </div>
            <Home className="w-8 h-8 text-green-700" />
          </div>
          
          <h1 className="text-2xl font-bold text-green-800 mb-1 leading-tight">
            {tKey('title')}
          </h1>
          <p className="text-xl text-brown-700 font-semibold">
            {tKey('stateName')}
          </p>
        </header>

        <div className="max-w-md mx-auto space-y-4">
          <button
            onClick={detectLocation}
            className="w-full bg-white hover:bg-green-50 text-green-800 font-semibold py-5 px-6 rounded-2xl shadow-lg border-2 border-green-300 flex items-center justify-center gap-3 transition-all hover:shadow-xl active:scale-95"
          >
            <MapPin className="w-6 h-6" />
            <span className="text-lg">
              {tKey('detectDistrict')}
            </span>
          </button>

          <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-amber-200">
            <label className="block text-gray-700 font-semibold mb-3 text-base">
              {tKey('selectDistrictLabel')}
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full p-4 text-lg border-2 border-green-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200"
            >
              {districts.map(dist => (
                <option key={dist.id} value={dist.id}>
                  {language === 'en' ? dist.nameEn : dist.nameHi}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setCurrentPage('dashboard')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all hover:shadow-xl active:scale-95 text-lg"
          >
            <span>{tKey('viewProgress')}</span>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <footer className="mt-12 text-center space-x-6 text-gray-600">
          <button 
            onClick={() => setCurrentPage('help')}
            className="text-green-700 underline font-semibold"
          >
            {tKey('help')}
          </button>
          <span>•</span>
          <button className="text-green-700 underline font-semibold">
            {tKey('about')}
          </button>
        </footer>
      </div>
    );
  }

  if (currentPage === 'dashboard') {
    const data = mockDistrictData[selectedDistrict];
    const categoryMetrics = data.categories[activeCategory];
    const chartData = data.chartMetrics[activeChart];

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 pb-8">
        {isOffline && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 text-sm">
            {tKey('offlineMessage')}
          </div>
        )}
        
        <div className="bg-green-700 text-white p-6 rounded-b-3xl shadow-lg">
          <button 
            onClick={() => setCurrentPage('home')}
            className="text-white mb-4 flex items-center gap-2 hover:underline"
          >
            ← {tKey('back')}
          </button>
          
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-2xl font-bold">
                {language === 'en' ? data.name.en : data.name.hi}
              </h2>
              <p className="text-green-100 text-sm mt-1">
                {language === 'en' ? data.month.en : data.month.hi}
              </p>
              <p className="text-green-200 text-xs">
                {tKey('lastUpdated')} {data.lastUpdated}
              </p>
            </div>
            <button 
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
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
            {tKey('topTrends')}
          </h3>
          <div className="space-y-2">
            {data.topTrends.map((trend, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-gray-800">
                  {language === 'en' ? trend.label.en : trend.label.hi}
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
                {cat.icon} {language === 'en' ? cat.labelEn : cat.labelHi}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {categoryMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.id}
                  className="bg-white p-4 rounded-2xl shadow-md border-2 border-green-200 hover:shadow-lg transition-all hover:-translate-y-1 active:scale-95"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Icon className="w-7 h-7 text-green-700" />
                    <button
                      onClick={() => playAudio(metric.id)}
                      className={`p-1 rounded-full transition-all ${playingAudio === metric.id ? 'bg-green-200 scale-110' : 'bg-gray-100'}`}
                    >
                      <Volume2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-1 leading-tight">
                    {language === 'en' ? metric.nameEn : metric.nameHi}
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

          <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-amber-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-gray-800 text-sm">
                {language === 'en' ? chartData.nameEn : chartData.nameHi}
              </h4>
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
            </div>
            
            <p className="text-xs text-gray-600 mb-4">
              😃 {tKey('bestMonth')} {chartData.bestMonth.month} ({chartData.bestMonth.value})
            </p>
            
            <div className="h-48 flex items-end justify-between gap-1">
              {chartData.data.map((value, idx) => {
                const maxValue = Math.max(...chartData.data);
                const height = (value / maxValue) * 100;
                const isBest = idx === chartData.bestMonth.index;
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

          <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-amber-200">
            <h4 className="font-bold text-gray-800 mb-4 text-sm">
              {tKey('howCompare')}
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
                      {language === 'en' ? labels[key].en : labels[key].hi}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-20">{tKey('districtLabel')}</span>
                        <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${isAhead ? 'bg-green-600' : 'bg-red-600'} rounded-full flex items-center justify-end pr-2`}
                            style={{ width: `${values.district}%` }}
                          >
                            <span className="text-xs font-bold text-white">{values.district}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-20">{tKey('stateLabel')}</span>
                        <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${values.state}%` }}
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

          <button
            onClick={() => setCurrentPage('share')}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all hover:shadow-xl active:scale-95"
          >
            <Share2 className="w-5 h-5" />
            <span>{tKey('shareReport')}</span>
          </button>
        </div>

        <button
          onClick={() => setCurrentPage('help')}
          className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-xl hover:bg-green-700 transition-all active:scale-95"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>
    );
  }

  if (currentPage === 'help') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 p-4 pb-20">
        <div className="max-w-md mx-auto">
          <button 
            onClick={() => setCurrentPage('home')}
            className="text-green-700 mb-6 flex items-center gap-2 hover:underline font-semibold"
          >
            ← {tKey('back')}
          </button>
          
          <h2 className="text-3xl font-bold text-green-800 mb-6">
            {tKey('helpGlossary')}
          </h2>

          <div className="space-y-4">
            {glossaryItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl shadow-md border-2 border-green-200 hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-800">
                    {language === 'en' ? item.titleEn : item.titleHi}
                  </h3>
                  <button
                    onClick={() => playAudio(item.id)}
                    className={`p-2 rounded-full ${playingAudio === item.id ? 'bg-green-200' : 'bg-gray-100'}`}
                  >
                    <Volume2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  {language === 'en' ? item.descEn : item.descHi}
                </p>
              </div>
            ))}

            <div className="bg-amber-100 p-6 rounded-2xl border-2 border-amber-300">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-700" />
                {tKey('needMoreHelp')}
              </h3>
              <p className="text-gray-700 mb-4">
                {tKey('callHelp')}
              </p>
              <p className="font-bold text-green-800">
                📞 1800-XXX-XXXX
              </p>
            </div>
          </div>

          <div className="fixed bottom-6 left-0 right-0 px-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="w-full max-w-md mx-auto bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-95"
            >
              {tKey('switchLanguage')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'share') {
    const data = mockDistrictData[selectedDistrict];
    const topMetrics = data.categories[activeCategory].slice(0, 3);

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 p-4">
        <div className="max-w-md mx-auto">
          <button 
            onClick={() => setCurrentPage('dashboard')}
            className="text-green-700 mb-6 flex items-center gap-2 hover:underline font-semibold"
          >
            ← {tKey('back')}
          </button>
          
          <h2 className="text-2xl font-bold text-green-800 mb-6">
            {tKey('shareReport')}
          </h2>

          <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-300 mb-6">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                {language === 'en' ? data.name.en : data.name.hi}
              </h3>
              <p className="text-sm text-gray-600">
                {tKey('viewReport')} - October 2025
              </p>
              <div className={`inline-block ${getStatusColor(data.status)} px-4 py-2 rounded-full font-semibold text-white mt-3`}>
                {getStatusText(data.status)}
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              {topMetrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.id} className="flex items-center justify-between bg-green-50 p-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-green-700" />
                      <span className="text-sm font-semibold text-gray-700">
                        {language === 'en' ? metric.nameEn : metric.nameHi}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {typeof metric.value === 'number' ? metric.value.toLocaleString('en-IN') : metric.value}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-center text-xs text-gray-500 mt-4">
              {tKey('viewFullReportAt')} mgnrega-jharkhand.gov.in
            </p>
          </div>

          <button
            onClick={() => alert(tKey('shareToWhatsApp'))}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-5 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all hover:shadow-xl active:scale-95"
          >
            <Share2 className="w-6 h-6" />
            <span className="text-lg">{tKey('shareToWhatsApp')}</span>
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            {tKey('shareThisReport')}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
