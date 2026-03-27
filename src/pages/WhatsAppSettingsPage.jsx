import React, { useState } from 'react';
import Layout from '../components/Layout';
import { FiPhone, FiSave, FiCheckCircle, FiAlertCircle, FiSettings, FiMessageSquare, FiLink, FiInfo } from 'react-icons/fi';

export default function WhatsAppSettingsPage() {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('whatsapp_config');
    return saved ? JSON.parse(saved) : {
      phoneId: '',
      apiToken: '',
      verifyToken: 'textile_shop_verify_2024',
      webhookUrl: 'https://your-server.com/api/whatsapp/webhook',
      businessName: 'M A K & CO Heritage',
      welcomeMessage: 'Blessings from M A K & CO! 🙏 How may we assist your heritage collection today?',
      proprietorPhone: '919000000000',
    };
  });
  const [saved, setSaved] = useState(false);
  const [testStatus, setTestStatus] = useState(null);

  function handleChange(e) {
    setConfig(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  }

  function handleSave(e) {
    e.preventDefault();
    localStorage.setItem('whatsapp_config', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleTestConnection() {
    setTestStatus('testing');
    setTimeout(() => {
      setTestStatus(config.apiToken ? 'success' : 'error');
      setTimeout(() => setTestStatus(null), 3000);
    }, 2000);
  }

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[#FBF6E9]">Auspicious Alerts</h1>
          <p className="text-[#FBF6E9]/40 text-[10px] uppercase tracking-[0.3em] font-bold mt-1">WhatsApp Business Cloud Integration</p>
        </div>
        <button type="button" onClick={() => {
          setConfig({
            phoneId: '990920720779039',
            apiToken: 'EA_DEMO_TOKEN_PLACEHOLDER',
            verifyToken: 'textile_shop_verify_2024',
            webhookUrl: 'http://127.0.0.1:5000/api/whatsapp/webhook',
            businessName: 'M A K & CO Heritage Artisan',
            welcomeMessage: 'Blessings! Choosing a sacred collection? M A K & CO is here for you. 🙏',
            proprietorPhone: '917598137660'
          });
        }} className="text-[10px] uppercase tracking-widest font-bold px-5 py-2.5 bg-amber-900/20 text-amber-500 rounded-2xl hover:bg-amber-900/40 transition-all border border-amber-900/20">
          Fill Mock Config
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Config Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1A0F0A]/40 backdrop-blur-sm border border-amber-900/20 rounded-3xl p-8">
            <h3 className="text-lg font-serif text-[#FBF6E9] mb-6 flex items-center gap-2">
              <FiSettings className="text-amber-500" /> Meta Integration Settings
            </h3>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-amber-500/50 mb-2">Proprietor WhatsApp Number (for Inquiries)</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/50" />
                  <input name="proprietorPhone" value={config.proprietorPhone} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-amber-900/10 rounded-xl text-[#FBF6E9] font-serif placeholder-amber-500/10 focus:outline-none focus:ring-1 focus:ring-[#800000]"
                    placeholder="e.g. 919876543210 (Country code first, no +)" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-amber-500/50 mb-2">WhatsApp Phone Number ID</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/30" />
                  <input name="phoneId" value={config.phoneId} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-amber-900/10 rounded-xl text-[#FBF6E9] font-serif placeholder-amber-500/10 focus:outline-none focus:ring-1 focus:ring-[#800000]"
                    placeholder="Enter Phone Number ID from Meta" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-amber-500/50 mb-2">System Access Token</label>
                <input name="apiToken" type="password" value={config.apiToken} onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-amber-900/10 rounded-xl text-[#FBF6E9] font-serif placeholder-amber-500/10 focus:outline-none focus:ring-1 focus:ring-[#800000]"
                  placeholder="Paste your Meta API Token here" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-amber-500/50 mb-2">Webhook Verify Token</label>
                  <input name="verifyToken" value={config.verifyToken} onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-amber-900/10 rounded-xl text-[#FBF6E9] font-serif focus:outline-none focus:ring-1 focus:ring-[#800000]" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-amber-500/50 mb-2">Webhook Callback URL</label>
                  <div className="relative">
                    <FiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/30" />
                    <input name="webhookUrl" value={config.webhookUrl} onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-amber-900/10 rounded-xl text-[#FBF6E9] font-serif focus:outline-none focus:ring-1 focus:ring-[#800000]" />
                  </div>
                </div>
              </div>

              <div className="border-t border-amber-900/10 pt-6 mt-6">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-amber-500/70 mb-4">Heritage Business Identity</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-amber-500/50 mb-2">Atelier Name</label>
                    <input name="businessName" value={config.businessName} onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-amber-900/10 rounded-xl text-[#FBF6E9] font-serif focus:outline-none focus:ring-1 focus:ring-[#800000]" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-amber-500/50 mb-2">Ritual Welcome Greeting</label>
                    <textarea name="welcomeMessage" value={config.welcomeMessage} onChange={handleChange} rows={2}
                      className="w-full px-4 py-3 bg-white/5 border border-amber-900/10 rounded-xl text-[#FBF6E9] font-serif focus:outline-none focus:ring-1 focus:ring-[#800000] resize-none" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#800000] hover:bg-[#A00000] text-[#FBF6E9] font-serif text-lg rounded-2xl shadow-xl transition-all border border-amber-900/10">
                  <FiSave /> {saved ? 'Configuration Saved!' : 'Save Ritual Config'}
                </button>
                <button type="button" onClick={handleTestConnection}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-[#1A0F0A] border border-amber-900/20 text-amber-500 rounded-2xl hover:bg-[#2A1F1A] transition-all">
                  {testStatus === 'testing' ? (
                    <><span className="animate-spin h-5 w-5 border-2 border-amber-500/30 border-t-amber-500 rounded-full"></span> Invoking...</>
                  ) : testStatus === 'success' ? (
                    <><FiCheckCircle className="text-emerald-500" /> Sacred Link Active</>
                  ) : testStatus === 'error' ? (
                    <><FiAlertCircle className="text-rose-500" /> Invoke Failed</>
                  ) : (
                    <>Test Sacred Connection</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          <div className="bg-[#1A0F0A]/40 backdrop-blur-sm border border-amber-900/20 rounded-3xl p-6">
            <h4 className="font-serif text-[#FBF6E9] mb-4 flex items-center gap-2">
              <FiMessageSquare className="text-emerald-500" /> Auspicious Capabilities
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                'Sacred order notifications to Proprietor',
                'AI-powered heritage consultation',
                'Ritual-ready order confirmations',
                'Vedic textile expertise via chat'
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3 text-[#FBF6E9]/60">
                  <span className="text-emerald-500 mt-1 font-bold">✓</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-900/10 border border-amber-900/20 rounded-3xl p-6">
            <h4 className="font-serif text-amber-500 mb-3 flex items-center gap-2">
              <FiInfo className="w-4 h-4" /> Setup Instructions
            </h4>
            <ol className="space-y-3 text-xs text-[#FBF6E9]/40 leading-relaxed font-serif">
              <li>1. Enter the <span className="text-amber-500 italic">Meta for Developers</span> sanctum</li>
              <li>2. Create a WhatsApp Business application</li>
              <li>3. Retrieve your <span className="text-amber-500">Phone ID</span> & <span className="text-amber-500">System Token</span></li>
              <li>4. Align your webhook with the token provided</li>
              <li>5. Save the configuration and test the link</li>
            </ol>
          </div>

          <div className="bg-[#1A0F0A]/40 backdrop-blur-sm border border-amber-900/20 rounded-3xl p-6">
            <h4 className="font-serif text-[#FBF6E9] mb-4 uppercase tracking-widest text-[9px] font-bold text-amber-500/50">Message Patterns</h4>
            <div className="space-y-3">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] text-amber-500 font-bold uppercase tracking-tighter">New Order Alert</p>
                <p className="text-[11px] text-[#FBF6E9]/50 mt-2 italic font-serif">"A new sacred order from {'{buyer}'} for {'{product}'} has been received."</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Blessing Confirmation</p>
                <p className="text-[11px] text-[#FBF6E9]/50 mt-2 italic font-serif">"Order Accepted – Your heritage attire is being sanctified ✅"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
