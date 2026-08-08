import React from 'react';
import { Sparkles, Trophy, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import type { HeroMood } from '../context/AppContext';

interface SpidermanIconProps {
  skin?: string; // 'default' | 'black' | 'iron' | 'stealth'
  mood?: HeroMood;
  isSleeping?: boolean;
  isEating?: boolean;
  happiness?: number;
  size?: number | string;
  className?: string;
  onClick?: () => void;
}

export const SpidermanIcon: React.FC<SpidermanIconProps> = ({
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
  const maskSize = Math.round(numericSize * 0.65);

  // Effective mood (override if sleeping or eating)
  const currentMood: HeroMood = isSleeping ? 'sleepy' : (isEating ? 'happy' : mood);

  // Suit Color Schemes
  const getSuitStyles = () => {
    switch (skin) {
      case 'black':
        return {
          bgGradient: currentMood === 'crying' 
            ? 'linear-gradient(135deg, #181925 0%, #2b3a4a 100%)' 
            : 'linear-gradient(135deg, #1e1e24 0%, #2b2d42 100%)',
          maskBg: '#121212',
          eyesColor: currentMood === 'crying' ? '#90e0ef' : '#ffffff',
          webColor: '#4a4e69',
          shadow: 'rgba(0, 0, 0, 0.6)',
          accent: '#ffffff',
        };
      case 'iron':
        return {
          bgGradient: currentMood === 'crying' 
            ? 'linear-gradient(135deg, #660000 0%, #4a5568 100%)'
            : 'linear-gradient(135deg, #990000 0%, #ffcc00 100%)',
          maskBg: '#b30000',
          eyesColor: currentMood === 'crying' ? '#a5f3fc' : '#e6f7ff',
          webColor: '#ffd700',
          shadow: 'rgba(212, 175, 55, 0.5)',
          accent: '#ffd700',
        };
      case 'stealth':
        return {
          bgGradient: currentMood === 'crying' 
            ? 'linear-gradient(135deg, #091217 0%, #1e293b 100%)' 
            : 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
          maskBg: '#051923',
          eyesColor: currentMood === 'crying' ? '#7dd3fc' : '#00f5d4',
          webColor: '#00b4d8',
          shadow: 'rgba(0, 245, 212, 0.4)',
          accent: '#00f5d4',
        };
      case 'default':
      default:
        return {
          bgGradient: currentMood === 'crying'
            ? 'linear-gradient(135deg, #7f1d1d 0%, #3b82f6 100%)'
            : 'linear-gradient(135deg, #e63946 0%, #457b9d 100%)',
          maskBg: '#d62828',
          eyesColor: currentMood === 'crying' ? '#bae6fd' : '#ffffff',
          webColor: '#003049',
          shadow: 'rgba(230, 57, 70, 0.45)',
          accent: '#ffe66d',
        };
    }
  };

  const suit = getSuitStyles();

  // Eye Shapes based on Mood
  const renderEyes = () => {
    switch (currentMood) {
      case 'crying':
        // Drooping sad eyes with teardrop cutouts
        return (
          <>
            <path
              d="M 22 48 Q 34 56 46 45 Q 34 40 22 48 Z"
              fill={suit.eyesColor}
              stroke="#000000"
              strokeWidth="3.5"
            />
            <path
              d="M 78 48 Q 66 56 54 45 Q 66 40 78 48 Z"
              fill={suit.eyesColor}
              stroke="#000000"
              strokeWidth="3.5"
            />
          </>
        );
      case 'angry':
        // Slanted sharp fierce eyes
        return (
          <>
            <path
              d="M 20 34 Q 38 46 46 50 Q 30 58 20 34 Z"
              fill="#fff"
              stroke="#000000"
              strokeWidth="3.5"
            />
            <path
              d="M 80 34 Q 62 46 54 50 Q 70 58 80 34 Z"
              fill="#fff"
              stroke="#000000"
              strokeWidth="3.5"
            />
          </>
        );
      case 'victory':
        // Starry joyful eyes
        return (
          <>
            <path
              d="M 18 38 Q 34 26 48 42 Q 36 62 18 38 Z"
              fill="#fff7ed"
              stroke="#ffd700"
              strokeWidth="4"
            />
            <path
              d="M 82 38 Q 66 26 52 42 Q 64 62 82 38 Z"
              fill="#fff7ed"
              stroke="#ffd700"
              strokeWidth="4"
            />
          </>
        );
      case 'shocked':
        // Big round surprised eyes
        return (
          <>
            <circle cx="32" cy="45" r="14" fill="#ffffff" stroke="#000000" strokeWidth="4" />
            <circle cx="68" cy="45" r="14" fill="#ffffff" stroke="#000000" strokeWidth="4" />
          </>
        );
      case 'sleepy':
        // Closed relaxed eyes
        return (
          <>
            <path d="M 22 45 Q 35 48 45 45" fill="none" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
            <path d="M 55 45 Q 65 48 78 45" fill="none" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
          </>
        );
      case 'happy':
      case 'normal':
      default:
        // Classic sleek lenses
        return (
          <>
            <path
              d="M 20 40 Q 34 32 46 45 Q 36 60 20 40 Z"
              fill={suit.eyesColor}
              stroke="#000000"
              strokeWidth="3.5"
            />
            <path
              d="M 80 40 Q 66 32 54 45 Q 64 60 80 40 Z"
              fill={suit.eyesColor}
              stroke="#000000"
              strokeWidth="3.5"
            />
          </>
        );
    }
  };

  return (
    <motion.div
      className={`spiderman-icon-wrapper ${className}`}
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
      {/* Spider-Web Hanging Line on Top */}
      <div 
        style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '3px',
          height: '45px',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(200,200,255,0.4))',
          boxShadow: '0 0 6px rgba(255,255,255,0.6)',
          zIndex: 1,
        }}
      />

      {/* Main Hero Circle Badge */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: suit.bgGradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 12px 30px ${suit.shadow}`,
          border: '4px solid rgba(255, 255, 255, 0.85)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s ease',
        }}
      >
        {/* Background Web Net Pattern */}
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 100 100" 
          style={{ position: 'absolute', opacity: 0.25, pointerEvents: 'none' }}
        >
          <circle cx="50" cy="50" r="15" fill="none" stroke="#ffffff" strokeWidth="1" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="#ffffff" strokeWidth="1" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="#ffffff" strokeWidth="1" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="#ffffff" strokeWidth="1" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#ffffff" strokeWidth="1" />
          <line x1="14.6" y1="14.6" x2="85.4" y2="85.4" stroke="#ffffff" strokeWidth="1" />
          <line x1="14.6" y1="85.4" x2="85.4" y2="14.6" stroke="#ffffff" strokeWidth="1" />
        </svg>

        {/* Vector Spider-Man Mask Illustration */}
        <svg
          width={maskSize}
          height={maskSize}
          viewBox="0 0 100 110"
          style={{
            filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.3))',
            zIndex: 2,
          }}
        >
          {/* Mask Base Shape */}
          <path
            d="M 50 5 Q 88 5 85 55 Q 82 98 50 105 Q 18 98 15 55 Q 12 5 50 5 Z"
            fill={suit.maskBg}
            stroke={suit.webColor}
            strokeWidth="3"
          />

          {/* Mask Web Lines */}
          <path d="M 50 5 L 50 105" stroke={suit.webColor} strokeWidth="1.5" opacity="0.6" />
          <path d="M 15 55 L 85 55" stroke={suit.webColor} strokeWidth="1.5" opacity="0.6" />
          <path d="M 50 55 Q 68 30 80 20" stroke={suit.webColor} strokeWidth="1.5" opacity="0.6" />
          <path d="M 50 55 Q 32 30 20 20" stroke={suit.webColor} strokeWidth="1.5" opacity="0.6" />
          <path d="M 50 55 Q 68 80 80 90" stroke={suit.webColor} strokeWidth="1.5" opacity="0.6" />
          <path d="M 50 55 Q 32 80 20 90" stroke={suit.webColor} strokeWidth="1.5" opacity="0.6" />

          {/* Render Eyes according to mood */}
          {renderEyes()}

          {/* Spider Logo on Chest */}
          <path
            d="M 50 82 L 47 88 L 50 92 L 53 88 Z"
            fill={suit.accent}
          />
        </svg>

        {/* Crying Teardrops Streaming Down Mask */}
        {currentMood === 'crying' && (
          <>
            <motion.div
              animate={{ y: [0, 25], opacity: [1, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeIn' }}
              style={{
                position: 'absolute',
                top: '42%',
                left: '32%',
                fontSize: `${Math.round(numericSize * 0.16)}px`,
                pointerEvents: 'none',
                zIndex: 4,
              }}
            >
              💧
            </motion.div>
            <motion.div
              animate={{ y: [0, 25], opacity: [1, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.4, ease: 'easeIn' }}
              style={{
                position: 'absolute',
                top: '42%',
                right: '32%',
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
          <div style={{ position: 'absolute', top: '12%', right: '12%', color: suit.accent, pointerEvents: 'none' }}>
            <Sparkles size={Math.round(numericSize * 0.2)} />
          </div>
        )}
      </div>

      {/* Mood Overlay Emojis & Speech Indicators */}

      {/* Crying Mood Banner */}
      {currentMood === 'crying' && (
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: '-25px',
            background: '#ef4444',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: `${Math.round(numericSize * 0.1)}px`,
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(239, 68, 68, 0.4)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 5,
          }}
        >
          😭 Huhu! Điểm thấp quá...
        </motion.div>
      )}

      {/* Angry Mood Banner */}
      {currentMood === 'angry' && (
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: '-25px',
            background: '#dc2626',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: `${Math.round(numericSize * 0.1)}px`,
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(220, 38, 38, 0.4)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 5,
          }}
        >
          🔥 Quyết tâm gỡ điểm!
        </motion.div>
      )}

      {/* Victory Banner */}
      {currentMood === 'victory' && (
        <motion.div
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: '-25px',
            background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: `${Math.round(numericSize * 0.1)}px`,
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(234, 179, 8, 0.5)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 5,
          }}
        >
          🏆 Siêu Anh Hùng Đỉnh Cao!
        </motion.div>
      )}

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

      {/* Eating Pizza */}
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
          🍕
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
            color: '#00b4d8',
            pointerEvents: 'none',
            textShadow: '0 2px 6px rgba(0,0,0,0.3)',
          }}
        >
          Zzz...
        </motion.div>
      )}
    </motion.div>
  );
};

export default SpidermanIcon;
