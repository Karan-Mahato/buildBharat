import { Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { transformDistrictData } from "../utils/dataTransform";

export default function Share({ 
  selectedState, 
  selectedDistrict, 
  districtData,
  activeCategory = 'employment',
  onNavigateToDashboard,
  language
}) {
  const { t, i18n } = useTranslation();

  if (!districtData || !selectedDistrict) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{t("loading")}</p>
          <button
            onClick={onNavigateToDashboard}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            {t("back")}
          </button>
        </div>
      </div>
    );
  }

  const data = transformDistrictData(districtData, selectedDistrict, selectedState);
  const topMetrics = data?.categories[activeCategory]?.slice(0, 3) || [];

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

  const handleShare = () => {
    const text = `${selectedDistrict} MGNREGA Report\n\n${topMetrics.map(m => `${i18n.language === 'hi' ? m.nameHi : m.nameEn}: ${m.value}`).join('\n')}\n\nView full report at mgnrega-jharkhand.gov.in`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 p-4">
      <div className="max-w-md mx-auto">
        <button 
          onClick={onNavigateToDashboard}
          className="text-green-700 mb-6 flex items-center gap-2 hover:underline font-semibold"
        >
          ← {t("back")}
        </button>
        
        <h2 className="text-2xl font-bold text-green-800 mb-6">
          {t("shareReport")}
        </h2>

        <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-300 mb-6">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-green-800 mb-2">
              {i18n.language === 'hi' ? data?.name.hi : data?.name.en}
            </h3>
            <p className="text-sm text-gray-600">
              {t("viewReport")} - {data?.month?.en || new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </p>
            <div className={`inline-block ${getStatusColor(data?.status)} px-4 py-2 rounded-full font-semibold text-white mt-3`}>
              {getStatusText(data?.status)}
            </div>
          </div>

          <div className="space-y-3 border-t pt-4">
            {topMetrics.map((metric) => {
              const IconComponent = () => <span className="text-xl">{metric.icon || '📊'}</span>;
              return (
                <div key={metric.id} className="flex items-center justify-between bg-green-50 p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <IconComponent />
                    <span className="text-sm font-semibold text-gray-700">
                      {i18n.language === 'hi' ? metric.nameHi : metric.nameEn}
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
            {t("viewFullReportAt")} mgnrega-jharkhand.gov.in
          </p>
        </div>

        <button
          onClick={handleShare}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-5 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all hover:shadow-xl active:scale-95"
        >
          <Share2 className="w-6 h-6" />
          <span className="text-lg">{t("shareToWhatsApp")}</span>
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          {t("shareThisReport")}
        </p>
      </div>
    </div>
  );
}

