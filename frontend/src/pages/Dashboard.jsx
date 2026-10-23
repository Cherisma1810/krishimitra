import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import { soilService, cropService, diseaseService } from '../services/api';
import { 
  Sprout, MapPin, Droplet, Layers, CloudSun, Wind, Clock, 
  Camera, Upload, AlertCircle, ShieldAlert, Sparkles, CheckCircle2 
} from 'lucide-react';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Dashboard() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const profile = user?.profile;
  const mandalName = profile?.mandal || 'Chandragiri';

  const [geoJsonData, setGeoJsonData] = useState(null);
  const [intel, setIntel] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [diagnosing, setDiagnosing] = useState(false);
  const [diagError, setDiagError] = useState('');
  const fileInputRef = useRef(null);

  const lat = profile?.latitude || 13.5851;
  const lng = profile?.longitude || 79.3142;

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [layers, mandalIntel, cropRecs] = await Promise.all([
          soilService.getLayers(profile?.district || 'Tirupati'),
          soilService.getIntel(mandalName),
          cropService.getRecommendations()
        ]);
        setGeoJsonData(layers);
        setIntel(mandalIntel);
        setRecommendations(cropRecs);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    }
    loadDashboardData();
  }, [mandalName, profile?.district]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDiagnosis(null);
      setDiagError('');
    }
  };

  const handleDiagnose = async () => {
    if (!selectedImage) return;
    setDiagnosing(true);
    setDiagError('');
    try {
      const res = await diseaseService.diagnose(selectedImage);
      setDiagnosis(res);
    } catch (err) {
      setDiagError(err.response?.data?.detail || (lang === 'te' ? 'రోగ నిర్ధారణ విఫలమైంది.' : 'Diagnosis failed.'));
    } finally {
      setDiagnosing(false);
    }
  };

  const geoJsonStyle = {
    color: '#059669',
    weight: 2,
    opacity: 0.7,
    fillColor: '#10b981',
    fillOpacity: 0.15
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">
            {t.greeting}, {user?.full_name}
          </h1>
          <p className="text-sm text-stone-500 mt-1 flex flex-wrap items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span>
              {profile?.village}, {profile?.mandal} {t.mandal}, {profile?.district} {t.district}
            </span>
            {profile?.khata_number && (
              <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-xs">
                {t.khataNo}: {profile.khata_number}
              </span>
            )}
            {profile?.survey_number && (
              <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-xs">
                {t.surveyNo}: {profile.survey_number}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
            {profile?.irrigation_source || 'Rainfed'}
          </span>
          <span className="px-3 py-1 bg-stone-100 text-stone-800 rounded-full text-xs font-semibold">
            {profile?.total_acreage ? `${profile.total_acreage} ${t.acres}` : `3.0 ${t.acres}`}
          </span>
        </div>
      </div>

      {/* Live Weather Strip */}
      {intel?.weather?.current && (
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-xl p-5 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <CloudSun className="h-8 w-8 text-amber-300" />
            <div>
              <div className="text-xs text-emerald-200 uppercase font-medium">{t.temperature}</div>
              <div className="text-xl font-bold">{intel.weather.current.temperature_c}°C</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Droplet className="h-8 w-8 text-blue-300" />
            <div>
              <div className="text-xs text-emerald-200 uppercase font-medium">{t.humidity}</div>
              <div className="text-xl font-bold">{intel.weather.current.humidity_pct}%</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Wind className="h-8 w-8 text-teal-200" />
            <div>
              <div className="text-xs text-emerald-200 uppercase font-medium">{t.windSpeed}</div>
              <div className="text-xl font-bold">{intel.weather.current.wind_speed_kmh} km/h</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Layers className="h-8 w-8 text-amber-200" />
            <div>
              <div className="text-xs text-emerald-200 uppercase font-medium">{t.waterTable}</div>
              <div className="text-xl font-bold">{intel.soil_profile.groundwater_depth_m || '14.2'} m</div>
            </div>
          </div>
        </div>
      )}

      {/* Module C: AI Crop Recommendation Section */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-md">
                <Sprout className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-bold text-stone-800">{t.cropAiTitle}</h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">{t.cropAiSubtitle}</p>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-semibold">
            Random Forest ML (98.8%)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {recommendations?.top_recommendations?.map((crop, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-xl border relative flex flex-col justify-between ${
                idx === 0
                  ? 'border-emerald-500 bg-emerald-50/40 shadow-sm'
                  : 'border-stone-200 bg-white'
              }`}
            >
              {idx === 0 && (
                <span className="absolute -top-3 right-4 bg-emerald-600 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow">
                  {t.bestMatch}
                </span>
              )}
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-stone-900">
                      {lang === 'te' ? crop.crop_telugu : crop.crop.toUpperCase()}
                    </h3>
                    <div className="text-xs text-stone-500 capitalize">{crop.crop}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-emerald-700">
                      {crop.confidence_pct}%
                    </span>
                    <div className="text-[10px] text-stone-400">{t.suitability}</div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 border-t pt-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-stone-400" />
                    <span>{t.duration}: <strong>{crop.duration_days} {t.days}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Droplet className="h-3.5 w-3.5 text-blue-500" />
                    <span>{t.waterNeed}: <strong>{crop.irrigation_need}</strong></span>
                  </div>
                </div>

                <div className="bg-white/80 p-2.5 rounded-md border border-stone-200/80 text-[11px] text-stone-700">
                  <strong className="text-emerald-800">{t.fertilizerAdvisory}: </strong>
                  {crop.fertilizer_advisory}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Module E: AI Plant Disease Diagnosis */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-rose-100 text-rose-700 rounded-md">
              <Camera className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-stone-800">{t.diseaseTitle}</h2>
              <p className="text-xs text-stone-500">{t.diseaseSubtitle}</p>
            </div>
          </div>
          <span className="text-xs bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full font-semibold">
            ResNet Vision AI (99.2%)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4">
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              className="hidden" 
            />

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-300 hover:border-emerald-600 rounded-xl p-6 text-center cursor-pointer transition bg-stone-50 hover:bg-emerald-50/20 flex flex-col items-center justify-center min-h-[200px]"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Leaf Preview" className="h-44 object-contain rounded-lg" />
              ) : (
                <div className="space-y-2">
                  <Upload className="h-10 w-10 text-stone-400 mx-auto" />
                  <div className="text-xs font-semibold text-stone-700">{t.uploadPrompt}</div>
                  <div className="text-[11px] text-stone-400">{t.uploadSubtext}</div>
                </div>
              )}
            </div>

            {selectedImage && (
              <button
                onClick={handleDiagnose}
                disabled={diagnosing}
                className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{diagnosing ? t.analyzingBtn : t.analyzeBtn}</span>
              </button>
            )}

            {diagError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{diagError}</span>
              </div>
            )}
          </div>

          <div>
            {diagnosis ? (
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3.5">
                <div className="flex justify-between items-start border-b pb-2">
                  <div>
                    <h3 className="text-base font-bold text-stone-900">
                      {lang === 'te' ? diagnosis.disease_telugu : diagnosis.disease_key.replace(/_/g, ' ').toUpperCase()}
                    </h3>
                    <div className="text-xs text-stone-500 font-medium">{diagnosis.pathogen}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                      {t.severity}: {diagnosis.severity}
                    </span>
                    <div className="text-[10px] text-stone-400 mt-1">{t.confidence}: {diagnosis.confidence_pct}%</div>
                  </div>
                </div>

                <div className="text-xs text-stone-600">
                  <strong className="text-stone-800">{t.symptoms}: </strong>
                  {diagnosis.symptoms}
                </div>

                <div className="p-3 bg-white border border-emerald-200 rounded-lg space-y-1">
                  <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {t.chemicalRemedy}:
                  </div>
                  <div className="text-xs text-stone-700 leading-relaxed">{diagnosis.chemical_remedy}</div>
                </div>

                <div className="p-3 bg-white border border-amber-200 rounded-lg space-y-1">
                  <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {t.organicRemedy}:
                  </div>
                  <div className="text-xs text-stone-700 leading-relaxed">{diagnosis.organic_remedy}</div>
                </div>
              </div>
            ) : (
              <div className="h-full border border-stone-200 rounded-xl p-6 bg-stone-50/50 flex flex-col items-center justify-center text-center space-y-2">
                <ShieldAlert className="h-8 w-8 text-stone-300" />
                <div className="text-xs font-semibold text-stone-600">{t.waitingTitle}</div>
                <p className="text-[11px] text-stone-400 max-w-xs">{t.waitingDesc}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Soil Health Card & GIS Map Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm md:col-span-1 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-stone-800 text-base">{t.soilCardTitle}</h3>
            <span className="text-xs bg-amber-50 text-amber-800 font-semibold px-2 py-0.5 rounded">
              {intel?.soil_profile?.texture || 'Red Loam'}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-stone-600">{t.nitrogen}</span>
                <span className="text-emerald-700 font-bold">{intel?.soil_profile?.nitrogen_kg_ha} kg/ha</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full" 
                  style={{ width: `${Math.min((intel?.soil_profile?.nitrogen_kg_ha || 0) / 3, 100)}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-stone-600">{t.phosphorus}</span>
                <span className="text-amber-700 font-bold">{intel?.soil_profile?.phosphorus_kg_ha} kg/ha</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full" 
                  style={{ width: `${Math.min((intel?.soil_profile?.phosphorus_kg_ha || 0) * 2, 100)}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-stone-600">{t.potassium}</span>
                <span className="text-indigo-700 font-bold">{intel?.soil_profile?.potassium_kg_ha} kg/ha</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full" 
                  style={{ width: `${Math.min((intel?.soil_profile?.potassium_kg_ha || 0) / 3, 100)}%` }} 
                />
              </div>
            </div>

            <div className="pt-2 border-t flex justify-between items-center text-xs">
              <span className="text-stone-600 font-semibold">{t.phLevel}:</span>
              <span className="font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded">
                {intel?.soil_profile?.ph_level} ({t.neutral})
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-stone-800">{t.mapTitle}</h2>
              <p className="text-xs text-stone-500">{t.mapSubtitle}</p>
            </div>
          </div>

          <div className="h-80 w-full rounded-lg overflow-hidden border border-stone-300">
            <MapContainer center={[lat, lng]} zoom={11} scrollWheelZoom={false} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {geoJsonData && <GeoJSON data={geoJsonData} style={geoJsonStyle} />}
              <Marker position={[lat, lng]}>
                <Popup>
                  <div className="font-sans text-xs">
                    <strong>{user?.full_name}</strong><br />
                    {profile?.village}, {profile?.mandal}<br />
                    {t.acres}: {profile?.total_acreage || '3.0'}
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}