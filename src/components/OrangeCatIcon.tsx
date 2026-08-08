import React from 'react';
import { Sparkles, Trophy, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import type { HeroMood } from '../context/AppContext';

interface OrangeCatIconProps {
  skin?: string; // 'default' | 'hat' | 'glasses' | 'crown'
  mood?: HeroMood;
  isSleeping?: boolean;
  isEating?: boolean;
  happiness?: number;
  size?: number | string;
  className?: string;
  onClick?: () => void;
}

export const OrangeCatIcon: React.FC<OrangeCatIconProps> = ({
  skin = 'default',
  mood = 'normal',
  isSleeping = false,
  isEating = false,
  happiness = 70,
  size = 180,
  className = '',
  onClick,
}) => {
  const numericSize = typeof size === 'number' ? size : parseInt(size) || 180;
  const catSize = Math.round(numericSize * 0.72);

  // Effective mood
  const currentMood: HeroMood = isSleeping ? 'sleepy' : (isEating ? 'happy' : mood);

  // Render Cat Eyes according to Mood
  const renderCatEyes = () => {
    switch (currentMood) {
      case 'crying':
        // Sad droopy eyes with tears ( T _ T )
        return (
          <>
            <path d="M 28 42 L 40 42 L 34 50 Z" fill="#2d3436" />
            <path d="M 60 42 L 72 42 L 66 50 Z" fill="#2d3436" />
          </>
        );
      case 'angry':
        // Fierce angled eyes ( > w < )
        return (
          <>
            <path d="M 26 38 L 42 46 M 26 46 L 42 38" stroke="#2d3436" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 58 38 L 74 46 M 58 46 L 74 38" stroke="#2d3436" strokeWidth="3.5" strokeLinecap="round" />
          </>
        );
      case 'victory':
        // Happy twinkling star eyes ( 😻 )
        return (
          <>
            <path d="M 26 44 C 30 36, 38 36, 42 44 C 38 50, 30 50, 26 44 Z" fill="#ff4757" stroke="#2d3436" strokeWidth="2" />
            <path d="M 58 44 C 62 36, 70 36, 74 44 C 70 50, 62 50, 58 44 Z" fill="#ff4757" stroke="#2d3436" strokeWidth="2" />
          </>
        );
      case 'shocked':
        // Giant round surprised pupils ( o _ o )
        return (
          <>
            <circle cx="34" cy="44" r="9" fill="#ffffff" stroke="#2d3436" strokeWidth="3" />
            <circle cx="34" cy="44" r="4" fill="#2d3436" />
            <circle cx="66" cy="44" r="9" fill="#ffffff" stroke="#2d3436" strokeWidth="3" />
            <circle cx="66" cy="44" r="4" fill="#2d3436" />
          </>
        );
      case 'sleepy':
        // Curved sleeping eyes ( - _ - )
        return (
          <>
            <path d="M 26 44 Q 34 50 42 44" fill="none" stroke="#2d3436" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 58 44 Q 66 50 74 44" fill="none" stroke="#2d3436" strokeWidth="3.5" strokeLinecap="round" />
          </>
        );
      case 'happy':
      case 'normal':
      default:
        // Cute happy curved eyes ( ^ _ ^ )
        return (
          <>
            <path d="M 26 44 Q 34 34 42 44" fill="none" stroke="#2d3436" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 58 44 Q 66 34 74 44" fill="none" stroke="#2d3436" strokeWidth="3.5" strokeLinecap="round" />
          </>
        );
    }
  };

  // Render Cat Mouth based on Mood
  const renderCatMouth = () => {
    if (currentMood === 'crying') {
      return <path d="M 44 64 Q 50 56 56 64" fill="none" stroke="#2d3436" strokeWidth="3" strokeLinecap="round" />;
    }
    if (currentMood === 'angry') {
      return <path d="M 42 62 L 58 62" stroke="#2d3436" strokeWidth="3" strokeLinecap="round" />;
    }
    if (currentMood === 'victory' || isEating) {
      return (
        <path d="M 42 58 Q 50 72 58 58 Z" fill="#ff6b6b" stroke="#2d3436" strokeWidth="2.5" />
      );
    }
    // Default cat mouth ( 3 )
    return (
      <path d="M 42 58 Q 46 63 50 58 Q 54 63 58 58" fill="none" stroke="#2d3436" strokeWidth="3" strokeLinecap="round" />
    );
  };

  // Skin Accessories (Hat, Glasses, Crown)
  const getSkinAccessory = () => {
    switch (skin) {
      case 'hat':
        return (
          <div 
            style={{ 
              position: 'absolute', 
              top: '-16%', 
              left: '50%', 
              transform: 'translateX(-50%)',
              fontSize: `${Math.round(numericSize * 0.36)}px`,
              lineHeight: 1,
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))',
              zIndex: 5,
              pointerEvents: 'none'
            }}
          >
            👒
          </div>
        );
      case 'glasses':
        return (
          <div 
            style={{ 
              position: 'absolute', 
              top: '26%', 
              left: '50%', 
              transform: 'translateX(-50%)',
              fontSize: `${Math.round(numericSize * 0.35)}px`,
              lineHeight: 1,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              zIndex: 5,
              pointerEvents: 'none'
            }}
          >
            🕶️
          </div>
        );
      case 'crown':
        return (
          <div 
            style={{ 
              position: 'absolute', 
              top: '-24%', 
              left: '50%', 
              transform: 'translateX(-50%)',
              fontSize: `${Math.round(numericSize * 0.38)}px`,
              lineHeight: 1,
              filter: 'drop-shadow(0 4px 8px rgba(255, 215, 0, 0.4))',
              zIndex: 5,
              pointerEvents: 'none'
            }}
          >
            👑
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`orange-cat-wrapper ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      animate={
        currentMood === 'crying' ? { y: [0, 4, 0], rotate: [-2, 2, -2] } :
        currentMood === 'angry' ? { scale: [1, 1.04, 1], x: [-2, 2, -2] } :
        currentMood === 'victory' ? { scale: [1, 1.1, 1], y: [0, -10, 0] } :
        isEating ? { scale: [1, 1.1, 0.95, 1], rotate: [0, -5, 5, 0] } :
        isSleeping ? { scale: [1, 1.02, 1], transition: { duration: 2.5, repeat: Infinity } } :
        { y: [0, -6, 0], transition: { duration: 2, repeat: Infinity } }
      }
      style={{
        position: 'relative',
        width: numericSize,
        height: numericSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      {/* Background Soft Badge */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: currentMood === 'crying' 
            ? 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
            : currentMood === 'angry'
            ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfeef0 100%)'
            : 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: currentMood === 'crying' 
            ? '0 12px 28px rgba(161, 196, 253, 0.45)'
            : '0 12px 28px rgba(255, 159, 67, 0.45)',
          border: '4px solid rgba(255, 255, 255, 0.9)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s ease',
        }}
      >
        {/* Vector Orange Cat Illustration */}
        <svg
          width={catSize}
          height={catSize}
          viewBox="0 0 100 100"
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))',
            zIndex: 2,
          }}
        >
          {/* Left Cat Ear */}
          <polygon points="12,12 35,28 15,48" fill="#ff9f43" stroke="#e67e22" strokeWidth="3" />
          <polygon points="17,18 31,30 19,42" fill="#ff793f" />

          {/* Right Cat Ear */}
          <polygon points="88,12 65,28 85,48" fill="#ff9f43" stroke="#e67e22" strokeWidth="3" />
          <polygon points="83,18 69,30 81,42" fill="#ff793f" />

          {/* Cat Head Base */}
          <ellipse cx="50" cy="54" rx="42" ry="36" fill="#ff9f43" stroke="#e67e22" strokeWidth="3" />

          {/* Forehead Orange Stripes (M M Pattern) */}
          <path d="M 40 22 L 44 32 L 48 24 L 52 32 L 56 22" fill="none" stroke="#d35400" strokeWidth="3" strokeLinecap="round" />

          {/* Cheeks / Blushing Pink */}
          <circle cx="24" cy="54" r="7" fill="#ff6b6b" opacity="0.4" />
          <circle cx="76" cy="54" r="7" fill="#ff6b6b" opacity="0.4" />

          {/* Cat Whiskers (Left & Right) */}
          <path d="M 6 50 L 22 52 M 4 56 L 22 56 M 8 62 L 22 60" stroke="#2d3436" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 94 50 L 78 52 M 96 56 L 78 56 M 92 62 L 78 60" stroke="#2d3436" strokeWidth="2.5" strokeLinecap="round" />

          {/* Render Eyes based on mood */}
          {renderCatEyes()}

          {/* Pink Button Nose */}
          <polygon points="46,52 54,52 50,57" fill="#ff6b6b" stroke="#d63031" strokeWidth="1" />

          {/* Render Mouth based on mood */}
          {renderCatMouth()}
        </svg>

        {/* Crying Teardrops Streaming Down Cheeks */}
        {currentMood === 'crying' && (
          <>
            <motion.div
              animate={{ y: [0, 22], opacity: [1, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeIn' }}
              style={{
                position: 'absolute',
                top: '44%',
                left: '26%',
                fontSize: `${Math.round(numericSize * 0.16)}px`,
                pointerEvents: 'none',
                zIndex: 4,
              }}
            >
              💧
            </motion.div>
            <motion.div
              animate={{ y: [0, 22], opacity: [1, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: 0.3, ease: 'easeIn' }}
              style={{
                position: 'absolute',
                top: '44%',
                right: '26%',
                fontSize: `${Math.round(numericSize * 0.16)}px`,
                pointerEvents: 'none',
                zIndex: 4,
              }}
            >
              💧
            </motion.div>
          </>
        )}

        {/* Angry Fire Effect */}
        {currentMood === 'angry' && (
          <div style={{ position: 'absolute', top: '8%', right: '10%', color: '#ff4757', pointerEvents: 'none' }}>
            <Flame size={Math.round(numericSize * 0.22)} />
          </div>
        )}

        {/* Victory Trophy Effect */}
        {currentMood === 'victory' && (
          <div style={{ position: 'absolute', top: '8%', right: '10%', color: '#ffd700', pointerEvents: 'none' }}>
            <Trophy size={Math.round(numericSize * 0.24)} fill="#ffd700" />
          </div>
        )}

        {/* Sparkles */}
        {(isEating || (happiness > 80 && currentMood === 'happy')) && (
          <div style={{ position: 'absolute', top: '12%', right: '12%', color: '#ff9f43', pointerEvents: 'none' }}>
            <Sparkles size={Math.round(numericSize * 0.2)} />
          </div>
        )}
      </div>

      {/* Skin Accessories (Hat, Glasses, Crown) */}
      {getSkinAccessory()}

      {/* Shocked Exclamation */}
      {currentMood === 'shocked' && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: '-20px',
            right: '-10px',
            fontSize: `${Math.round(numericSize * 0.22)}px`,
            pointerEvents: 'none',
          }}
        >
          😲 ⚡
        </motion.div>
      )}

      {/* Eating Fish Floating Icon */}
      {isEating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 10 }}
          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1], y: [-10, -40] }}
          transition={{ duration: 1.5 }}
          style={{
            position: 'absolute',
            top: '-15%',
            fontSize: `${Math.round(numericSize * 0.28)}px`,
            pointerEvents: 'none',
          }}
        >
          🐟
        </motion.div>
      )}

      {/* Sleeping Zzz */}
      {currentMood === 'sleepy' && (
        <motion.div
          animate={{ y: [-5, -25], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: '-15px',
            right: '5px',
            fontSize: `${Math.round(numericSize * 0.22)}px`,
            fontWeight: 800,
            color: '#ff9f43',
            pointerEvents: 'none',
            textShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        >
          Zzz...
        </motion.div>
      )}
    </motion.div>
  );
};

export default OrangeCatIcon;
