import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Volume2, Image as ImageIcon, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { curriculum } from '../data';
import { useAppContext } from '../context/AppContext';

const colors = ['#FF9A9E', '#84FAB0', '#FCCB90', '#8FD3F4', '#a18cd1', '#fbc2eb'];

const StudyContent: React.FC = () => {
  const { state, addCustomWord } = useAppContext();
  const [activeWeek, setActiveWeek] = useState(1);
  const [activeLesson, setActiveLesson] = useState(1);
  
  const [showForm, setShowForm] = useState(false);
  const [enWord, setEnWord] = useState('');
  const [viWord, setViWord] = useState('');

  const weekData = curriculum.find(w => w.week === activeWeek);
  const lessonData = weekData?.lessons.find(l => l.id === activeLesson) || weekData?.lessons[0];

  // Combine static words with custom words added by teacher for this lesson
  const staticWords = lessonData?.words || [];
  const customWordsForLesson = state.customWords.filter(w => w.lessonId === activeLesson);
  const allWords = [...staticWords, ...customWordsForLesson];

  const handleAdd = () => {
    if (!enWord || !viWord) return;
    addCustomWord({
      id: Date.now().toString(),
      week: activeWeek,
      lessonId: activeLesson,
      en: enWord,
      vi: viWord
    });
    setShowForm(false);
    setEnWord('');
    setViWord('');
  };

  return (
    <div className="study-container">
      {state.isTeacherMode && (
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn" onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} /> Thêm Từ Vựng / Nội Dung Mới
          </button>
        </div>
      )}

      {/* Week Selector */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        {[1, 2, 3].map(w => (
          <button 
            key={w}
            onClick={() => { setActiveWeek(w); setActiveLesson(curriculum.find(x => x.week === w)?.lessons[0].id || 1); }}
            className={`btn ${activeWeek === w ? '' : 'btn-secondary'}`}
            style={{ opacity: activeWeek === w ? 1 : 0.7, padding: '8px 16px', fontSize: '0.9rem' }}
          >
            Tuần {w}
          </button>
        ))}
      </div>

      {/* Lesson Selector */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
        {weekData?.lessons.map(l => (
          <button 
            key={l.id}
            onClick={() => setActiveLesson(l.id)}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '999px', 
              border: 'none',
              background: activeLesson === l.id ? 'var(--secondary)' : '#eee',
              color: activeLesson === l.id ? 'white' : 'var(--text-muted)',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {l.title.split(':')[0]}
          </button>
        ))}
      </div>

      <div className="glass-panel p-6">
        <h2 style={{ marginBottom: '24px' }}>Nội dung: {lessonData?.title}</h2>
        <div className="flashcards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          {allWords.map((word, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.05, rotateY: 10 }}
              className="flashcard"
              style={{
                background: colors[idx % colors.length],
                borderRadius: '24px',
                padding: '32px',
                textAlign: 'center',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <div className="icon" style={{ background: 'white', padding: '16px', borderRadius: '50%', display: 'inline-block', marginBottom: '16px' }}>
                <ImageIcon size={32} color={colors[idx % colors.length]} />
              </div>
              <h3 style={{ color: 'white', fontSize: '2rem', margin: '0 0 8px 0', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>{word.en}</h3>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', fontWeight: 'bold' }}>{word.vi}</p>
              
              <button 
                className="btn-sound"
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '8px',
                  cursor: 'pointer',
                  color: colors[idx % colors.length]
                }}
              >
                <Volume2 size={20} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {ReactDOM.createPortal(
        showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '400px', background: 'white', borderRadius: '24px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', position: 'relative' }}
            >
              <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
              <h2 style={{ marginBottom: '20px', color: '#2d3436', fontSize: '1.2rem' }}>📚 Thêm Nội Dung / Từ Vựng</h2>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: '#374151' }}>Tiếng Anh:</label>
                <input value={enWord} onChange={e => setEnWord(e.target.value)} placeholder="VD: Apple" style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', fontFamily: 'Nunito, sans-serif' }} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: '#374151' }}>Tiếng Việt:</label>
                <input value={viWord} onChange={e => setViWord(e.target.value)} placeholder="VD: Quả táo" style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', fontFamily: 'Nunito, sans-serif' }} />
              </div>
              <button onClick={handleAdd} className="btn" style={{ width: '100%', fontSize: '1rem', padding: '14px' }}>Lưu Từ Vựng</button>
            </motion.div>
          </motion.div>
        ),
        document.body
      )}
    </div>
  );
};

export default StudyContent;
