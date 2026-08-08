import React from 'react';
import { Cat, Sparkles, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface CatIconProps {
  skin?: string;
  isSleeping?: boolean;
  isEating?: boolean;
  happiness?: number;
  size?: number | string;
  className?: string;
  onClick?: () => void;
}

export const CatIcon: React.FC<CatIconProps> = ({
  skin = 'default',
  isSleeping = false,
  isEating = false,
  happiness = 70,
  size = 180,
  className = '',
  onClick,
}) => {
  // Convert size to numeric px if number, or use directly
  const numericSize = typeof size === 'number' ? size : parseInt(size) || 180;
  const iconSize = Math.round(numericSize * 0.55);

  const getSkinAccessory = () => {
    switch (skin) {
      case 'hat':
        return (
          <div 
            style={{ 
              position: 'absolute', 
              top: '-15%', 
              left: '50%', 
              transform: 'translateX(-50%)',
              fontSize: `${Math.round(numericSize * 0.35)}px`,
              lineHeight: 1,
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))',
              zIndex: 3,
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
              top: '25%', 
              left: '50%', 
              transform: 'translateX(-50%)',
              fontSize: `${Math.round(numericSize * 0.35)}px`,
              lineHeight: 1,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              zIndex: 3,
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
              top: '-22%', 
              left: '50%', 
              transform: 'translateX(-50%)',
              fontSize: `${Math.round(numericSize * 0.38)}px`,
              lineHeight: 1,
              filter: 'drop-shadow(0 4px 8px rgba(255, 215, 0, 0.4))',
              zIndex: 3,
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
      className={`cat-icon-wrapper ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={
        isEating ? { scale: [1, 1.08, 0.96, 1], rotate: [0, -4, 4, 0] } :
        isSleeping ? { scale: [1, 1.03, 1], transition: { duration: 2.5, repeat: Infinity } } :
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
      {/* Background Badge Circle with Soft Gradient & Glass Shadow */}
      <div 
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: isSleeping 
            ? 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
            : isEating || happiness > 90
            ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfeef0 100%)'
            : 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isSleeping
            ? '0 12px 28px rgba(161, 196, 253, 0.4)'
            : '0 12px 28px rgba(255, 154, 158, 0.4)',
          border: '4px solid rgba(255, 255, 255, 0.8)',
          position: 'relative',
          transition: 'background 0.5s ease, box-shadow 0.5s ease',
        }}
      >
        {/* Cat Main Vector Icon */}
        <Cat 
          size={iconSize} 
          color={isSleeping ? '#4a6fa5' : '#e65c00'} 
          strokeWidth={2.2} 
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))',
            opacity: isSleeping ? 0.85 : 1,
            transition: 'color 0.3s ease',
          }}
        />

        {/* Sleeping Expression (Closed Eyes overlay) */}
        {isSleeping && (
          <div 
            style={{
              position: 'absolute',
              top: '38%',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: `${Math.round(numericSize * 0.18)}px`,
              letterSpacing: '6px',
              fontWeight: 'bold',
              color: '#3a506b',
              pointerEvents: 'none'
            }}
          >
            ︶︶
          </div>
        )}

        {/* Happy Sparkles for Eating/High Happiness */}
        {(isEating || (happiness > 80 && !isSleeping)) && (
          <div style={{ position: 'absolute', top: '12%', right: '12%', color: '#ff4757', pointerEvents: 'none' }}>
            <Sparkles size={Math.round(numericSize * 0.18)} />
          </div>
        )}
      </div>

      {/* Skin Accessory (Hat, Sunglasses, Crown) */}
      {getSkinAccessory()}

      {/* Sleeping Zzz animation */}
      {isSleeping && (
        <motion.div
          animate={{ y: [-5, -25], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: '-10px',
            right: '0px',
            fontSize: `${Math.round(numericSize * 0.2)}px`,
            fontWeight: 800,
            color: '#4a6fa5',
            pointerEvents: 'none',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          Zzz
        </motion.div>
      )}

      {/* Heart burst when pet or very happy */}
      {happiness > 80 && !isSleeping && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1], y: [-10, -35] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: '0%',
            right: '-10%',
            color: '#ff4757',
            pointerEvents: 'none',
          }}
        >
          <Heart size={Math.round(numericSize * 0.22)} fill="#ff4757" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default CatIcon;
