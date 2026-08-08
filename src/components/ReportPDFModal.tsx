import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Download, FileText, CheckCircle2, Award, Sparkles, BookOpen, GraduationCap, User, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useAppContext } from '../context/AppContext';
import { translations } from '../translations';

interface ReportPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Vector Flower Mascot Component for PDF Export Cards
const BeNgoanFlowerPDF: React.FC<{ size?: number; photoUrl?: string }> = ({ size = 85, photoUrl = '/student_photo.png' }) => {
  const petals = [
    { angle: 0, color: '#e91e63' },
    { angle: 45, color: '#fdd835' },
    { angle: 90, color: '#1976d2' },
    { angle: 135, color: '#c2185b' },
    { angle: 180, color: '#fdd835' },
    { angle: 225, color: '#388e3c' },
    { angle: 270, color: '#1976d2' },
    { angle: 315, color: '#e91e63' },
  ];

  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="pdfFlowerFaceClip">
          <circle cx="100" cy="90" r="35" />
        </clipPath>
      </defs>
      <path d="M 100 122 L 100 195" stroke="#2e7d32" strokeWidth="8" strokeLinecap="round" />
      <path d="M 100 160 C 65 150 45 135 40 145 C 50 165 80 165 100 165 Z" fill="#43a047" stroke="#1b5e20" strokeWidth="2" />
      <path d="M 100 170 C 135 160 155 145 160 155 C 150 175 120 175 100 175 Z" fill="#43a047" stroke="#1b5e20" strokeWidth="2" />
      <g>
        {petals.map((p, idx) => (
          <g key={idx} transform={`translate(100, 90) rotate(${p.angle})`}>
            <ellipse cx="0" cy="-42" rx="18" ry="26" fill={p.color} stroke="#222222" strokeWidth="2.5" />
          </g>
        ))}
      </g>
      <circle cx="100" cy="90" r="35" fill="#ffffff" stroke="#222222" strokeWidth="3" />
      <image href={photoUrl} x="58" y="44" width="84" height="84" preserveAspectRatio="xMidYMid slice" clipPath="url(#pdfFlowerFaceClip)" />
      <circle cx="100" cy="90" r="35" fill="none" stroke="#222222" strokeWidth="3" />
    </svg>
  );
};

