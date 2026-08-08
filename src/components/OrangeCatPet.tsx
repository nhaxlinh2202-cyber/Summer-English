import React, { useState, useEffect } from 'react';
import { Fish, Sparkles, Award, Star, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext, computeHeroMood } from '../context/AppContext';
import OrangeCatIcon from './OrangeCatIcon';

const SKINS = [
  { id: 'default', name: 'Mèo', label: '🐱', minLevel: 1 },
  { id: 'hat',     name: 'Mũ',  label: '👒', minLevel: 2 },
  { id: 'glasses', name: 'Kính', label: '🕶️', minLevel: 3 },
  { id: 'crown',   name: 'Vương', label: '👑', minLevel: 4 },
];

const MOOD_CONFIG = {
  crying: {
    gradient: 'linear-gradient(135deg, #ffeef0 0%, #ffe0e3 100%)',
    border: '#fca5a5',
    color: '#dc2626',
    icon: '😭',
    glow: 'rgba(239,68,68,0.15)',
    bgCircle: 'rgba(254,202,202,0.5)',
  },
  victory: {
    gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    border: '#86efac',
    color: '#16a34a',
    icon: '🏆',
    glow: 'rgba(34,197,94,0.15)',
    bgCircle: 'rgba(187,247,208,0.5)',
  },
  happy: {
    gradient: 'linear-gradient(135deg, #fff8f0 0%, #ffedd5 100%)',
    border: '#fdba74',
    color: '#ea580c',
    icon: '😊',
    glow: 'rgba(251,146,60,0.15)',
    bgCircle: 'rgba(254,215,170,0.5)',
  },
};

