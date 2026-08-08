import React, { useState, useEffect } from 'react';
import { Zap, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext, type HeroMood } from '../context/AppContext';
import SpidermanIcon from './SpidermanIcon';

const SKINS = [
  { id: 'default', name: 'Spider Classic 🔴🔵', minLevel: 1 },
  { id: 'black', name: 'Black Symbiote 🕷️🖤', minLevel: 2 },
  { id: 'iron', name: 'Iron Spider 🤖🔴🟡', minLevel: 3 },
  { id: 'stealth', name: 'Stealth Suit 🕶️⚡', minLevel: 4 },
];

const MOODS: { id: HeroMood; label: string; icon: string }[] = [
  { id: 'crying', label: 'Khóc Nhè (Điểm Thấp)', icon: '😭' },
  { id: 'victory', label: 'Chiến Thắng (Điểm 10)', icon: '🏆' },
  { id: 'angry', label: 'Quyết Tâm', icon: '🔥' },
  { id: 'shocked', label: 'Kinh Ngạc', icon: '😲' },
  { id: 'sleepy', label: 'Ngủ Gật', icon: '😴' },
  { id: 'normal', label: 'Vui Vẻ', icon: '😊' },
];

const SpidermanPet: React.FC = () => {
  const { state, addFish, setSkin, setHeroMood } = useAppContext();
  
  const [hunger, setHunger] = useState(60);
  const [happiness, setHappiness] = useState(80);
  const [isEating, setIsEating] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [prevLevel, setPrevLevel] = useState(state.catLevel);

  useEffect(() => {
    if (state.catLevel > prevLevel) {
      setShowLevelUp(true);
      setPrevLevel(state.catLevel);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
  }, [state.catLevel, prevLevel]);

  // Handle sleep/patrol mode
  useEffect(() => {
    const sleepTimer = setInterval(() => {
      setIsSleeping(h => !h);
    }, 25000);
    return () => clearInterval(sleepTimer);
  }, []);

  const feedSpiderman = () => {
    if (state.fish > 0 && hunger < 100) {
      addFish(-1);
      setIsEating(true);
      setIsSleeping(false);
      setHeroMood('normal');
      setTimeout(() => {
        setHunger(prev => Math.min(prev + 25, 100));
        setHappiness(prev => Math.min(prev + 15, 100));
        setIsEating(false);
      }, 1500);
    }
  };

  const trainSpiderman = () => {
    setIsSleeping(false);
    setHeroMood('victory');
    if (happiness < 100) {
      setHappiness(prev => Math.min(prev + 20, 100));
    }
  };

  const getHeroSize = (): number => {
    if (state.catLevel >= 5) return 230;
    if (state.catLevel >= 3) return 200;
    return 170;
  };

  const getMoodCommentary = (mood: HeroMood) => {
    switch(mood) {
      case 'crying':
        return {
          text: '😭 Spider-Man đang khóc nhè vì bị điểm thấp hoặc chưa học bài! Bé hãy làm bài kiểm tra ngay để an ủi anh hùng nhé!',
          bg: '#fef2f2',
          color: '#dc2626',
          border: '#fca5a5'
        };
      case 'victory':
        return {
          text: '🏆 Woa! Spider-Man đang vô cùng tự hào và ăn mừng chiến thắng điểm 10 cùng bé!',
          bg: '#fefce8',
          color: '#ca8a04',
          border: '#fde047'
        };
      case 'angry':
        return {
          text: '🔥 Spider-Man bừng bừng khí thế, quyết tâm làm lại bài test để giành lại điểm số tối đa!',
          bg: '#fff1f2',
          color: '#be123c',
          border: '#fda4af'
        };
      case 'shocked':
        return {
          text: '😲 Spider-Man kinh ngạc trước câu đố tiếng Anh cực đỉnh của bé!',
          bg: '#f0f9ff',
          color: '#0369a1',
          border: '#7dd3fc'
        };
      case 'sleepy':
        return {
          text: '😴 Spider-Man đang thiu thiu ngủ gật... Hãy đánh thức anh hùng bằng một bài học mới nào!',
          bg: '#f8fafc',
          color: '#475569',
          border: '#cbd5e1'
        };
      default:
        return {
          text: '🕸️ Spider-Man sẵn sàng cùng bé chinh phục mọi từ vựng và bài test tiếng Anh!',
          bg: '#f0fdf4',
          color: '#15803d',
          border: '#86efac'
        };
    }
  };

  const commentary = getMoodCommentary(state.heroMood);

  return (
    <div className="spiderman-pet-container" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      
      {/* Superhero Display Area */}
      <div className="glass-panel p-6" style={{ flex: '2', minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        
        {/* Level up celebration */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.95)', color: 'white', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <Zap size={64} color="#FFE66D" />
              <h2 style={{ fontSize: '2.2rem', color: '#FF4757', marginTop: '16px', textTransform: 'uppercase', letterSpacing: '2px' }}>Đẳng Cấp Mới!</h2>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Spider-Man đã nâng cấp lên Level {state.catLevel}!</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e63946' }}>
            <span>🕷️ Spider-Man Của Bé</span>
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #e63946 0%, #ffb703 100%)', color: 'white', padding: '6px 14px', borderRadius: '999px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(230, 57, 70, 0.3)' }}>
            <Star size={18} fill="white" /> Cấp {state.catLevel}
          </div>
        </div>
        
        {/* Spider-Man Hero Icon View */}
        <div style={{ position: 'relative', margin: '36px 0 20px 0', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SpidermanIcon 
            skin={state.catSkin}
            mood={state.heroMood}
            isSleeping={isSleeping}
            isEating={isEating}
            happiness={happiness}
            size={getHeroSize()}
            onClick={trainSpiderman}
          />
        </div>

        {/* Dynamic Mood Commentary Banner */}
        <motion.div
          animate={{ scale: [0.99, 1.01, 0.99] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            background: commentary.bg,
            color: commentary.color,
            border: `2px solid ${commentary.border}`,
            padding: '12px 18px',
            borderRadius: '16px',
            fontSize: '0.95rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '24px',
            width: '100%',
            maxWidth: '440px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          {commentary.text}
        </motion.div>

        {/* Hero Progress Bars */}
        <div className="stats-bars" style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>Kinh nghiệm Anh Hùng (XP)</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{state.catExp} / {state.catLevel * 100}</span>
            </div>
            <div style={{ background: '#e2e8f0', height: '16px', borderRadius: '999px', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${(state.catExp / (state.catLevel * 100)) * 100}%` }} style={{ background: 'linear-gradient(90deg, #ffb703, #fb8500)', height: '100%' }} />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>Năng Lượng (Pizza 🍕)</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{hunger}%</span>
            </div>
            <div style={{ background: '#e2e8f0', height: '16px', borderRadius: '999px', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${hunger}%` }} style={{ background: 'linear-gradient(90deg, #ff4757, #ff6b81)', height: '100%' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>Tinh Thần Chiến Đấu 🕸️</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{happiness}%</span>
            </div>
            <div style={{ background: '#e2e8f0', height: '16px', borderRadius: '999px', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${happiness}%` }} style={{ background: 'linear-gradient(90deg, #2ed573, #7bed9f)', height: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Actions & Superhero Suit Closet */}
      <div style={{ flex: '1', minWidth: '270px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Expression Control Center */}
        <div className="glass-panel p-6">
          <h2>Bảng Biểu Cảm Spider-Man</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>Bấm vào biểu cảm để thử hoặc xem phản ứng của Spider-Man:</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {MOODS.map(m => {
              const isActive = state.heroMood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setHeroMood(m.id)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '12px',
                    border: isActive ? '2px solid #e63946' : '1px solid #cbd5e1',
                    background: isActive ? '#fef2f2' : 'white',
                    color: isActive ? '#dc2626' : '#334155',
                    fontWeight: isActive ? 'bold' : 'normal',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: isActive ? '0 2px 6px rgba(230, 57, 70, 0.2)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{m.icon}</span> {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interaction Panel */}
        <div className="glass-panel p-6">
          <h2>Tương Tác Anh Hùng</h2>
          <div style={{ background: '#FFF5F5', padding: '16px', borderRadius: '16px', border: '1px solid #FF8585', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#e63946', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🍕 Kho Pizza Năng Lượng: {state.fish}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Hoàn thành bài học tiếng Anh để nhận Pizza nạp năng lượng cho Spider-Man!</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <motion.button 
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={feedSpiderman}
              disabled={state.fish <= 0 || hunger >= 100}
              className="btn"
              style={{ 
                background: 'linear-gradient(135deg, #e63946 0%, #d62828 100%)', 
                color: 'white',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px', 
                opacity: (state.fish <= 0 || hunger >= 100) ? 0.5 : 1,
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              🍕 Cho Spider-Man Ăn Pizza
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={trainSpiderman}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1rem', fontWeight: 'bold' }}
            >
              🕸️ Bắn Tơ & Huấn Luyện
            </motion.button>
          </div>
        </div>

        {/* Spider Suit Collection */}
        <div className="glass-panel p-6">
          <h2>Tủ Đồ Trang Phục</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Tăng cấp Spider-Man để mở khóa các bộ giáp siêu ngầu!</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {SKINS.map(skin => {
              const isUnlocked = state.catLevel >= skin.minLevel;
              const isActive = state.catSkin === skin.id;

              return (
                <div 
                  key={skin.id}
                  onClick={() => isUnlocked && setSkin(skin.id)}
                  style={{ 
                    border: isActive ? '3px solid #e63946' : '2px solid #e2e8f0',
                    background: isActive ? 'rgba(230, 57, 70, 0.08)' : (isUnlocked ? 'white' : '#f8fafc'),
                    borderRadius: '16px',
                    padding: '12px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    opacity: isUnlocked ? 1 : 0.5,
                    filter: isUnlocked ? 'none' : 'grayscale(100%)',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 4px 12px rgba(230, 57, 70, 0.2)' : 'none'
                  }}
                >
                  <SpidermanIcon skin={skin.id} size={70} />
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginTop: '8px', textAlign: 'center' }}>{skin.name}</div>
                  {!isUnlocked && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cấp {skin.minLevel}</div>}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

export default SpidermanPet;
