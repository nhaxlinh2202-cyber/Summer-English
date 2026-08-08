import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Fish, Hand, Award, Sparkles } from 'lucide-react';
import { useAppContext, computeHeroMood } from '../context/AppContext';
import OrangeCatIcon from './OrangeCatIcon';

export const FloatingCatWidget: React.FC<{ activeTab?: string }> = ({ activeTab }) => {
  const { state, addFish } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isEating, setIsEating] = useState(false);

  if (activeTab === 'cat') return null;

  const mood = computeHeroMood(state);
  const completedTests = state.tests.filter(t => t.status === 'completed');
  const latestTest = completedTests.length > 0 ? completedTests[completedTests.length - 1] : null;

  const handleFeed = () => {
    if (state.fish > 0) {
      addFish(-1);
      setIsEating(true);
      setTimeout(() => setIsEating(false), 1500);
    }
  };

  return (
    <>
      {/* Floating Cat Trigger Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, #ff9f43 0%, #ff6b6b 100%)',
          padding: '8px 16px 8px 8px',
          borderRadius: '999px',
          boxShadow: '0 8px 24px rgba(255, 159, 67, 0.45)',
          border: '3px solid white',
          color: 'white',
          fontWeight: 'bold',
          userSelect: 'none',
        }}
      >
        <OrangeCatIcon skin={state.catSkin} mood={mood} size={50} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '0.85rem', lineHeight: 1.2 }}>Mèo Cam</span>
          <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>Cấp {state.catLevel} 🐾</span>
        </div>
      </motion.div>

      {/* Floating Cat Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            style={{
              position: 'fixed',
              bottom: '96px',
              right: '24px',
              width: '320px',
              background: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(16px)',
              borderRadius: '24px',
              padding: '20px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
              border: '2px solid rgba(255, 159, 67, 0.3)',
              zIndex: 99999,
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e67e22', fontWeight: 'bold', fontSize: '1.05rem' }}>
                <Sparkles size={18} /> Bạn Đồng Hành Mèo Cam
              </div>
              <X 
                size={20} 
                cursor="pointer" 
                onClick={() => setIsOpen(false)}
                style={{ color: '#94a3b8', transition: 'color 0.2s' }}
              />
            </div>

            {/* Cat Mascot Center View */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '12px 0' }}>
              <OrangeCatIcon 
                skin={state.catSkin} 
                mood={mood} 
                isEating={isEating}
                size={140} 
              />
            </div>

            {/* Test Score Status Line */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', marginBottom: '16px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
              <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Award size={16} color="#ff9f43" /> Bài test mới nhất:
              </span>
              <span style={{ fontWeight: 'bold', color: latestTest ? (latestTest.score < 60 ? '#dc2626' : '#16a34a') : '#94a3b8' }}>
                {latestTest ? `${latestTest.score} điểm` : 'Chưa có'}
              </span>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <button
                onClick={handleFeed}
                disabled={state.fish <= 0}
                style={{
                  padding: '10px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #ff9f43 0%, #ff6b6b 100%)',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: state.fish > 0 ? 'pointer' : 'not-allowed',
                  opacity: state.fish > 0 ? 1 : 0.5,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Fish size={16} /> Cho ăn ({state.fish})
              </button>

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  padding: '10px',
                  borderRadius: '14px',
                  border: '1px solid #cbd5e1',
                  background: 'white',
                  color: '#475569',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Hand size={16} /> Đóng Popup
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingCatWidget;
