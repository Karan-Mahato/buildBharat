import { useState } from "react";
import { Volume2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const glossaryItems = [
  {
    id: 'jobcard',
    titleEn: 'Job Card',
    titleHi: 'जॉब कार्ड',
    descEn: 'A document issued to every rural household that is willing to take up unskilled manual work under MGNREGA.',
    descHi: 'एक दस्तावेज़ जो प्रत्येक ग्रामीण परिवार को जारी किया जाता है जो MGNREGA के तहत अकुशल मैनुअल काम करने को तैयार है।'
  },
  {
    id: 'persondays',
    titleEn: 'Persondays',
    titleHi: 'व्यक्ति-दिवस',
    descEn: 'Total workdays generated. One person working for one day equals one personday.',
    descHi: 'कुल उत्पन्न कार्य दिवस। एक व्यक्ति एक दिन काम करना एक व्यक्ति-दिवस के बराबर है।'
  },
  {
    id: 'timely',
    titleEn: 'Timely Payment',
    titleHi: 'समय पर भुगतान',
    descEn: 'Payment made within 15 days of completion of work.',
    descHi: 'कार्य पूरा होने के 15 दिनों के भीतर किया गया भुगतान।'
  },
  {
    id: 'wage',
    titleEn: 'Wage Rate',
    titleHi: 'मज़दूरी दर',
    descEn: 'The minimum wage paid per day for work under MGNREGA.',
    descHi: 'MGNREGA के तहत काम के लिए प्रति दिन भुगतान की जाने वाली न्यूनतम मज़दूरी।'
  },
  {
    id: 'works',
    titleEn: 'Works',
    titleHi: 'कार्य',
    descEn: 'Infrastructure development activities undertaken under MGNREGA such as water conservation, irrigation, roads, etc.',
    descHi: 'MGNREGA के तहत की गई बुनियादी ढांचा विकास गतिविधियां जैसे जल संरक्षण, सिंचाई, सड़कें आदि।'
  }
];

export default function Help({ onNavigateToHome, language, setLanguage }) {
  const { t, i18n } = useTranslation();
  const [playingAudio, setPlayingAudio] = useState(null);

  const playAudio = (itemId) => {
    setPlayingAudio(itemId);
    setTimeout(() => setPlayingAudio(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 p-4 pb-20">
      <div className="max-w-md mx-auto">
        <button 
          onClick={onNavigateToHome}
          className="text-green-700 mb-6 flex items-center gap-2 hover:underline font-semibold"
        >
          ← {t("back")}
        </button>
        
        <h2 className="text-3xl font-bold text-green-800 mb-6">
          {t("helpGlossary")}
        </h2>

        <div className="space-y-4">
          {glossaryItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-2xl shadow-md border-2 border-green-200 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-800">
                  {i18n.language === 'hi' ? item.titleHi : item.titleEn}
                </h3>
                <button
                  onClick={() => playAudio(item.id)}
                  className={`p-2 rounded-full ${playingAudio === item.id ? 'bg-green-200' : 'bg-gray-100'}`}
                >
                </button>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                {i18n.language === 'hi' ? item.descHi : item.descEn}
              </p>
            </div>
          ))}

          <div className="bg-amber-100 p-6 rounded-2xl border-2 border-amber-300">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-700" />
              {t("needMoreHelp")}
            </h3>
            <p className="text-gray-700 mb-4">
              {t("callHelp")}
            </p>
            <p className="font-bold text-green-800">
              📞 1800-XXX-XXXX
            </p>
          </div>
        </div>

        <div className="fixed bottom-6 left-0 right-0 px-4">
          <button
            onClick={() => {
              const newLang = language === 'en' ? 'hi' : 'en';
              setLanguage(newLang);
              i18n.changeLanguage(newLang);
            }}
            className="w-full max-w-md mx-auto bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-95"
          >
            {t("switchLanguage")}
          </button>
        </div>
      </div>
    </div>
  );
}

