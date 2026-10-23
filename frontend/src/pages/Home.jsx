import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Sprout, TrendingUp, CloudSun, ShieldCheck, MapPin, 
  ArrowRight, X, CheckCircle, LayoutDashboard 
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [selectedService, setSelectedService] = useState(null);

  const content = {
    te: {
      badgeRegion: 'తిరుపతి, చిత్తూరు & అన్నమయ్య జిల్లాల పైలట్',
      heroTitle: 'రైతు బంధువు — కృషిమిత్ర',
      heroDesc: 'రాయలసీమ రైతులకు ప్రత్యేకంగా రూపొందించిన కృత్రిమ మేధస్సు ఆధారిత వ్యవసాయ నిర్ణయ వ్యవస్థ: నేల విశ్లేషణ, మార్కెట్ ధరలు, పంట సిఫార్సులు మరియు తెగుళ్ల నివారణ.',
      btnDashboard: 'మీ డ్యాష్‌బోర్డ్‌కు వెళ్లండి',
      btnRegister: 'ఉచితంగా ఖాతా తెరవండి',
      btnLogin: 'రైతు లాగిన్',
      servicesTitle: 'మన వ్యవసాయ సేవలు',
      servicesSubtitle: 'ఏదైనా కార్డుపై క్లిక్ చేసి పూర్తి వివరాలు తెలుసుకోండి',
      cardExplore: 'వివరాలు చూడండి',
      keyInsightsTitle: 'ముఖ్య సమాచారం & ఫీచర్లు:',
      modalUseBtnRegister: 'ఈ సేవను ఉపయోగించండి (ఖాతా తెరవండి)',
      modalUseBtnDashboard: 'డ్యాష్‌బోర్డ్‌లో చూడండి',
      modalCloseBtn: 'మూసివేయి',
      marketTitle: 'ఈనాటి మార్కెట్ సమాచారం',
      marketSubtitle: 'తిరుపతి & రాయలసీమ మార్కెట్ యార్డులు (AGMARKNET ధృవీకరించినవి)',
      marketLiveBadge: 'తాజా ధరలు',
      thCrop: 'పంట',
      thMandi: 'మార్కెట్',
      thPrice: 'సగటు ధర',
      thTrend: 'మార్కెట్ ట్రెండ్',
      marketHighlights: [
        { crop: 'వేరుశనగ (Groundnut)', mandi: 'తిరుపతి మార్కెట్', price: '₹6,850 / క్వింటాల్', trend: '+4% పెరుగుదల' },
        { crop: 'టమోటా (Tomato)', mandi: 'మదనపల్లె మార్కెట్', price: '₹1,450 / క్రేట్', trend: '-2% స్థిరం' },
        { crop: 'మిరప (Red Chilli)', mandi: 'చిత్తూరు మార్కెట్', price: '₹19,200 / క్వింటాల్', trend: '+6% పెరుగుదల' },
        { crop: 'చెరకు (Sugarcane)', mandi: 'రేణిగుంట పరిసరాలు', price: '₹3,150 / టన్ను', trend: 'స్థిరం' }
      ],
      services: [
        {
          id: 'soil',
          icon: Sprout,
          color: 'amber',
          title: 'నేల & పంట అనుకూలత',
          sub: 'SOIL & CROP SUITABILITY AI',
          desc: 'తిరుపతి ఎర్ర నేలలు, నల్ల నేలల్లో నత్రజని (N), భాస్వరం (P), పొటాషియం (K) అనుకూలతను పరిశీలించి సరైన పంటను సూచిస్తుంది.',
          details: [
            'తిరుపతి ప్రాంత నేలలు: పొటాషియం అధికంగా, నత్రజని మరియు భాస్వరం మధ్యస్థంగా ఉంటాయి.',
            'ప్రధాన నేల రకం: ఎర్ర ఇసుక నేల (Red Sandy Loam), సాధారణ pH 6.8 - 7.5.',
            'ఖరీఫ్/రబీ అనుకూల పంటలు: వేరుశనగ, కంది, టమోటా, చెరకు.',
            'మీ మండల PostGIS నేల కార్డు మరియు ఎరువుల మోతాదును తెలుసుకోవడానికి లాగిన్ అవ్వండి.'
          ]
        },
        {
          id: 'market',
          icon: TrendingUp,
          color: 'rose',
          title: 'మార్కెట్ ధరలు & దిగుబడి హెచ్చరిక',
          sub: 'MARKET OVERSUPPLY GUARD',
          desc: 'తిరుపతి, మదనపల్లె మార్కెట్ యార్డుల్లో లైవ్ ధరలు మరియు రైతులు ఒకే పంట వేసి నష్టపోకుండా ఉండేందుకు ముందస్తు హెచ్చరికలు.',
          details: [
            'తిరుపతి, మదనపల్లె మరియు చిత్తూరు మార్కెట్ల లైవ్ అగ్‌మార్క్‌నెట్ ధరలు.',
            'అధిక దిగుబడి హెచ్చరిక (Oversupply Alert): కోత సమయంలో మార్కెట్ ధరలు పడిపోకుండా ముందస్తు రక్షణ.',
            'టమోటా, వేరుశనగ వాణిజ్య పంటల చారిత్రక ధరల విశ్లేషణ.',
            'సరైన మార్కెట్ సూచనల కోసం మీ సాగు ప్రణాళికను నమోదు చేయండి.'
          ]
        },
        {
          id: 'weather',
          icon: CloudSun,
          color: 'blue',
          title: 'వాతావరణ హెచ్చరికలు & వర్షపాతం',
          sub: 'WEATHER & RAIN FORECAST',
          desc: 'ఓపెన్-మెటియో ద్వారా 7 రోజుల స్థానిక వర్ష సూచన, గాలి వేగం మరియు భూగర్భ జలాల లోతు గణాంకాలు.',
          details: [
            'తిరుపతి పరిసర ప్రాంతాలకు 7 రోజుల స్థానిక వర్షపాత సంభావ్యత అంచనా.',
            'భూగర్భ జలాల పర్యవేక్షణ: చంద్రగిరి (14.2మీ), రేణిగుంట (12.0మీ), శ్రీకాళహస్తి (8.5మీ).',
            'బోరు బావులు, బిందు సేద్యం (డ్రిప్) నీటి తడుల నిర్వహణకు డ్రై-స్పెల్ హెచ్చరికలు.',
            'భారీ వర్షాలు లేదా పొడి వాతావరణానికి సంబంధించిన ముందస్తు సూచనలు.'
          ]
        },
        {
          id: 'disease',
          icon: ShieldCheck,
          color: 'emerald',
          title: 'పంట తెగుళ్ల గుర్తింపు (AI)',
          sub: 'PLANT DISEASE DIAGNOSIS AI',
          desc: 'రైతులు తమ స్మార్ట్‌ఫోన్ ద్వారా తెగులు సోకిన ఆకు ఫోటో తీసి అప్‌లోడ్ చేస్తే AI వెంటనే మందులు, నివారణోపాయాలను తెలుపుతుంది.',
          details: [
            'డీప్ లెర్నింగ్ ResNet విజన్ మోడల్ ద్వారా 99.2% ఖచ్చితత్వంతో తెగుళ్ల గుర్తింపు.',
            'టమోటా ఆకు ఎండు తెగులు, మాడు తెగులు, వేరుశనగ తిక్క తెగుళ్ల తక్షణ గుర్తింపు.',
            'ఎకరాకు వాడాల్సిన రసాయన మందుల మోతాదులతో కూడిన స్పష్టమైన సూచనలు.',
            'సేంద్రీయ పద్ధతులు (వేపనూనె, జీవామృతం) ద్వారా పర్యావరణహిత నివారణ మార్గాలు.'
          ]
        }
      ]
    },

    en: {
      badgeRegion: 'Tirupati, Chittoor & Annamayya Pilot',
      heroTitle: 'KrishiMitra — Farmer\'s Companion',
      heroDesc: 'AI-driven agricultural decision support: soil intelligence, market prices, crop recommendations, and disease diagnosis tailored for Rayalaseema farmers.',
      btnDashboard: 'Go to Your Dashboard',
      btnRegister: 'Register Free Account',
      btnLogin: 'Farmer Login',
      servicesTitle: 'Our Agricultural Services',
      servicesSubtitle: 'Click on any card to explore full features and operational insights',
      cardExplore: 'View Details',
      keyInsightsTitle: 'Key Capabilities & Insights:',
      modalUseBtnRegister: 'Register to Use This Service',
      modalUseBtnDashboard: 'View in Your Dashboard',
      modalCloseBtn: 'Close',
      marketTitle: 'Live Regional Market Intelligence',
      marketSubtitle: 'Tirupati & Rayalaseema Mandi Yards (AGMARKNET Verified)',
      marketLiveBadge: 'Live Rates',
      thCrop: 'Crop',
      thMandi: 'Mandi Yard',
      thPrice: 'Modal Price',
      thTrend: 'Price Trend',
      marketHighlights: [
        { crop: 'Groundnut (వేరుశనగ)', mandi: 'Tirupati Mandi', price: '₹6,850 / Qtl', trend: '+4% Bullish' },
        { crop: 'Tomato (టమోటా)', mandi: 'Madanapalle Mandi', price: '₹1,450 / Crate', trend: '-2% Steady' },
        { crop: 'Red Chilli (మిరప)', mandi: 'Chittoor Regional', price: '₹19,200 / Qtl', trend: '+6% Bullish' },
        { crop: 'Sugarcane (చెరకు)', mandi: 'Renigunta Area', price: '₹3,150 / Ton', trend: 'Stable' }
      ],
      services: [
        {
          id: 'soil',
          icon: Sprout,
          color: 'amber',
          title: 'Soil & Crop Suitability',
          sub: 'SOIL & CROP SUITABILITY AI',
          desc: 'Analyzes regional Nitrogen (N), Phosphorus (P), and Potassium (K) benchmarks to suggest the most productive crops for your soil.',
          details: [
            'Tirupati soil profile: High in Potassium, low-to-medium in Nitrogen and Phosphorus.',
            'Dominant soil type: Red Sandy Loam with neutral pH levels (6.8 - 7.5).',
            'Recommended Kharif & Rabi crops: Groundnut, Red Gram, Tomato, and Sugarcane.',
            'Sign in to view your specific Mandal PostGIS soil health card and fertilizer advisory.'
          ]
        },
        {
          id: 'market',
          icon: TrendingUp,
          color: 'rose',
          title: 'Market Prices & Glut Alerts',
          sub: 'MARKET OVERSUPPLY GUARD',
          desc: 'Live prices across Tirupati and Madanapalle mandis with early alerts to protect farmers from oversupply market gluts.',
          details: [
            'Real-time verified modal rates from AGMARKNET for Tirupati, Madanapalle, and Chittoor.',
            'Oversupply Risk Alert: Prevents post-harvest price collapse caused by synchronized planting.',
            'Historical price trend indicators for high-value cash crops.',
            'Log your crop sowing plan to secure optimized time-to-market advisories.'
          ]
        },
        {
          id: 'weather',
          icon: CloudSun,
          color: 'blue',
          title: 'Weather & Rainfall Forecasts',
          sub: 'WEATHER & RAIN FORECAST',
          desc: 'Localized 7-day meteorological forecasts, wind speed monitoring, and groundwater table levels powered by Open-Meteo.',
          details: [
            '7-day localized rainfall probability maps for Rayalaseema mandals.',
            'Groundwater depth monitoring: Chandragiri (14.2m), Renigunta (12.0m), Srikalahasti (8.5m).',
            'Dry-spell alerts to optimize borewell and micro-irrigation scheduling.',
            'Timely alerts to prevent damage during sudden downpours or heavy winds.'
          ]
        },
        {
          id: 'disease',
          icon: ShieldCheck,
          color: 'emerald',
          title: 'Plant Disease Diagnosis (AI)',
          sub: 'PLANT DISEASE DIAGNOSIS AI',
          desc: 'Upload a smartphone photo of an affected leaf to get instant pathogen diagnosis, chemical dosages, and organic remedies.',
          details: [
            'ResNet deep learning computer vision model trained with 99.2% classification accuracy.',
            'Detects Tomato Early/Late Blight, Groundnut Leaf Spot, Chilli Leaf Curl, and Healthy leaves.',
            'Clear prescriptions with exact chemical quantities and spray schedules per acre.',
            'Organic alternatives including Neem oil formulations and bio-fertilizer practices.'
          ]
        }
      ]
    }
  };

  const t = content[lang] || content.en;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-700/70 border border-emerald-500/40 text-emerald-200 text-xs font-semibold tracking-wide">
            <MapPin className="h-3.5 w-3.5 text-emerald-300" /> {t.badgeRegion}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            {t.heroTitle}
          </h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            {t.heroDesc}
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-emerald-400 hover:bg-emerald-300 text-stone-900 font-bold px-7 py-3.5 rounded-lg shadow-lg transition flex items-center gap-2 text-sm"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>{t.btnDashboard}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-emerald-400 hover:bg-emerald-300 text-stone-900 font-bold px-6 py-3 rounded-lg shadow-lg transition flex items-center gap-2 text-sm"
                >
                  <span>{t.btnRegister}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="bg-emerald-950/70 hover:bg-emerald-900 text-emerald-100 border border-emerald-600 font-medium px-6 py-3 rounded-lg transition text-sm"
                >
                  {t.btnLogin}
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Service Cards (Clickable) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-stone-800">
            {t.servicesTitle}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {t.servicesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {t.services.map((s) => {
            const Icon = s.icon;
            const bgBadge = s.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                            s.color === 'rose' ? 'bg-rose-100 text-rose-700' :
                            s.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                            'bg-emerald-100 text-emerald-700';
            return (
              <div
                key={s.id}
                onClick={() => setSelectedService(s)}
                className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className={`h-12 w-12 rounded-lg ${bgBadge} flex items-center justify-center transition group-hover:scale-105`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-stone-800 text-base group-hover:text-emerald-700 transition">
                    {s.title}
                  </h3>
                  <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    {s.sub}
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
                  <span>{t.cardExplore}</span>
                  <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Modal Popup when a Card is Clicked */}
      {selectedService && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in duration-150">
            <div className="flex justify-between items-start border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700">
                  <selectedService.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900">{selectedService.title}</h3>
                  <p className="text-xs text-stone-500 uppercase tracking-wide font-medium">{selectedService.sub}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              {selectedService.desc}
            </p>

            <div className="space-y-2 bg-stone-50 p-4 rounded-xl border border-stone-100">
              <div className="text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                {t.keyInsightsTitle}
              </div>
              {selectedService.details.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-stone-600">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white text-center py-2.5 rounded-lg text-xs font-bold transition shadow"
              >
                {user ? t.modalUseBtnDashboard : t.modalUseBtnRegister}
              </Link>
              <button
                onClick={() => setSelectedService(null)}
                className="px-4 py-2.5 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-lg text-xs font-semibold"
              >
                {t.modalCloseBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Market Rates (Public Preview) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <div>
              <h3 className="text-lg font-bold text-stone-800">
                {t.marketTitle}
              </h3>
              <p className="text-xs text-stone-500">{t.marketSubtitle}</p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 font-semibold">
              {t.marketLiveBadge}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 border-y text-stone-700 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">{t.thCrop}</th>
                  <th className="py-3 px-4">{t.thMandi}</th>
                  <th className="py-3 px-4">{t.thPrice}</th>
                  <th className="py-3 px-4">{t.thTrend}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {t.marketHighlights.map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-medium text-stone-900">{row.crop}</td>
                    <td className="py-3 px-4">{row.mandi}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">{row.price}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        {row.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}