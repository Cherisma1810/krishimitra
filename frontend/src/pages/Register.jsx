import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { Sprout, AlertCircle, BookOpen } from 'lucide-react';

const REGIONAL_MANDALS = {
  "Tirupati": ["Chandragiri", "Tirupati Urban", "Tirupati Rural", "Renigunta", "Yerpedu", "Srikalahasti", "Puttur", "Nagari", "Venkatagiri", "Sullurpeta"],
  "Chittoor": ["Chittoor", "Palamaner", "Kuppam", "Bangarupalem", "Punganur", "Nagari", "Karvetinagar"],
  "Annamayya": ["Rayachoti", "Madanapalle", "Pileru", "Rajampet", "Railway Koduru"]
};

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    password: '',
    district: 'Tirupati',
    mandal: 'Chandragiri',
    village: '',
    khata_number: '',
    survey_number: '',
    preferred_language: 'te',
    total_acreage: '',
    irrigation_source: 'Borewell'
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleDistrictChange = (e) => {
    const selectedDist = e.target.value;
    const defaultMandal = REGIONAL_MANDALS[selectedDist][0];
    setFormData({ ...formData, district: selectedDist, mandal: defaultMandal });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = {
      phone_number: formData.phone_number,
      password: formData.password,
      full_name: formData.full_name,
      role: 'farmer',
      profile: {
        state: 'Andhra Pradesh',
        district: formData.district,
        mandal: formData.mandal,
        village: formData.village,
        khata_number: formData.khata_number || null,
        survey_number: formData.survey_number || null,
        preferred_language: formData.preferred_language,
        total_acreage: formData.total_acreage || null,
        irrigation_source: formData.irrigation_source
      }
    };

    try {
      await authService.register(payload);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d) => `${d.loc[d.loc.length - 1]}: ${d.msg}`).join(', '));
      } else if (typeof detail === 'string') {
        setError(detail);
      } else {
        setError(err.message || 'Server error. Check terminal logs.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-stone-200 p-8">
        <div className="flex items-center space-x-3 mb-6 border-b pb-4">
          <Sprout className="h-8 w-8 text-emerald-700" />
          <div>
            <h2 className="text-xl font-bold text-stone-800">రైతు నమోదు (Farmer Registration)</h2>
            <p className="text-xs text-stone-500">Tirupati, Chittoor & Annamayya Districts Pilot</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                రైతు పూర్తి పేరు (Full Name)
              </label>
              <input
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Farmer name"
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                మొబైల్ సంఖ్య (10-Digit Mobile)
              </label>
              <input
                type="tel"
                name="phone_number"
                required
                maxLength="10"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
              పాస్‌వర్డ్ / Password (min 8 characters)
            </label>
            <input
              type="password"
              name="password"
              required
              minLength="8"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Regional Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">జిల్లా (District)</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleDistrictChange}
                className="w-full px-3 py-2 border rounded-md text-sm bg-white focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Tirupati">Tirupati (తిరుపతి)</option>
                <option value="Chittoor">Chittoor (చిత్తూరు)</option>
                <option value="Annamayya">Annamayya (అన్నమయ్య)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">మండలం (Mandal)</label>
              <select
                name="mandal"
                value={formData.mandal}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-sm bg-white focus:ring-2 focus:ring-emerald-600"
              >
                {REGIONAL_MANDALS[formData.district].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">గ్రామం (Village)</label>
              <input
                type="text"
                name="village"
                required
                value={formData.village}
                onChange={handleChange}
                placeholder="e.g. Peruru / Damalcheruvu"
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* AP Meebhoomi Passbook Section */}
          <div className="border border-emerald-200 bg-emerald-50/60 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-semibold text-xs uppercase">
              <BookOpen className="h-4 w-4 text-emerald-700" />
              <span>పట్టాదారు పాస్‌బుక్ వివరాలు (AP Meebhoomi Passbook Details)</span>
            </div>
            <p className="text-[11px] text-stone-500">
              రైతులకు జీపీఎస్ వివరాలు అవసరం లేదు. మీ పాస్‌బుక్‌లోని ఖాతా సంఖ్య లేదా సర్వే సంఖ్యను నమోదు చేయండి.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  పాస్‌బుక్ ఖాతా సంఖ్య (Khata No.)
                </label>
                <input
                  type="text"
                  name="khata_number"
                  value={formData.khata_number}
                  onChange={handleChange}
                  placeholder="e.g. 1420"
                  className="w-full px-3 py-1.5 border rounded text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  భూమి సర్వే సంఖ్య (Survey / Sub-Div No.)
                </label>
                <input
                  type="text"
                  name="survey_number"
                  value={formData.survey_number}
                  onChange={handleChange}
                  placeholder="e.g. 152/2B"
                  className="w-full px-3 py-1.5 border rounded text-sm bg-white"
                />
              </div>
            </div>
          </div>

          {/* Farm Acreage and Irrigation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">విస్తీర్ణం (Acres)</label>
              <input
                type="number"
                step="0.1"
                name="total_acreage"
                value={formData.total_acreage}
                onChange={handleChange}
                placeholder="e.g. 3.0"
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">నీటి వనరు (Irrigation)</label>
              <select
                name="irrigation_source"
                value={formData.irrigation_source}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-sm bg-white focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Borewell">Borewell (బోరు బావి)</option>
                <option value="Canal">Canal (కాలువ)</option>
                <option value="Rainfed">Rainfed (వర్షాధారం)</option>
                <option value="Drip Irrigation">Drip Irrigation (బిందు సేద్యం)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">భాష (Language)</label>
              <select
                name="preferred_language"
                value={formData.preferred_language}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-sm bg-white focus:ring-2 focus:ring-emerald-600"
              >
                <option value="te">Telugu (తెలుగు)</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-3 rounded-md transition shadow disabled:opacity-50 mt-4"
          >
            {submitting ? 'నమోదు జరుగుతోంది...' : 'రైతు ఖాతా పూర్తి చేయండి (Complete Registration)'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-stone-600">
          ఇప్పటికే ఖాతా ఉందా?{' '}
          <Link to="/login" className="text-emerald-700 font-semibold hover:underline">
            లాగిన్ అవ్వండి (Sign In)
          </Link>
        </div>
      </div>
    </div>
  );
}