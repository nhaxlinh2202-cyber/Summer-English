import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Trash2, Send, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const emojis = [
  { id: 'happy', icon: '😄', label: 'Rất vui', color: '#84FAB0' },
  { id: 'rocket', icon: '🚀', label: 'Siêu thích học', color: '#8FD3F4' },
  { id: 'normal', icon: '🙂', label: 'Bình thường', color: '#FFE66D' },
  { id: 'tired', icon: '😴', label: 'Hơi mệt', color: '#FCCB90' },
  { id: 'confused', icon: '😢', label: 'Chưa hiểu lắm', color: '#FF9A9E' },
];

const Feedback: React.FC = () => {
  const { state, addFeedback, deleteFeedback, addStar, addFish } = useAppContext();
  
  // Extract all lessons from curriculum for the lesson selector dropdown
  const allLessons: string[] = [];
  state.curriculum.forEach(w => {
    w.lessons.forEach(l => {
      allLessons.push(`Tuần ${w.week} - ${l.title}`);
    });
  });

  const [selectedLesson, setSelectedLesson] = useState(allLessons[0] || 'Buổi Học Hôm Nay');
  const [selectedEmoji, setSelectedEmoji] = useState(emojis[0].id);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emojiObj = emojis.find(e => e.id === selectedEmoji) || emojis[0];
    
    addFeedback({
      id: Date.now().toString(),
      lessonTitle: selectedLesson,
      emoji: emojiObj.icon,
      moodLabel: emojiObj.label,
      note: note || 'Bé cảm thấy rất hào hứng sau buổi học này!',
      date: new Date().toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }),
    });

    // Reward student with 2 stars and 1 fish for giving feedback!
    addStar(2);
    addFish(1);

    setSubmitted(true);
    setNote('');
    setTimeout(() => setSubmitted(false), 3500);
  };

  const handleDelete = (fbId: string) => {
    if (confirm('Bạn có chắc muốn xóa cảm nhận buổi học này không?')) {
      deleteFeedback(fbId);
    }
  };

  const savedFeedbacks = state.feedbacks || [];

  return (
    <div className="feedback-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Form Panel */}
      <div className="glass-panel p-6" style={{ background: 'white', borderRadius: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ background: 'linear-gradient(135deg, #ff9f43 0%, #ff6b6b 100%)', padding: '12px', borderRadius: '16px', color: 'white' }}>
            <MessageSquare size={28} />
          </div>
          <div>
            <h2 style={{ margin: 0, color: '#2d3436', fontSize: '1.5rem' }}>Gửi Cảm Nhận Sau Buổi Học</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Hãy chia sẻ cảm xúc của con với cô giáo sau mỗi bài học nhé! (+2 ⭐ +1 🐟)</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          {/* Lesson Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', marginBottom: '8px', color: '#475569', fontSize: '0.95rem' }}>
              <BookOpen size={18} color="#0984e3" /> Chọn Buổi Học Của Con:
            </label>
            <select
              value={selectedLesson}
              onChange={e => setSelectedLesson(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '14px',
                border: '2px solid #e2e8f0',
                background: '#f8fafc',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: '#2d3436',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {allLessons.map((l, idx) => (
                <option key={idx} value={l}>{l}</option>
              ))}
              <option value="Buổi Học Khác">Buổi Học Khác</option>
            </select>
          </div>

          {/* Emoji Selection */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '12px', color: '#475569', fontSize: '0.95rem' }}>
              Sau buổi học này, con thấy thế nào?
            </label>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {emojis.map(emoji => {
                const isSelected = selectedEmoji === emoji.id;
                return (
                  <motion.div
                    key={emoji.id}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setSelectedEmoji(emoji.id)}
                    style={{
                      background: isSelected ? emoji.color : '#f8fafc',
                      border: `3px solid ${emoji.color}`,
                      borderRadius: '20px',
                      padding: '16px 12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      flex: '1',
                      minWidth: '100px',
                      maxWidth: '120px',
                      textAlign: 'center',
                      boxShadow: isSelected ? `0 6px 16px ${emoji.color}66` : 'none',
                    }}
                  >
                    <div style={{ fontSize: '2.5rem', marginBottom: '6px' }}>{emoji.icon}</div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: isSelected ? '#2d3436' : '#64748b' }}>
                      {emoji.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Note Input */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#475569', fontSize: '0.95rem' }}>
              Lời nhắn hoặc cảm nhận chi tiết của con:
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="VD: Con rất thích trò chơi phát âm, từ vựng hôm nay rất dễ nhớ..."
              style={{
                width: '100%',
                minHeight: '90px',
                padding: '14px',
                borderRadius: '16px',
                border: '2px solid #e2e8f0',
                background: '#f8fafc',
                fontSize: '0.95rem',
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn"
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #ff9f43 0%, #ff6b6b 100%)',
              color: 'white',
              fontSize: '1.05rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(255, 159, 67, 0.4)',
            }}
          >
            <Send size={20} /> Lưu Cảm Nhận Buổi Học (+2 ⭐ +1 🐟)
          </motion.button>
        </form>

        {/* Success Alert */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: '#dcfce7',
                border: '2px solid #86efac',
                color: '#15803d',
                borderRadius: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <CheckCircle2 size={20} /> Đã lưu cảm nhận buổi học! Bé nhận được 2 Sao ⭐ và 1 Cá 🐟!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Saved Feedback History Section */}
      <div className="glass-panel p-6" style={{ background: 'white', borderRadius: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: '#2d3436', fontSize: '1.3rem' }}>
            <Sparkles size={22} color="#ff9f43" /> Lịch Sử Cảm Nhận Qua Các Buổi Học
          </h2>
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', background: '#fff7ed', color: '#c2410c', padding: '4px 12px', borderRadius: '999px' }}>
            Tổng số: {savedFeedbacks.length} bài
          </span>
        </div>

        {savedFeedbacks.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
            Chưa có cảm nhận nào được lưu. Bé hãy gửi cảm nhận sau từng buổi học nhé!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {savedFeedbacks.map(fb => (
              <motion.div
                key={fb.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '18px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                  <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>
                    {fb.emoji}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                        📚 {fb.lessonTitle}
                      </span>
                      <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                        {fb.moodLabel}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        🕒 {fb.date}
                      </span>
                    </div>

                    <p style={{ margin: 0, color: '#334155', fontSize: '0.95rem', lineHeight: 1.4 }}>
                      "{fb.note}"
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(fb.id)}
                  title="Xóa cảm nhận này"
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fca5a5',
                    borderRadius: '50%',
                    padding: '8px',
                    cursor: 'pointer',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Feedback;
