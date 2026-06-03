import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Sparkles, ArrowRight, ArrowLeft, Loader2, CheckCircle2, Info } from 'lucide-react';

const AIRecommendationPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [formData, setFormData] = useState({
    skinTone: '',
    occasion: '',
    budget: '',
    fabric: '',
    color: ''
  });

  const options = {
    skinTone: ['Fair', 'Wheatish', 'Medium', 'Brown', 'Dark'],
    occasion: ['Wedding', 'Engagement', 'Temple Visit', 'Housewarming', 'Baby Shower', 'Festival', 'Reception', 'Office Event'],
    budget: ['Under ₹1,000', '₹1,000 – ₹3,000', '₹3,000 – ₹5,000', '₹5,000 – ₹10,000', 'Above ₹10,000'],
    fabric: ['Silk', 'Cotton', 'Linen', 'Organza', 'Tissue Silk', 'Banarasi', 'Kanchipuram Silk'],
    color: ['Red', 'Blue', 'Green', 'Yellow', 'Gold', 'Pink', 'Maroon', 'Purple', 'White', 'Black']
  };

  const handleOptionSelect = (key, value) => {
    setFormData({ ...formData, [key]: value });
    if (step < 5) setStep(step + 1);
  };

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/recommendations', formData);
      setRecommendations(response.data);
      setStep(6);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    const keys = Object.keys(options);
    const currentKey = keys[step - 1];
    const currentOptions = options[currentKey];

    return (
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <span className="text-[#800000]/40 text-xs font-bold uppercase tracking-[0.3em]">Step {step} of 5</span>
          <h2 className="text-3xl font-bold text-[#800000] capitalize">Select your {currentKey.replace(/([A-Z])/g, ' $1')}</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {currentOptions.map((option) => (
            <motion.button
              key={option}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOptionSelect(currentKey, option)}
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-3 text-center ${
                formData[currentKey] === option
                  ? 'bg-[#800000] border-[#800000] text-white shadow-xl'
                  : 'bg-white border-[#F3E5AB]/30 text-[#5D4037] hover:border-[#800000]/30 hover:bg-[#FBF6E9]'
              }`}
            >
              <span className="font-bold tracking-wide">{option}</span>
            </motion.button>
          ))}
        </div>

        {step > 1 && (
          <button 
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-2 text-[#800000]/60 hover:text-[#800000] font-bold uppercase tracking-widest text-xs mx-auto"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        )}
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF6E9] flex flex-col items-center justify-center p-8 font-serif">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-[#800000] mb-8"
        >
          <Sparkles size={64} />
        </motion.div>
        <h2 className="text-3xl text-[#800000] font-bold mb-2">Samyak is Consulting...</h2>
        <p className="text-[#5D4037]/60 italic">Analyzing traditional weaves for your perfect match.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF6E9] py-12 px-4 sm:px-6 lg:px-8 font-serif">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {step <= 5 ? (
            <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-[40px] shadow-2xl p-8 lg:p-16">
              {renderStep()}
              {step === 5 && formData.color && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={getRecommendations}
                  className="w-full mt-12 bg-[#800000] text-white py-6 rounded-3xl font-bold uppercase tracking-widest text-lg shadow-2xl hover:bg-[#600000] transition-all flex items-center justify-center gap-3"
                >
                  <Sparkles size={24} /> Get Recommendations
                </motion.button>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h1 className="text-5xl font-bold text-[#800000]">Your Sacred Recommendations</h1>
                <p className="text-[#5D4037]/70 italic">Curated by Samyak, our Heritage Consultant.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Saree Recommendations */}
                <div className="bg-white p-8 rounded-[40px] shadow-xl border border-[#F3E5AB]/20">
                  <h3 className="text-2xl font-bold text-[#800000] mb-6 border-b border-[#F3E5AB] pb-4 uppercase tracking-tighter">Recommended Sarees</h3>
                  <div className="space-y-4">
                    {recommendations?.sarees.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-[#FBF6E9] rounded-2xl">
                        <CheckCircle2 className="text-[#800000] flex-shrink-0" size={20} />
                        <span className="font-bold text-[#5D4037]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Veshti Recommendations */}
                <div className="bg-white p-8 rounded-[40px] shadow-xl border border-[#F3E5AB]/20">
                  <h3 className="text-2xl font-bold text-[#800000] mb-6 border-b border-[#F3E5AB] pb-4 uppercase tracking-tighter">Recommended Veshtis</h3>
                  <div className="space-y-4">
                    {recommendations?.veshtis.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-[#FBF6E9] rounded-2xl">
                        <CheckCircle2 className="text-[#800000] flex-shrink-0" size={20} />
                        <span className="font-bold text-[#5D4037]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Extras & Reason */}
              <div className="bg-white p-12 rounded-[40px] shadow-xl border border-[#F3E5AB]/20 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="space-y-2">
                     <span className="text-[10px] font-bold text-[#800000]/60 uppercase tracking-widest">Matched Blouse</span>
                     <p className="text-[#5D4037] font-semibold">{recommendations?.blouse}</p>
                   </div>
                   <div className="space-y-2">
                     <span className="text-[10px] font-bold text-[#800000]/60 uppercase tracking-widest">Accessories</span>
                     <p className="text-[#5D4037] font-semibold">{recommendations?.accessories}</p>
                   </div>
                   <div className="space-y-2">
                     <span className="text-[10px] font-bold text-[#800000]/60 uppercase tracking-widest">Partner Outfit</span>
                     <p className="text-[#5D4037] font-semibold">{recommendations?.coupleOutfit}</p>
                   </div>
                </div>

                <div className="p-8 bg-[#800000]/5 rounded-3xl border border-[#800000]/10 flex gap-6 items-start">
                  <div className="bg-[#800000] text-white p-3 rounded-2xl shadow-lg flex-shrink-0">
                    <Info size={24} />
                  </div>
                  <div>
                    <h4 className="text-[#800000] font-bold uppercase tracking-widest text-sm mb-2">Why we recommend this:</h4>
                    <p className="text-[#5D4037] leading-relaxed italic">"{recommendations?.reason}"</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setStep(1)}
                  className="w-full bg-[#800000] text-white py-6 rounded-3xl font-bold uppercase tracking-widest text-lg shadow-2xl hover:bg-[#600000] transition-all"
                >
                  Start New Consultation
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIRecommendationPage;
