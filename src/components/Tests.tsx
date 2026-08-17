import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Star, Plus, X, Loader2, Trash2, CheckCircle2, Sparkles, HelpCircle, Percent, Edit3, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext, type TestData } from '../context/AppContext';

const Tests: React.FC = () => {
  const { state, addTest, deleteTest, updateTestStatus } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [loadingTestId, setLoadingTestId] = useState<string | null>(null);
  
  // Quizizz score sync state
  const [quizizzModalTest, setQuizizzModalTest] = useState<TestData | null>(null);
  const [selectedPercent, setSelectedPercent] = useState<number>(100);

  // Direct manual score edit modal state (for pending or completed tests)
  const [manualScoreModalTest, setManualScoreModalTest] = useState<TestData | null>(null);
  const [manualInputScore, setManualInputScore] = useState<string>('100');

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

  const handleOpenQuizizz = (test: TestData) => {
    if (test.link && test.link !== '#') {
      window.open(test.link, '_blank');
    }
    setSelectedPercent(100);
    setQuizizzModalTest(test);
  };

  const handleConfirmScore = (percent: number) => {
    if (!quizizzModalTest) return;
    const testId = quizizzModalTest.id;
    setQuizizzModalTest(null);
    setLoadingTestId(testId);
    
    setTimeout(() => {
      const score = Math.min(100, Math.max(0, Math.round(percent)));
      updateTestStatus(testId, score, percent);
      setLoadingTestId(null);
    }, 1200);
  };

  const handleOpenManualScore = (test: TestData) => {
    setManualInputScore(test.score > 0 ? test.score.toString() : '100');
    setManualScoreModalTest(test);
  };

  const handleSaveManualScore = () => {
    if (!manualScoreModalTest) return;
    const parsed = Math.min(100, Math.max(0, parseInt(manualInputScore, 10) || 0));
    const testId = manualScoreModalTest.id;
    setManualScoreModalTest(null);
    setLoadingTestId(testId);

    setTimeout(() => {
      updateTestStatus(testId, parsed, parsed);
      setLoadingTestId(null);
    }, 800);
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              🎯 Bài Kiểm Tra Đang Chờ
            </h2>
            <span style={{ fontSize: '0.85rem', background: '#e0e7ff', color: '#4338ca', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold' }}>
              💡 Tự động quy đổi: 100% câu đúng = 100 điểm
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                      <h3 style={{ marginTop: '16px' }}>Đang nộp bài & cập nhật điểm số...</h3>
                      <p style={{ color: '#64748b' }}>Đồng bộ tỉ lệ câu đúng (100% = 100 điểm) vào hồ sơ Mèo Cam</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <h3 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{test.name}</h3>
                <p style={{ fontSize: '1rem', marginBottom: '20px' }}>Hoàn thành bài test để nhận cá 🐟 và XP cho Mèo Cam!</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenQuizizz(test)}
                    className="btn" 
                    style={{ background: '#FFE66D', color: '#2C3E50', fontSize: '1.05rem', padding: '14px 24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    🚀 Mở Quizizz Làm Bài & Cập Nhật Điểm
                  </motion.button>

                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenManualScore(test)}
                    style={{ 
                      background: 'rgba(255,255,255,0.25)', 
                      backdropFilter: 'blur(8px)',
                      color: 'white', 
                      border: '1.5px solid rgba(255,255,255,0.6)', 
                      borderRadius: '16px', 
                      fontSize: '1rem', 
                      padding: '14px 22px', 
                      fontWeight: 'bold', 
                      cursor: 'pointer',
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px' 
                    }}
                  >
                    ✍️ Tự Nhập Điểm Thủ Công
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
            {completedTests.map(test => {
              const accuracy = test.accuracyPercent ?? test.score;
              return (
                <div key={test.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '16px 20px', borderRadius: '16px', border: '1px solid #eee', flexWrap: 'wrap', gap: '12px' }}>
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
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: test.score >= 90 ? 'var(--secondary)' : 'var(--primary)' }}>
                        {test.score} điểm
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'flex-end' }}>
                        <Percent size={12} /> {accuracy}% câu đúng
                      </div>
                    </div>
                    <Star fill={test.score >= 90 ? '#FFE66D' : '#ccc'} color={test.score >= 90 ? '#FFE66D' : '#ccc'} size={26} />
                    
                    <button 
                      onClick={() => handleOpenManualScore(test)}
                      title="Sửa điểm bài làm này"
                      style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Edit3 size={18} />
                    </button>

                    <button 
                      onClick={() => deleteTest(test.id)}
                      title="Xóa bài làm này"
                      style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL 1: Quizizz Score Sync Modal (% correct answers) */}
      {ReactDOM.createPortal(
        <AnimatePresence>
          {quizizzModalTest && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuizizzModalTest(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(15, 10, 25, 0.75)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                backdropFilter: 'blur(6px)',
                padding: '16px'
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={e => e.stopPropagation()}
                style={{
                  width: '100%',
                  maxWidth: '460px',
                  background: 'white',
                  borderRadius: '28px',
                  padding: '28px',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
                  position: 'relative',
                  fontFamily: 'Nunito, sans-serif'
                }}
              >
                <button
                  onClick={() => setQuizizzModalTest(null)}
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

                <h2 style={{ marginBottom: '6px', color: '#2d3436', fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🎯 Cập Nhật Điểm Quizizz
                </h2>
                <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '18px', lineHeight: 1.5 }}>
                  Nhập hoặc chọn số <b>% câu đúng (0 - 100 điểm)</b> thu được từ màn hình kết quả Quizizz của bạn.
                </p>

                {/* Quizizz UI Preview Card */}
                <div style={{
                  background: 'linear-gradient(145deg, #1b0a2a 0%, #2f1246 100%)',
                  borderRadius: '20px',
                  padding: '18px',
                  color: 'white',
                  marginBottom: '20px',
                  boxShadow: '0 10px 25px rgba(33, 9, 44, 0.4)',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Câu đúng <HelpCircle size={15} style={{ opacity: 0.7 }} />
                    </span>
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.25)',
                      padding: '4px 14px',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      color: '#4ade80',
                      border: '1px solid rgba(74, 222, 128, 0.4)'
                    }}>
                      {selectedPercent}%
                    </span>
                  </div>

                  {/* SVG Chart Preview simulating Quizizz UI */}
                  <div style={{ height: '80px', position: 'relative', width: '100%', borderLeft: '1px dashed rgba(255,255,255,0.15)', borderBottom: '1px dashed rgba(255,255,255,0.15)', paddingLeft: '8px' }}>
                    <svg width="100%" height="100%" viewBox="0 0 300 80" preserveAspectRatio="none">
                      <line x1="20" y1={80 - (selectedPercent * 0.6)} x2="280" y2={80 - (selectedPercent * 0.6)} stroke="#4ade80" strokeDasharray="4 4" strokeWidth="2" />
                      <circle cx="20" cy={80 - (selectedPercent * 0.6)} r="5" fill="#4ade80" />
                      <circle cx="280" cy={80 - (selectedPercent * 0.6)} r="5" fill="#4ade80" />
                    </svg>
                    <div style={{ position: 'absolute', bottom: '4px', left: '10px', fontSize: '0.75rem', opacity: 0.7 }}>Nỗ lực này</div>
                    <div style={{ position: 'absolute', bottom: '4px', right: '10px', fontSize: '0.75rem', opacity: 0.7 }}>Lần thử tiếp theo</div>
                  </div>

                  <div style={{ marginTop: '12px', textAlign: 'center', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px', fontSize: '0.88rem' }}>
                    💡 Điểm quy đổi: <b style={{ color: '#FFE66D', fontSize: '1.1rem' }}>{selectedPercent} điểm</b> ({selectedPercent}% câu đúng)
                  </div>
                </div>

                {/* Direct Number Input Box */}
                <div style={{ marginBottom: '18px', background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1.5px solid #e2e8f0' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: '#1e293b' }}>
                    ✍️ Tự nhập số điểm / % câu đúng trực tiếp:
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input 
                      type="number" 
                      min="0" 
                      max="100" 
                      value={selectedPercent}
                      onChange={e => setSelectedPercent(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                      style={{ 
                        flex: 1, 
                        padding: '12px 16px', 
                        borderRadius: '12px', 
                        border: '2px solid #6366f1', 
                        fontSize: '1.3rem', 
                        fontWeight: 'bold', 
                        textAlign: 'center',
                        color: '#312e81',
                        outline: 'none'
                      }}
                    />
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#475569' }}>Điểm</span>
                  </div>
                </div>

                {/* Preset Buttons */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.85rem', color: '#64748b' }}>
                    Hoặc chọn nhanh các mốc %:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {[
                      { pct: 100, label: '100% (100đ)' },
                      { pct: 90, label: '90% (90đ)' },
                      { pct: 80, label: '80% (80đ)' },
                      { pct: 70, label: '70% (70đ)' },
                      { pct: 60, label: '60% (60đ)' },
                      { pct: 50, label: '50% (50đ)' },
                    ].map(item => (
                      <button
                        key={item.pct}
                        onClick={() => setSelectedPercent(item.pct)}
                        style={{
                          padding: '10px 6px',
                          borderRadius: '12px',
                          border: selectedPercent === item.pct ? '2px solid #6366f1' : '1px solid #e2e8f0',
                          background: selectedPercent === item.pct ? '#e0e7ff' : '#ffffff',
                          color: selectedPercent === item.pct ? '#4338ca' : '#475569',
                          fontWeight: 'bold',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button 
                    onClick={() => handleConfirmScore(selectedPercent)} 
                    className="btn" 
                    style={{ width: '100%', fontSize: '1.05rem', padding: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <CheckCircle2 size={18} /> Lưu & Nhập Điểm ({selectedPercent} Điểm)
                  </button>

                  <button 
                    onClick={() => handleConfirmScore(100)} 
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      background: '#f3e8ff', 
                      color: '#7e22ce', 
                      border: '1px solid #d8b4fe', 
                      borderRadius: '12px', 
                      fontWeight: 'bold', 
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Sparkles size={16} /> 🤖 Nhập nhanh 100% câu đúng (100 điểm)
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* MODAL 2: Direct Manual Score Edit Modal */}
      {ReactDOM.createPortal(
        <AnimatePresence>
          {manualScoreModalTest && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setManualScoreModalTest(null)}
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
                backdropFilter: 'blur(4px)',
                padding: '16px'
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={e => e.stopPropagation()}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  background: 'white',
                  borderRadius: '24px',
                  padding: '28px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  position: 'relative',
                  fontFamily: 'Nunito, sans-serif'
                }}
              >
                <button
                  onClick={() => setManualScoreModalTest(null)}
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

                <h2 style={{ marginBottom: '8px', color: '#2d3436', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PenTool size={22} color="var(--primary)" /> Nhập Điểm Thủ Công
                </h2>
                <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '20px' }}>
                  Nhập số điểm trực tiếp cho bài: <b>{manualScoreModalTest.name}</b>
                </p>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: '#374151' }}>
                    Điểm số (0 - 100 điểm):
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    autoFocus
                    value={manualInputScore}
                    onChange={e => setManualInputScore(e.target.value)}
                    placeholder="VD: 100"
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '14px',
                      border: '2px solid #6366f1',
                      fontSize: '1.4rem',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: '#1e1b4b',
                      outline: 'none'
                    }}
                  />
                </div>

                <button 
                  onClick={handleSaveManualScore} 
                  className="btn" 
                  style={{ width: '100%', fontSize: '1.05rem', padding: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <CheckCircle2 size={18} /> Lưu Điểm Số Ngay
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* MODAL 3: Create New Test */}
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
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
                  Hệ thống hỗ trợ tự nhập điểm thủ công hoặc lấy tự động % câu đúng từ Quizizz.
                </p>

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
