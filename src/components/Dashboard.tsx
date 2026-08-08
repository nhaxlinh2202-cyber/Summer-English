import React from 'react';
import { Star, Award, CheckCircle, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { translations } from '../translations';

const Dashboard: React.FC = () => {
  const { state, resetProgress } = useAppContext();
  const lang = state.language || 'vi';
  const t = translations[lang];
  
  const totalLessons = 12;
  const completedCount = state.completedLessons.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const handleReset = () => {
    if (confirm(t.resetConfirm)) {
      resetProgress();
    }
  };

  return (
    <div className="dashboard-container">
      {/* Student Welcome & Profile Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 mb-6" 
        style={{ 
          background: 'linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%)', 
          borderRadius: '24px',
          color: '#1e3799',
          boxShadow: '0 8px 24px rgba(120, 255, 214, 0.35)',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            fontSize: '3rem', 
            background: 'white', 
            width: '72px', 
            height: '72px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            {state.profile.avatarIcon || '🐱'}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#0c2461' }}>
              {t.welcomeStudent.replace('{name}', state.profile.studentName)}
            </h2>
            <div style={{ display: 'flex', gap: '12px', marginTop: '6px', flexWrap: 'wrap', fontSize: '0.9rem', fontWeight: 'bold' }}>
              <span style={{ background: 'rgba(255,255,255,0.7)', padding: '4px 10px', borderRadius: '12px', color: '#1e3799' }}>
                🏫 {t.class}: {state.profile.studentClass || 'Lớp 3A'}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.7)', padding: '4px 10px', borderRadius: '12px', color: '#e67e22' }}>
                🐾 {t.favoriteMascot}: {state.profile.favoriteMascot || 'Mèo Cam 🍊'}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.7)', padding: '4px 10px', borderRadius: '12px', color: '#6c5ce7' }}>
                🎯 {t.targetGoal}: {state.profile.targetGoal || 'Mục tiêu 100đ'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px', opacity: 0.8, color: '#0c2461' }}>
          {t.teacherName}: {state.profile.teacherName}
        </div>
      </motion.div>

      <div className="grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        
        <motion.div whileHover={{ scale: 1.05 }} className="glass-panel p-6 stat-card" style={{ background: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)' }}>
          <div className="stat-icon" style={{ background: 'white', padding: '12px', borderRadius: '50%', width: 'fit-content', color: '#FF6B6B' }}>
            <Star size={32} />
          </div>
          <h3 style={{ marginTop: '16px', color: 'white', fontSize: '1.2rem' }}>{t.expPoints}</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>{state.stars}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="glass-panel p-6 stat-card" style={{ background: 'linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%)' }}>
          <div className="stat-icon" style={{ background: 'white', padding: '12px', borderRadius: '50%', width: 'fit-content', color: '#4ECDC4' }}>
            <CheckCircle size={32} />
          </div>
          <h3 style={{ marginTop: '16px', color: 'white', fontSize: '1.2rem' }}>{t.completedLessons}</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>{completedCount}/{totalLessons}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="glass-panel p-6 stat-card" style={{ background: 'linear-gradient(135deg, #FCCB90 0%, #D57EEB 100%)' }}>
          <div className="stat-icon" style={{ background: 'white', padding: '12px', borderRadius: '50%', width: 'fit-content', color: '#9B59B6' }}>
            <Award size={32} />
          </div>
          <h3 style={{ marginTop: '16px', color: 'white', fontSize: '1.2rem' }}>{t.level}</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>Lv. {state.catLevel}</p>
        </motion.div>

      </div>

      <div className="glass-panel p-6 mt-6" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ margin: 0 }}>{t.summerTrack}</h2>
          
          {state.isTeacherMode && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '6px 14px', 
                borderRadius: '999px',
                border: '1.5px solid #fca5a5',
                background: '#fef2f2',
                color: '#ef4444',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.15)'
              }}
            >
              <RotateCcw size={15} />
              <span>{t.resetProgressBtn}</span>
            </motion.button>
          )}
        </div>
        <div className="progress-bar-container" style={{ background: '#eee', borderRadius: '999px', height: '32px', overflow: 'hidden', position: 'relative' }}>
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${progressPercent}%` }} 
            transition={{ duration: 1 }}
            style={{ background: 'var(--secondary)', height: '100%', borderRadius: '999px' }}
          />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: progressPercent > 50 ? 'white' : 'var(--text-main)', fontWeight: 'bold' }}>
            {t.completedProgress.replace('{percent}', progressPercent.toString())}
          </div>
        </div>
        
        {/* Track milestones */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', padding: '0 16px' }}>
          {[1, 4, 8, 12].map(m => (
            <div key={m} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: completedCount >= m ? 'var(--secondary)' : '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {m}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{t.lessonMilestone.replace('{num}', m.toString())}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