const ReportPDFModal: React.FC<ReportPDFModalProps> = ({ isOpen, onClose }) => {
  const { state } = useAppContext();
  const lang = state.language || 'vi';
  const t = translations[lang];
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const allLessons = state.curriculum.flatMap(w => w.lessons);

  // Lesson Selection State: By default, ONLY select lessons that are completed or have progress
  const [selectedLessonIds, setSelectedLessonIds] = useState<number[]>(() => {
    return state.completedLessons.length > 0 ? state.completedLessons : [1];
  });

  useEffect(() => {
    if (isOpen) {
      if (state.completedLessons.length > 0) {
        setSelectedLessonIds(state.completedLessons);
      } else {
        const lessonsWithProgress = allLessons.filter(l => (state.completedStages[l.id]?.length || 0) > 0).map(l => l.id);
        setSelectedLessonIds(lessonsWithProgress.length > 0 ? lessonsWithProgress : [allLessons[0].id]);
      }
    }
  }, [isOpen, state.completedLessons]);

  if (!isOpen) return null;

  const totalLessons = 12;
  const completedCount = state.completedLessons.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const completedTests = state.tests.filter(t => t.status === 'completed');
  const avgScore = completedTests.length > 0
    ? Math.round(completedTests.reduce((acc, curr) => acc + curr.score, 0) / completedTests.length)
    : null;

  const todayStr = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`Bang_Tong_Ket_Hoc_Tap_${state.profile.studentName || 'Student'}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Không thể tải PDF. Vui lòng thử lại!');
    } finally {
      setIsGenerating(false);
    }
  };

  const lessonsToExport = allLessons.filter(l => selectedLessonIds.includes(l.id));

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          backdropFilter: 'blur(6px)',
          padding: '20px'
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: 'white',
            borderRadius: '24px',
            maxWidth: '920px',
            width: '100%',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            overflow: 'hidden'
          }}
        >
          {/* Modal Top Header */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={24} />
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                {t.pdfReportTitle}
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadPDF}
                disabled={isGenerating || selectedLessonIds.length === 0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: selectedLessonIds.length === 0 ? '#94a3b8' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '8px 18px',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  cursor: isGenerating ? 'wait' : selectedLessonIds.length === 0 ? 'not-allowed' : 'pointer',
                  boxShadow: selectedLessonIds.length === 0 ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
              >
                <Download size={18} />
                <span>{isGenerating ? t.exportingPdfBtn : t.exportPdfBtn}</span>
              </motion.button>

              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Lesson Selector Panel (Outside Printable Area) */}
          <div style={{
            background: '#f8fafc',
            padding: '14px 24px',
            borderBottom: '2px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={18} color="#2563eb" />
                <span>📌 Tùy Chọn Buổi Học Để Xuất File PDF Báo Cáo ({selectedLessonIds.length}/12 Buổi):</span>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setSelectedLessonIds(state.completedLessons.length > 0 ? state.completedLessons : [])}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #10b981',
                    background: '#ecfdf5',
                    color: '#047857',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  ✓ Chỉ chọn buổi đã học ({state.completedLessons.length})
                </button>
                
                <button
                  type="button"
                  onClick={() => setSelectedLessonIds(allLessons.map(l => l.id))}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #3b82f6',
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Chọn tất cả (12)
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedLessonIds([])}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #fca5a5',
                    background: '#fef2f2',
                    color: '#dc2626',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Bỏ chọn tất cả
                </button>
              </div>
            </div>

            {/* Lesson Checkbox Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
              {allLessons.map((lesson, idx) => {
                const isSelected = selectedLessonIds.includes(lesson.id);
                const isCompleted = state.completedLessons.includes(lesson.id);

                return (
                  <label
                    key={lesson.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '5px 10px',
                      borderRadius: '10px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      border: `1.5px solid ${isSelected ? (isCompleted ? '#10b981' : '#3b82f6') : '#cbd5e1'}`,
                      background: isSelected ? (isCompleted ? '#d1fae5' : '#e0f2fe') : '#ffffff',
                      color: isSelected ? (isCompleted ? '#047857' : '#0369a1') : '#64748b',
                      userSelect: 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLessonIds([...selectedLessonIds, lesson.id]);
                        } else {
                          setSelectedLessonIds(selectedLessonIds.filter(id => id !== lesson.id));
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>Buổi {idx + 1} {isCompleted ? '✓' : ''}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Modal Printable Content Container (A4 Printable Area) */}
          <div style={{ overflowY: 'auto', padding: '24px', flex: 1, background: '#e2e8f0' }}>
            <div
              ref={reportRef}
              style={{
                width: '794px',
                margin: '0 auto',
                padding: '36px',
                background: '#ffffff',
                color: '#1e293b',
                fontFamily: '"Nunito", "Be Vietnam Pro", system-ui, sans-serif',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                boxSizing: 'border-box',
                borderRadius: '8px'
              }}
            >
              {/* Document Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '16px',
                borderBottom: '3px solid #3b82f6',
                marginBottom: '20px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontWeight: 900, fontSize: '1.35rem' }}>
                    <span>☀️ SUMMER ENGLISH</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                    Chương Trình Học Tiếng Anh Mùa Hè Dành Cho Bé
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 'bold' }}>NGÀY XUẤT BÁO CÁO</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{todayStr}</div>
                </div>
              </div>

              {/* Report Main Title */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h1 style={{
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  color: '#1e3a8a',
                  margin: '0 0 4px 0',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  {t.pdfReportTitle}
                </h1>
                <div style={{ fontSize: '0.85rem', color: '#475569', fontStyle: 'italic' }}>
                  Tổng hợp thành tích, chi tiết hoạt động học tập và ảnh phiếu bé ngoan
                </div>
              </div>

              {/* Section 1: Student & Teacher Profile */}
              <div style={{
                background: '#f1f5f9',
                borderRadius: '14px',
                padding: '16px 20px',
                marginBottom: '20px',
                border: '1.5px solid #cbd5e1'
              }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={17} color="#2563eb" /> {t.pdfStudentInfo}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.88rem' }}>
                  <div><strong>Tên Học Sinh:</strong> <span style={{ color: '#2563eb', fontWeight: 800 }}>{state.profile.studentName || 'Bé Ngoan'}</span></div>
                  <div><strong>Lớp / Tuổi:</strong> {state.profile.studentClass || 'Lớp 3A'}</div>
                  <div><strong>Giáo Viên Hướng Dẫn:</strong> {state.profile.teacherName || 'Cô Giáo'}</div>
                  <div><strong>Ngày Sinh:</strong> {state.profile.birthDate || '01/01/2017'}</div>
                  <div><strong>Linh Vật Yêu Thích:</strong> {state.profile.favoriteMascot || 'Mèo Cam 🍊'}</div>
                  <div><strong>Mục Tiêu Học Tập:</strong> {state.profile.targetGoal || 'Đạt 100 điểm Tiếng Anh'}</div>
                </div>
              </div>

              {/* Section 2: Key Stats Overview */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={17} color="#eab308" /> {t.pdfOverviewStats}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  
                  <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#991b1b', fontWeight: 'bold' }}>TÍCH LŨY SAO / XP</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#dc2626', marginTop: '2px' }}>{state.stars} ⭐</div>
                  </div>

                  <div style={{ background: '#ecfdf5', border: '1.5px solid #6ee7b7', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: 'bold' }}>TIẾN ĐỘ BÀI HỌC</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669', marginTop: '2px' }}>{completedCount}/{totalLessons} ({progressPercent}%)</div>
                  </div>

                  <div style={{ background: '#f0f9ff', border: '1.5px solid #7dd3fc', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#075985', fontWeight: 'bold' }}>CẤP ĐỘ MÈO CAM</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0284c7', marginTop: '2px' }}>Lv. {state.catLevel} 🐱</div>
                  </div>

                  <div style={{ background: '#faf5ff', border: '1.5px solid #d8b4fe', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6b21a8', fontWeight: 'bold' }}>ĐIỂM ĐÁNH GIÁ TB</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#9333ea', marginTop: '2px' }}>
                      {avgScore !== null ? `${avgScore}đ` : 'Chưa thi'}
                    </div>
                  </div>

                </div>
              </div>

              {/* Section 3: Test History */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GraduationCap size={17} color="#4f46e5" /> {t.pdfTestHistory}
                </h3>
                {completedTests.length === 0 ? (
                  <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.85rem', color: '#64748b' }}>
                    Chưa có bài kiểm tra nào được hoàn thành.
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: '#e0e7ff', color: '#3730a3', textAlign: 'left' }}>
                        <th style={{ padding: '8px 10px', borderRadius: '6px 0 0 6px' }}>Tên Bài Kiểm Tra</th>
                        <th style={{ padding: '8px 10px' }}>Ngày Làm Bài</th>
                        <th style={{ padding: '8px 10px' }}>Điểm Số</th>
                        <th style={{ padding: '8px 10px', borderRadius: '0 6px 6px 0' }}>Đánh Giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedTests.map((test, idx) => (
                        <tr key={test.id} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                          <td style={{ padding: '8px 10px', fontWeight: 'bold', color: '#1e293b' }}>{test.name}</td>
                          <td style={{ padding: '8px 10px', color: '#64748b' }}>{test.date}</td>
                          <td style={{ padding: '8px 10px', fontWeight: 900, color: test.score >= 90 ? '#059669' : test.score >= 60 ? '#2563eb' : '#dc2626' }}>
                            {test.score} / 100
                          </td>
                          <td style={{ padding: '8px 10px', fontWeight: 'bold' }}>
                            {test.score >= 90 ? '🏆 Xuất sắc' : test.score >= 60 ? '🌟 Đạt yêu cầu' : '⚠️ Cần cố gắng'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Section 4: Detailed Lesson & Activities Breakdown (Selected Lessons ONLY) */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={17} color="#059669" /> Chi Tiết Hoạt Động Báo Cáo ({lessonsToExport.length} Buổi Được Chọn)
                </h3>
                
                {lessonsToExport.length === 0 ? (
                  <div style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', fontSize: '0.88rem', color: '#991b1b', textAlign: 'center', fontWeight: 'bold' }}>
                    ⚠️ Chưa chọn buổi học nào để xuất báo cáo. Vui lòng tích chọn các buổi học ở khung bên trên.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {lessonsToExport.map((lesson) => {
                      const idx = allLessons.findIndex(l => l.id === lesson.id);
                      const isLessonDone = state.completedLessons.includes(lesson.id);
                      const doneStages = state.completedStages[lesson.id] || (isLessonDone ? [0, 1, 2, 3] : []);
                      const staticWords = lesson.words || [];
                      const customWordsForLesson = state.customWords.filter(w => w.lessonId === lesson.id);
                      const allLessonWords = [...staticWords, ...customWordsForLesson];

                      return (
                        <div
                          key={lesson.id}
                          style={{
                            background: isLessonDone ? '#ecfdf5' : '#f0f9ff',
                            border: `1.5px solid ${isLessonDone ? '#a7f3d0' : '#bae6fd'}`,
                            borderRadius: '12px',
                            padding: '12px 14px',
                            fontSize: '0.82rem'
                          }}
                        >
                          {/* Lesson Header Line */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <CheckCircle2 size={18} color={isLessonDone ? '#059669' : '#0284c7'} />
                              <span style={{ fontWeight: 800, fontSize: '0.92rem', color: isLessonDone ? '#065f46' : '#0369a1' }}>
                                Buổi {idx + 1}: {lesson.title}
                              </span>
                            </div>
                            <span style={{
                              padding: '3px 10px',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                              background: isLessonDone ? '#d1fae5' : '#e0f2fe',
                              color: isLessonDone ? '#047857' : '#0369a1'
                            }}>
                              {isLessonDone ? `✓ Hoàn thành (${doneStages.length}/${lesson.stages.length} chặng)` : `Đang học (${doneStages.length}/${lesson.stages.length} chặng)`}
                            </span>
                          </div>

                          {/* Stages Breakdown */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginTop: '6px', background: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            {lesson.stages.map((stage, stageIdx) => {
                              const isStageDone = isLessonDone || doneStages.includes(stageIdx);
                              return (
                                <div key={stageIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: isStageDone ? '#0f766e' : '#64748b' }}>
                                  <span style={{ color: isStageDone ? '#059669' : '#cbd5e1', fontWeight: 'bold' }}>
                                    {isStageDone ? '☑' : '▫'}
                                  </span>
                                  <div>
                                    <strong style={{ color: isStageDone ? '#0f766e' : '#475569' }}>{stage.name}:</strong> {stage.desc}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Vocabulary Words (Uniform Styling) */}
                          {allLessonWords.length > 0 && (
                            <div style={{ marginTop: '6px', fontSize: '0.78rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <strong style={{ color: '#2563eb' }}>🔤 Từ vựng ({allLessonWords.length}):</strong>
                              {allLessonWords.map((w, wIdx) => (
                                <span 
                                  key={wIdx} 
                                  style={{ 
                                    background: '#eff6ff', 
                                    border: '1px solid #bfdbfe', 
                                    padding: '1px 6px', 
                                    borderRadius: '6px', 
                                    color: '#1d4ed8'
                                  }}
                                >
                                  <strong>{w.en}</strong> ({w.vi})
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Section 5: Badges / Visual Certificates Cards */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#1e3a8a', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={17} color="#d81b60" /> {t.pdfBadgesSummary} ({state.badges.length} Phiếu)
                </h3>

                {state.badges.length === 0 ? (
                  <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.85rem', color: '#64748b' }}>
                    Chưa có phiếu bé ngoan nào được trao.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'flex-start' }}>
                    {state.badges.map((badge) => (
                      <div
                        key={badge.id}
                        style={{
                          width: '160px',
                          minHeight: '235px',
                          backgroundColor: '#ffffff',
                          background: '#ffffff',
                          borderRadius: '12px',
                          padding: '10px 8px 8px 8px',
                          textAlign: 'center',
                          position: 'relative',
                          border: '2px solid #d81b60',
                          outline: '1.5px solid #ffffff',
                          outlineOffset: '-5px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          boxSizing: 'border-box'
                        }}
                      >
                        {/* Red Push Pin */}
                        <div style={{
                          position: 'absolute',
                          top: '-8px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: 'radial-gradient(circle at 35% 35%, #ff5252 0%, #b71c1c 100%)',
                          border: '1px solid #ffffff',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          zIndex: 6
                        }} />

                        {/* Title */}
                        <h4 style={{ 
                          margin: '2px 0 0 0', 
                          color: '#c2185b', 
                          fontSize: '0.82rem', 
                          fontWeight: 900,
                          letterSpacing: '0.2px',
                          textTransform: 'uppercase'
                        }}>
                          {t.badgeCardTitle}
                        </h4>

                        {/* Student Photo Flower Mascot */}
                        <div style={{ margin: '2px 0' }}>
                          <BeNgoanFlowerPDF size={80} photoUrl={badge.photoUrl || '/student_photo.png'} />
                        </div>

                        {/* Student Name */}
                        <div style={{ 
                          color: '#c2185b', 
                          fontSize: '1.05rem', 
                          fontWeight: 'bold',
                          fontFamily: '"Dancing Script", "Be Vietnam Pro", cursive, sans-serif',
                          margin: '0 0 2px 0',
                          lineHeight: 1.1
                        }}>
                          {state.profile.studentName || 'Bé Ngoan'}
                        </div>

                        {/* Note Line */}
                        <div style={{
                          border: '1px solid #d81b60',
                          borderRadius: '4px',
                          padding: '3px 4px',
                          background: '#ffffff',
                          color: '#111827',
                          fontWeight: 800,
                          fontSize: '0.7rem',
                          textAlign: 'center',
                          lineHeight: 1.15,
                          width: '92%'
                        }}>
                          {badge.description || t.defaultRewardDesc}
                        </div>

                        {/* Date */}
                        <div style={{ fontSize: '0.65rem', color: '#888', marginTop: '3px' }}>
                          {badge.date}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 6: Feedbacks */}
              {state.feedbacks && state.feedbacks.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a', fontSize: '1rem', fontWeight: 800 }}>
                    💬 {t.pdfFeedbacks}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {state.feedbacks.slice(0, 3).map(fb => (
                      <div key={fb.id} style={{ background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '10px', padding: '8px 12px', fontSize: '0.82rem' }}>
                        <span style={{ marginRight: '8px' }}>{fb.emoji}</span>
                        <strong>{fb.lessonTitle}:</strong> {fb.note}
                        <span style={{ float: 'right', color: '#8c8c8c', fontSize: '0.75rem' }}>{fb.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 7: Official Sign-off Footer */}
              <div style={{
                marginTop: '36px',
                paddingTop: '16px',
                borderTop: '2px dashed #cbd5e1',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                textAlign: 'center',
                fontSize: '0.88rem'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1e293b' }}>{t.pdfParentSign}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>(Ký và ghi rõ họ tên)</div>
                  <div style={{ height: '45px' }}></div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1e293b' }}>{t.pdfTeacherSign}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>(Ký và ghi rõ họ tên)</div>
                  <div style={{ height: '45px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', color: '#2563eb', fontWeight: 800, fontFamily: 'cursive' }}>
                    {state.profile.teacherName || 'Cô Giáo'}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default ReportPDFModal;