const OrangeCatPet: React.FC = () => {
  const { state, addFish, setSkin, updateHunger } = useAppContext();
  const lang = state.language || 'vi';

  const [happiness, setHappiness] = useState(80);
  const [isEating, setIsEating] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [prevLevel, setPrevLevel] = useState(state.catLevel);
  const [petAnim, setPetAnim] = useState(false);

  const automaticMood = computeHeroMood(state);
  // Normalize: 'angry' và 'normal' => 'happy' cho display
  const displayMood: 'crying' | 'victory' | 'happy' =
    automaticMood === 'crying' ? 'crying'
    : automaticMood === 'victory' ? 'victory'
    : 'happy';
  const moodCfg = MOOD_CONFIG[displayMood];

  useEffect(() => {
    if (state.catLevel > prevLevel) {
      setShowLevelUp(true);
      setPrevLevel(state.catLevel);
      setTimeout(() => setShowLevelUp(false), 3500);
    }
  }, [state.catLevel, prevLevel]);

  useEffect(() => {
    const t = setInterval(() => setIsSleeping(s => !s), 25000);
    return () => clearInterval(t);
  }, []);

  const feedCat = () => {
    if (state.fish > 0 && state.catHunger < 100) {
      addFish(-1);
      setIsEating(true);
      setIsSleeping(false);
      setTimeout(() => {
        updateHunger(Math.min(state.catHunger + 25, 100));
        setHappiness(p => Math.min(p + 15, 100));
        setIsEating(false);
      }, 1500);
    }
  };

  const petCat = () => {
    setIsSleeping(false);
    setPetAnim(true);
    setTimeout(() => setPetAnim(false), 800);
    if (happiness < 100) setHappiness(p => Math.min(p + 20, 100));
  };

  const catSize = state.catLevel >= 5 ? 200 : state.catLevel >= 3 ? 180 : 160;

  const completedTests = state.tests.filter(t => t.status === 'completed');
  const latestTest = completedTests.length > 0 ? completedTests[completedTests.length - 1] : null;

  const feedDisabled = state.fish <= 0 || state.catHunger >= 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>

      {/* ── Level Up Toast ── */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ y: -40, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -40, opacity: 0, scale: 0.8 }}
            style={{
              background: 'linear-gradient(135deg, #ff9f43 0%, #ff6b6b 100%)',
              padding: '14px 24px', borderRadius: '18px', textAlign: 'center',
              boxShadow: '0 12px 30px rgba(255,107,107,0.4)', color: 'white',
              fontWeight: 800, fontSize: '1.05rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
            }}
          >
            <Sparkles size={22} /> 🎉 MÈO CAM TĂNG LÊN CẤP {state.catLevel}! 🎉 <Sparkles size={22} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main 2-column layout ── */}
      <div style={{ display: 'flex', gap: '18px', flex: 1, alignItems: 'stretch', flexWrap: 'wrap' }}>

        {/* ═══ LEFT: Cat Hero Card ═══ */}
        <div style={{
          flex: '1', minWidth: '280px',
          background: 'linear-gradient(160deg, #ffffff 0%, #fff8f0 50%, #ffeedd 100%)',
          borderRadius: '28px', padding: '20px',
          boxShadow: '0 8px 32px rgba(255,159,67,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          border: '1.5px solid rgba(255,159,67,0.2)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px',
          justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden'
        }}>
          {/* Decorative bg circles */}
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,159,67,0.07)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -20, left: -20, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,107,107,0.06)', pointerEvents: 'none' }} />

          {/* Name & Level */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #ff9f43, #ff6b6b)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(255,107,107,0.3)' }}>
                <Award size={18} color="white" />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Mèo Cam của</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>{state.profile.studentName}</div>
              </div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #ff9f43 0%, #ff6b6b 100%)',
              color: 'white', padding: '6px 14px', borderRadius: '999px',
              fontWeight: 800, fontSize: '0.85rem',
              boxShadow: '0 4px 12px rgba(255,107,107,0.35)'
            }}>
              ⭐ Cấp {state.catLevel}
            </div>
          </div>


          {/* Cat display with glow */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Glow circle */}
            <div style={{
              position: 'absolute', width: catSize + 40, height: catSize + 40,
              borderRadius: '50%', background: moodCfg.bgCircle,
              boxShadow: `0 0 50px ${moodCfg.glow}`,
              transition: 'all 0.5s ease'
            }} />

            <AnimatePresence>
              {isEating && (
                <motion.div
                  initial={{ scale: 0, y: 10 }}
                  animate={{ scale: 1, y: -20 }}
                  exit={{ scale: 0, opacity: 0 }}
                  style={{ position: 'absolute', top: 0, fontSize: '1.6rem', zIndex: 10 }}
                >
                  🐟✨
                </motion.div>
              )}
              {petAnim && (
                <motion.div
                  initial={{ scale: 0, y: 10 }}
                  animate={{ scale: 1, y: -20 }}
                  exit={{ scale: 0, opacity: 0 }}
                  style={{ position: 'absolute', top: 0, fontSize: '1.6rem', zIndex: 10 }}
                >
                  💖✨
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              animate={petAnim ? { rotate: [0, -8, 8, -4, 0] } : {}}
              transition={{ duration: 0.5 }}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <OrangeCatIcon size={catSize} skin={state.catSkin} mood={displayMood} isEating={isEating} isSleeping={isSleeping} />
            </motion.div>
          </div>

          {/* Stats */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Hunger */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>
                  <span>🍔</span> Mức no bụng
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: state.catHunger >= 70 ? '#10b981' : state.catHunger >= 40 ? '#f59e0b' : '#ef4444' }}>
                  {state.catHunger}%
                </span>
              </div>
              <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                <motion.div
                  animate={{ width: `${state.catHunger}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #ff9f43, #ee5253)' }}
                />
              </div>
            </div>

            {/* Happiness */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>
                  <span>💖</span> Vui vẻ & Thân thiện
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: happiness >= 70 ? '#10b981' : happiness >= 40 ? '#f59e0b' : '#ef4444' }}>
                  {happiness}%
                </span>
              </div>
              <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                <motion.div
                  animate={{ width: `${happiness}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #55efc4, #00b894)' }}
                />
              </div>
            </div>
          </div>

          {/* Teacher Mode: Reset Buttons */}
          {state.isTeacherMode && (
            <div style={{ width: '100%', display: 'flex', gap: '8px' }}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => updateHunger(65)}
                style={{
                  flex: 1, padding: '8px 6px',
                  background: 'linear-gradient(135deg, #fff0e0, #ffe5c8)',
                  border: '1.5px solid #fdba74',
                  borderRadius: '12px', cursor: 'pointer',
                  fontSize: '0.73rem', fontWeight: 800, color: '#c2410c',
                  fontFamily: 'Nunito, sans-serif',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                }}
              >
                🍔 Reset no bụng
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setHappiness(50)}
                style={{
                  flex: 1, padding: '8px 6px',
                  background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                  border: '1.5px solid #86efac',
                  borderRadius: '12px', cursor: 'pointer',
                  fontSize: '0.73rem', fontWeight: 800, color: '#15803d',
                  fontFamily: 'Nunito, sans-serif',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                }}
              >
                💖 Reset vui vẻ
              </motion.button>
            </div>
          )}
        </div>

        {/* ═══ RIGHT: Info Cards ═══ */}
        <div style={{ flex: '1', minWidth: '270px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Card 1 – Learning Status */}
          <div style={{
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            borderRadius: '20px', padding: '16px 18px',
            border: '1.5px solid #fcd34d',
            boxShadow: '0 4px 16px rgba(251,191,36,0.12)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 800, color: '#92400e', fontSize: '0.9rem' }}>
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                {lang === 'en' ? 'Learning Status' : 'Điểm Học Tập'}
              </div>
              <span style={{ background: latestTest ? '#fef9c3' : '#f1f5f9', color: latestTest ? '#a16207' : '#94a3b8', fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: '999px' }}>
                {latestTest ? `${latestTest.score} điểm` : 'Chưa có'}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#78350f', lineHeight: 1.5 }}>
              {latestTest ? `📝 Bài gần nhất: "${latestTest.name}"` : '🌟 Mèo Cam sẵn sàng đồng hành cùng bé!'}
            </p>
          </div>

          {/* Card 2 – Interaction */}
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            borderRadius: '20px', padding: '16px 18px',
            border: '1.5px solid #86efac',
            boxShadow: '0 4px 16px rgba(34,197,94,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 800, color: '#14532d', fontSize: '0.9rem' }}>
                <Fish size={16} color="#16a34a" />
                {lang === 'en' ? 'Interact' : 'Tương Tác'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#bbf7d0', color: '#15803d', fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: '999px' }}>
                🐟 <span>{state.fish} cá</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <motion.button
                whileHover={!feedDisabled ? { scale: 1.04, y: -2 } : {}}
                whileTap={!feedDisabled ? { scale: 0.97 } : {}}
                onClick={feedCat}
                disabled={feedDisabled}
                style={{
                  background: feedDisabled ? '#e2e8f0' : 'linear-gradient(135deg, #ff9f43 0%, #ff6b6b 100%)',
                  color: feedDisabled ? '#94a3b8' : 'white',
                  border: 'none', borderRadius: '14px',
                  padding: '11px 8px', fontFamily: 'Nunito, sans-serif',
                  fontWeight: 800, fontSize: '0.82rem', cursor: feedDisabled ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  boxShadow: feedDisabled ? 'none' : '0 4px 14px rgba(255,107,107,0.3)',
                  transition: 'all 0.2s'
                }}
              >
                🐟 Cho ăn
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={petCat}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white', border: 'none', borderRadius: '14px',
                  padding: '11px 8px', fontFamily: 'Nunito, sans-serif',
                  fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
                  transition: 'all 0.2s'
                }}
              >
                💖 Vuốt ve
              </motion.button>
            </div>
          </div>

          {/* Card 3 – Wardrobe */}
          <div style={{
            background: 'linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%)',
            borderRadius: '20px', padding: '16px 18px',
            border: '1.5px solid #d8b4fe',
            boxShadow: '0 4px 16px rgba(168,85,247,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 800, color: '#4c1d95', fontSize: '0.9rem' }}>
                <Sparkles size={16} color="#a855f7" />
                {lang === 'en' ? 'Wardrobe' : 'Phụ Kiện'}
              </div>
              <span style={{ background: '#ede9fe', color: '#7c3aed', fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: '999px' }}>
                {SKINS.find(s => s.id === state.catSkin)?.name || 'Mèo'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {SKINS.map(skin => {
                const isUnlocked = state.catLevel >= skin.minLevel;
                const isActive = state.catSkin === skin.id;

                return (
                  <motion.div
                    key={skin.id}
                    whileHover={isUnlocked ? { scale: 1.08, y: -3 } : {}}
                    whileTap={isUnlocked ? { scale: 0.95 } : {}}
                    onClick={() => isUnlocked && setSkin(skin.id)}
                    style={{
                      position: 'relative',
                      border: isActive ? '2.5px solid #a855f7' : '1.5px solid #e9d5ff',
                      background: isActive
                        ? 'linear-gradient(135deg, #f5f3ff, #ede9fe)'
                        : isUnlocked ? 'white' : '#f8fafc',
                      borderRadius: '14px', padding: '8px 4px',
                      textAlign: 'center',
                      cursor: isUnlocked ? 'pointer' : 'not-allowed',
                      opacity: isUnlocked ? 1 : 0.55,
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 4px 12px rgba(168,85,247,0.25)' : '0 2px 6px rgba(0,0,0,0.04)'
                    }}
                  >
                    {/* Lock overlay for locked skins */}
                    {!isUnlocked && (
                      <div style={{ position: 'absolute', top: 4, right: 4 }}>
                        <Lock size={10} color="#94a3b8" />
                      </div>
                    )}

                    <div style={{ height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <OrangeCatIcon size={38} skin={skin.id} mood="happy" />
                    </div>
                    <div style={{
                      fontSize: '0.68rem', fontWeight: 800,
                      color: isActive ? '#7c3aed' : isUnlocked ? '#374151' : '#94a3b8',
                      marginTop: '2px'
                    }}>
                      {skin.name}
                    </div>
                    {!isUnlocked && (
                      <div style={{ fontSize: '0.6rem', color: '#cbd5e1', marginTop: '1px' }}>
                        Cấp {skin.minLevel}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrangeCatPet;
