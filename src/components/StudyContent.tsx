import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Volume2, Image as ImageIcon, Plus, X, Edit3, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const colors = ['#FF9A9E', '#84FAB0', '#FCCB90', '#8FD3F4', '#a18cd1', '#fbc2eb'];

interface WordItem {
  en: string;
  vi: string;
  idx: number;
  customId?: string;
}

const StudyContent: React.FC = () => {
  const { state, addCustomWord, updateWord, deleteWord } = useAppContext();
  const [activeWeek, setActiveWeek] = useState(1);
  const [activeLesson, setActiveLesson] = useState(1);
  
  // Add Word Form State
  const [showForm, setShowForm] = useState(false);
  const [enWord, setEnWord] = useState('');
  const [viWord, setViWord] = useState('');

  // Edit Word Form State
  const [editingWord, setEditingWord] = useState<WordItem | null>(null);
  const [editEn, setEditEn] = useState('');
  const [editVi, setEditVi] = useState('');

  const weekData = state.curriculum.find(w => w.week === activeWeek) || state.curriculum[0];
  const lessonData = weekData?.lessons.find(l => l.id === activeLesson) || weekData?.lessons[0];

  // Combine static words with custom words added for this lesson
  const staticWords: WordItem[] = (lessonData?.words || []).map((w, idx) => ({ ...w, idx }));
  const customWordsForLesson: WordItem[] = state.customWords
    .filter(w => w.lessonId === activeLesson)
    .map((w, idx) => ({ en: w.en, vi: w.vi, idx: staticWords.length + idx, customId: w.id }));

  const allWords: WordItem[] = [...staticWords, ...customWordsForLesson];

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

  const handleStartEdit = (word: WordItem) => {
    setEditingWord(word);
    setEditEn(word.en);
    setEditVi(word.vi);
  };

  const handleSaveEdit = () => {
    if (!editingWord || !editEn || !editVi) return;
    updateWord(activeWeek, activeLesson, editingWord.idx, { en: editEn, vi: editVi }, editingWord.customId);
    setEditingWord(null);
    setEditEn('');
    setEditVi('');
  };

  const handleDelete = (word: WordItem) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa từ vựng "${word.en}"?`)) {
      deleteWord(activeWeek, activeLesson, word.idx, word.customId);
    }
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
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
            onClick={() => { 
              setActiveWeek(w); 
              setActiveLesson(state.curriculum.find(x => x.week === w)?.lessons[0].id || 1); 
            }}
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
              whiteSpace: 'nowrap',
              fontWeight: activeLesson === l.id ? 'bold' : 'normal'
            }}
          >
            {l.title.split(':')[0]}
          </button>
        ))}
      </div>

      <div className="glass-panel p-6">
        <h2 style={{ marginBottom: '24px' }}>Nội dung: {lessonData?.title}</h2>
        <div className="flashcards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          {allWords.map((word, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.04, rotateY: 5 }}
              className="flashcard"
              style={{
                background: colors[idx % colors.length],
                borderRadius: '24px',
                padding: '28px 24px',
                textAlign: 'center',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                position: 'relative'
              }}
            >
              {/* Actions Header */}
              <div style={{ position: 'absolute', top: '14px', right: '14px', display: 'flex', gap: '6px' }}>
                <button 
                  onClick={() => speakWord(word.en)}
                  className="btn-sound"
                  title="Phát âm từ này"
                  style={{
                    background: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    padding: '8px',
                    cursor: 'pointer',
                    color: colors[idx % colors.length],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                  }}
                >
                  <Volume2 size={18} />
                </button>

                {state.isTeacherMode && (
                  <>
                    <button 
                      onClick={() => handleStartEdit(word)}
                      title="Sửa từ vựng"
                      style={{
                        background: 'rgba(255,255,255,0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        padding: '8px',
                        cursor: 'pointer',
                        color: '#0284c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                      }}
                    >
                      <Edit3 size={16} />
                    </button>

                    <button 
                      onClick={() => handleDelete(word)}
                      title="Xóa từ vựng này"
                      style={{
                        background: 'rgba(255,255,255,0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        padding: '8px',
                        cursor: 'pointer',
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>

              <div className="icon" style={{ background: 'white', padding: '16px', borderRadius: '50%', display: 'inline-block', marginBottom: '16px', marginTop: '8px' }}>
                <ImageIcon size={32} color={colors[idx % colors.length]} />
              </div>
              <h3 style={{ color: 'white', fontSize: '2rem', margin: '0 0 8px 0', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>{word.en}</h3>
              <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '1.2rem', fontWeight: 'bold' }}>{word.vi}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODAL 1: Add Word */}
      {ReactDOM.createPortal(
        showForm && (
          <AnimatePresence>
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
                style={{ width: '400px', background: 'white', borderRadius: '24px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', position: 'relative', fontFamily: 'Nunito, sans-serif' }}
              >
                <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                  <X size={18} />
                </button>
                <h2 style={{ marginBottom: '20px', color: '#2d3436', fontSize: '1.2rem' }}>📚 Thêm Nội Dung / Từ Vựng Mới</h2>
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
          </AnimatePresence>
        ),
        document.body
      )}

      {/* MODAL 2: Edit Word */}
      {ReactDOM.createPortal(
        editingWord && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingWord(null)}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={e => e.stopPropagation()}
                style={{ width: '400px', background: 'white', borderRadius: '24px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', position: 'relative', fontFamily: 'Nunito, sans-serif' }}
              >
                <button onClick={() => setEditingWord(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                  <X size={18} />
                </button>
                <h2 style={{ marginBottom: '20px', color: '#2d3436', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ✏️ Chỉnh Sửa Từ Vựng
                </h2>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: '#374151' }}>Tiếng Anh:</label>
                  <input value={editEn} onChange={e => setEditEn(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', fontFamily: 'Nunito, sans-serif' }} />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: '#374151' }}>Tiếng Việt:</label>
                  <input value={editVi} onChange={e => setEditVi(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', fontFamily: 'Nunito, sans-serif' }} />
                </div>
                <button onClick={handleSaveEdit} className="btn" style={{ width: '100%', fontSize: '1rem', padding: '14px' }}>Cập Nhật Từ Vựng</button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        ),
        document.body
      )}
    </div>
  );
};

export default StudyContent;
