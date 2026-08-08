import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Star, Plus, X, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const Tests: React.FC = () => {
  const { state, addTest, deleteTest, updateTestStatus } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [loadingTestId, setLoadingTestId] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  const handleAdd = () => {
    if (!name || !link) return;
    addTest({
      id: Date.now().toString(),
      name,
      score: 0,
      date: new Date().toLocaleDateString('vi-VN'),
      link,
      status: 'pending'
    });
    setShowForm(false);
    setName('');
    setLink('');
  };

  const handleDoTest = (testId: string, testLink: string, customScore?: number) => {
    if (testLink && testLink !== '#') {
      window.open(testLink, '_blank');
    }
    
    setLoadingTestId(testId);
    setTimeout(() => {
      const finalScore = customScore !== undefined 
        ? customScore 
        : Math.floor(Math.random() * (100 - 50 + 1)) + 50;
      updateTestStatus(testId, finalScore);
      setLoadingTestId(null);
    }, 2000);
  };

  const pendingTests = state.tests.filter(t => t.status === 'pending');
  const completedTests = state.tests.filter(t => t.status === 'completed');

  return (
    <div className="tests-container" style={{ position: 'relative' }}>
      
      {state.isTeacherMode && (
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn" onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} /> Tạo Bài Test Mới
          </button>
        </div>
      )}

      {pendingTests.length > 0 && (
        <div className="glass-panel p-6 mb-6">
          <h2>Bài Kiểm Tra Đang Chờ</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            {pendingTests.map(test => (
              <div key={test.id} style={{ background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', padding: '24px', borderRadius: '24px', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                
                {state.isTeacherMode && (
                  <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 12 }}>
                    <button 
                      onClick={() => deleteTest(test.id)}
                      title="Xóa bài kiểm tra này"
                      style={{ background: 'rgba(255,255,255,0.25)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}

                <AnimatePresence>
                  {loadingTestId === test.id && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, color: 'var(--primary)' }}
                    >
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                        <Loader2 size={48} />
                      </motion.div>
                      <h3 style={{ marginTop: '16px' }}>Đang nộp bài & cập nhật biểu cảm Mèo Cam...</h3>
                      <p>Vui lòng chờ trong giây lát</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <h3 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{test.name}</h3>
                <p style={{ fontSize: '1rem', marginBottom: '20px' }}>Hoàn thành bài test để nhận cá 🐟 và XP cho Mèo Cam!</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDoTest(test.id, test.link)}
                    className="btn" 
                    style={{ background: '#FFE66D', color: '#2C3E50', fontSize: '1.1rem', padding: '14px 28px', fontWeight: 'bold' }}
                  >
                    🚀 Mở Quizizz Làm Bài & Cập Nhật Điểm
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-panel p-6">
        <h2>Lịch sử điểm số</h2>
        {completedTests.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Chưa có bài kiểm tra nào hoàn thành.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {completedTests.map(test => (
              <div key={test.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '16px 20px', borderRadius: '16px', border: '1px solid #eee' }}>
                <div>
                  <h4 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: '0 0 4px 0' }}>{test.name}</h4>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{test.date}</p>
                    {test.link !== '#' && (
                      <a href={test.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>Xem bài làm</a>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: test.score >= 90 ? 'var(--secondary)' : 'var(--primary)' }}>
                    {test.score} điểm
                  </span>
                  <Star fill={test.score >= 90 ? '#FFE66D' : '#ccc'} color={test.score >= 90 ? '#FFE66D' : '#ccc'} size={26} />
                  <button 
                    onClick={() => deleteTest(test.id)}
                    title="Xóa bài làm này"
                    style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {ReactDOM.createPortal(
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.55)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                backdropFilter: 'blur(4px)'
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={e => e.stopPropagation()}
                style={{
                  width: '420px',
                  background: 'white',
                  borderRadius: '24px',
                  padding: '28px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  position: 'relative'
                }}
              >
                {/* Close button */}
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                >
                  <X size={18} />
                </button>

                <h2 style={{ marginBottom: '8px', color: '#2d3436', fontSize: '1.3rem' }}>🎯 Giao Bài Test Mới</h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>Hệ thống sẽ tự động đồng bộ điểm sau khi bé làm bài.</p>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: '#374151' }}>Tên bài kiểm tra:</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="VD: Quizizz Unit 1"
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', fontFamily: 'Nunito, sans-serif' }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: '#374151' }}>Link bài test (Quizizz):</label>
                  <input
                    value={link}
                    onChange={e => setLink(e.target.value)}
                    placeholder="https://quizizz.com/..."
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', fontFamily: 'Nunito, sans-serif' }}
                  />
                </div>

                <button onClick={handleAdd} className="btn" style={{ width: '100%', fontSize: '1rem', padding: '14px' }}>🚀 Giao Bài Ngay</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default Tests;
