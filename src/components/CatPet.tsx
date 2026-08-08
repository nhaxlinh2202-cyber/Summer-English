import React, { useState, useEffect } from 'react';
import { Fish, Hand, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import CatIcon from './CatIcon';

const SKINS = [
  { id: 'default', name: 'Mèo Cơ Bản', icon: '🐱', minLevel: 1 },
  { id: 'hat', name: 'Mũ Rơm', icon: '👒', minLevel: 2 },
  { id: 'glasses', name: 'Kính Râm', icon: '🕶️', minLevel: 3 },
  { id: 'crown', name: 'Vương Miện', icon: '👑', minLevel: 4 },
];

const CatPet: React.FC = () => {
  const { state, addFish, setSkin } = useAppContext();
  
  const [hunger, setHunger] = useState(50);
  const [happiness, setHappiness] = useState(70);
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

  // Handle sleeping mode
  useEffect(() => {
    const sleepTimer = setInterval(() => {
      setIsSleeping(h => !h);
    }, 20000);
    return () => clearInterval(sleepTimer);
  }, []);

  const feedCat = () => {
    if (state.fish > 0 && hunger < 100) {
      addFish(-1);
      setIsEating(true);
      setIsSleeping(false);
      setTimeout(() => {
        setHunger(prev => Math.min(prev + 20, 100));
        setHappiness(prev => Math.min(prev + 10, 100));
        setIsEating(false);
      }, 1500);
    }
  };

  const petCat = () => {
    setIsSleeping(false);
    if (happiness < 100) {
      setHappiness(prev => Math.min(prev + 15, 100));
    }
  };

  const getCatSize = (): number => {
    if (state.catLevel >= 5) return 220;
    if (state.catLevel >= 3) return 190;
    return 160;
  };

  return (
    <div className="cat-pet-container" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      
      {/* Cat Area */}
      <div className="glass-panel p-6" style={{ flex: '2', minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        
        {/* Level up celebration */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255, 255, 255, 0.9)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <Sparkles size={64} color="#FFE66D" />
              <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginTop: '16px' }}>Lên Cấp!</h2>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Mèo đã đạt cấp {state.catLevel}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <h2>Mèo Của Bé</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent)', padding: '4px 12px', borderRadius: '999px', fontWeight: 'bold' }}>
            <Star size={16} /> Cấp {state.catLevel}
          </div>
        </div>
        
        <div style={{ position: 'relative', margin: '32px 0', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CatIcon 
            skin={state.catSkin}
            isSleeping={isSleeping}
            isEating={isEating}
            happiness={happiness}
            size={getCatSize()}
            onClick={petCat}
          />
        </div>

        <div className="stats-bars" style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>Kinh nghiệm (XP)</span>
              <span style={{ fontSize: '0.9rem' }}>{state.catExp} / {state.catLevel * 100}</span>
            </div>
            <div style={{ background: '#eee', height: '16px', borderRadius: '8px', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${(state.catExp / (state.catLevel * 100)) * 100}%` }} style={{ background: '#FFE66D', height: '100%' }} />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>Độ no</span>
            </div>
            <div style={{ background: '#eee', height: '16px', borderRadius: '8px', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${hunger}%` }} style={{ background: '#FF9A9E', height: '100%' }} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>Vui vẻ</span>
            </div>
            <div style={{ background: '#eee', height: '16px', borderRadius: '8px', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${happiness}%` }} style={{ background: '#84FAB0', height: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Actions & Wardrobe */}
      <div style={{ flex: '1', minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div className="glass-panel p-6">
          <h2>Tương tác</h2>
          <div style={{ background: '#F7FFF7', padding: '16px', borderRadius: '16px', border: '1px solid #4ECDC4', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#4ECDC4', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Fish /> Kho cá: {state.fish}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Làm bài tập để kiếm thêm cá cho mèo nhé!</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={feedCat}
              disabled={state.fish <= 0 || hunger >= 100}
              className="btn"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: (state.fish <= 0 || hunger >= 100) ? 0.5 : 1 }}
            >
              <Fish size={20} /> Cho mèo ăn
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={petCat}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Hand size={20} /> Vuốt ve
            </motion.button>
          </div>
        </div>

        {/* Wardrobe */}
        <div className="glass-panel p-6">
          <h2>Tủ Đồ Phụ Kiện</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Lên cấp để mở khoá phụ kiện siêu ngầu!</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {SKINS.map(skin => {
              const isUnlocked = state.catLevel >= skin.minLevel;
              const isActive = state.catSkin === skin.id;

              return (
                <div 
                  key={skin.id}
                  onClick={() => isUnlocked && setSkin(skin.id)}
                  style={{ 
                    border: isActive ? '2px solid var(--primary)' : '2px solid #eee',
                    background: isActive ? 'rgba(255, 107, 107, 0.1)' : (isUnlocked ? 'white' : '#f9f9f9'),
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
                  }}
                >
                  <CatIcon skin={skin.id} size={70} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginTop: '8px' }}>{skin.name}</div>
                  {!isUnlocked && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lv.{skin.minLevel}</div>}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

export default CatPet;

