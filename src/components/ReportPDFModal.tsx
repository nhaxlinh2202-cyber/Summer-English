import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Download, FileText, CheckCircle2, Award, Sparkles, BookOpen, GraduationCap, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useAppContext } from '../context/AppContext';
import { translations } from '../translations';

interface ReportPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportPDFModal: React.FC<ReportPDFModalProps> = ({ isOpen, onClose }) => {
  const { state } = useAppContext();
  const lang = state.language || 'vi';
  const t = translations[lang];
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            overflow: 'hidden'
          }}
        >
          {/* Modal Header */}
          <div style={{
            padding: '18px 24px',
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
                disabled={isGenerating}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '8px 18px',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  cursor: isGenerating ? 'wait' : 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
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

          {/* Modal Printable Content Container (A4 Printable Area) */}
          <div style={{ overflowY: 'auto', padding: '24px', flex: 1, background: '#f8fafc' }}>
            <div
              ref={reportRef}
              style={{
                width: '794px',
                margin: '0 auto',
                padding: '40px',
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
                paddingBottom: '20px',
                borderBottom: '3px solid #3b82f6',
                marginBottom: '24px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontWeight: 900, fontSize: '1.4rem' }}>
                    <span>☀️ SUMMER ENGLISH</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
                    Chương Trình Học Tiếng Anh Mùa Hè Dành Cho Bé
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>NGÀY XUẤT BÁO CÁO</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{todayStr}</div>
                </div>
              </div>

              {/* Report Main Title */}
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <h1 style={{
                  fontSize: '1.75rem',
                  fontWeight: 900,
                  color: '#1e3a8a',
                  margin: '0 0 6px 0',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  {t.pdfReportTitle}
                </h1>
                <div style={{ fontSize: '0.9rem', color: '#475569', fontStyle: 'italic' }}>
                  Tổng hợp thành tích, điểm số kiểm tra và tiến độ hoàn thành khóa học
                </div>
              </div>

              {/* Section 1: Student & Teacher Profile */}
              <div style={{
                background: '#f1f5f9',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
                border: '1.5px solid #cbd5e1'
              }}>
                <h3 style={{ margin: '0 0 14px 0', color: '#1e3a8a', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} color="#2563eb" /> {t.pdfStudentInfo}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.92rem' }}>
                  <div><strong>Tên Học Sinh:</strong> <span style={{ color: '#2563eb', fontWeight: 800 }}>{state.profile.studentName || 'Bé Ngoan'}</span></div>
                  <div><strong>Lớp / Tuổi:</strong> {state.profile.studentClass || 'Lớp 3A'}</div>
                  <div><strong>Giáo Viên Hướng Dẫn:</strong> {state.profile.teacherName || 'Cô Giáo'}</div>
                  <div><strong>Ngày Sinh:</strong> {state.profile.birthDate || '01/01/2017'}</div>
                  <div><strong>Linh Vật Yêu Thích:</strong> {state.profile.favoriteMascot || 'Mèo Cam 🍊'}</div>
                  <div><strong>Mục Tiêu Học Tập:</strong> {state.profile.targetGoal || 'Đạt 100 điểm Tiếng Anh'}</div>
                </div>
              </div>

              {/* Section 2: Key Stats Overview */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ margin: '0 0 14px 0', color: '#1e3a8a', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#eab308" /> {t.pdfOverviewStats}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                  
                  <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', padding: '14px', borderRadius: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#991b1b', fontWeight: 'bold' }}>TÍCH LŨY SAO / XP</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#dc2626', marginTop: '4px' }}>{state.stars} ⭐</div>
                  </div>

                  <div style={{ background: '#ecfdf5', border: '1.5px solid #6ee7b7', padding: '14px', borderRadius: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#065f46', fontWeight: 'bold' }}>TIẾN ĐỘ BÀI HỌC</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#059669', marginTop: '4px' }}>{completedCount}/{totalLessons} ({progressPercent}%)</div>
                  </div>

                  <div style={{ background: '#f0f9ff', border: '1.5px solid #7dd3fc', padding: '14px', borderRadius: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#075985', fontWeight: 'bold' }}>CẤP ĐỘ MÈO CAM</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0284c7', marginTop: '4px' }}>Lv. {state.catLevel} 🐱</div>
                  </div>

                  <div style={{ background: '#faf5ff', border: '1.5px solid #d8b4fe', padding: '14px', borderRadius: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#6b21a8', fontWeight: 'bold' }}>ĐIỂM ĐÁNH GIÁ TB</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#9333ea', marginTop: '4px' }}>
                      {avgScore !== null ? `${avgScore}đ` : 'Chưa thi'}
                    </div>
                  </div>

                </div>
              </div>

              {/* Section 3: Test History */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#1e3a8a', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GraduationCap size={18} color="#4f46e5" /> {t.pdfTestHistory}
                </h3>
                {completedTests.length === 0 ? (
                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', fontSize: '0.9rem', color: '#64748b' }}>
                    Chưa có bài kiểm tra nào được hoàn thành.
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: '#e0e7ff', color: '#3730a3', textAlign: 'left' }}>
                        <th style={{ padding: '10px 12px', borderRadius: '8px 0 0 8px' }}>Tên Bài Kiểm Tra</th>
                        <th style={{ padding: '10px 12px' }}>Ngày Làm Bài</th>
                        <th style={{ padding: '10px 12px' }}>Điểm Số</th>
                        <th style={{ padding: '10px 12px', borderRadius: '0 8px 8px 0' }}>Đánh Giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedTests.map((test, idx) => (
                        <tr key={test.id} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                          <td style={{ padding: '10px 12px', fontWeight: 'bold', color: '#1e293b' }}>{test.name}</td>
                          <td style={{ padding: '10px 12px', color: '#64748b' }}>{test.date}</td>
                          <td style={{ padding: '10px 12px', fontWeight: 900, color: test.score >= 90 ? '#059669' : test.score >= 60 ? '#2563eb' : '#dc2626' }}>
                            {test.score} / 100
                          </td>
                          <td style={{ padding: '10px 12px', fontWeight: 'bold' }}>
                            {test.score >= 90 ? '🏆 Xuất sắc' : test.score >= 60 ? '🌟 Đạt yêu cầu' : '⚠️ Cần cố gắng'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Section 4: Lesson Progress Breakdown */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#1e3a8a', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={18} color="#059669" /> {t.pdfLessonProgress}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {state.curriculum.flatMap(w => w.lessons).map((lesson, idx) => {
                    const isDone = state.completedLessons.includes(lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '10px',
                          background: isDone ? '#ecfdf5' : '#f8fafc',
                          border: `1px solid ${isDone ? '#a7f3d0' : '#e2e8f0'}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.82rem'
                        }}
                      >
                        <CheckCircle2 size={16} color={isDone ? '#059669' : '#cbd5e1'} />
                        <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <span style={{ fontWeight: 'bold', color: isDone ? '#065f46' : '#64748b' }}>
                            Buổi {idx + 1}:
                          </span>{' '}
                          <span style={{ color: isDone ? '#047857' : '#94a3b8' }}>{lesson.title}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 5: Badges / Certificates */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#1e3a8a', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} color="#d81b60" /> {t.pdfBadgesSummary} ({state.badges.length})
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {state.badges.map((b) => (
                    <div
                      key={b.id}
                      style={{
                        background: '#fdf2f8',
                        border: '1px solid #fbcfe8',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '0.85rem'
                      }}
                    >
                      <span style={{ fontSize: '1.3rem' }}>🌸</span>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#be185d' }}>{b.description || t.defaultRewardDesc}</div>
                        <div style={{ fontSize: '0.75rem', color: '#9d174d' }}>Ngày trao: {b.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 6: Feedbacks */}
              {state.feedbacks && state.feedbacks.length > 0 && (
                <div style={{ marginBottom: '28px' }}>
                  <h3 style={{ margin: '0 0 12px 0', color: '#1e3a8a', fontSize: '1.05rem', fontWeight: 800 }}>
                    💬 {t.pdfFeedbacks}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {state.feedbacks.slice(0, 3).map(fb => (
                      <div key={fb.id} style={{ background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '10px', padding: '10px 14px', fontSize: '0.85rem' }}>
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
                marginTop: '40px',
                paddingTop: '20px',
                borderTop: '2px dashed #cbd5e1',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                textAlign: 'center',
                fontSize: '0.9rem'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1e293b' }}>{t.pdfParentSign}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>(Ký và ghi rõ họ tên)</div>
                  <div style={{ height: '50px' }}></div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1e293b' }}>{t.pdfTeacherSign}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>(Ký và ghi rõ họ tên)</div>
                  <div style={{ height: '50px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', color: '#2563eb', fontWeight: 800, fontFamily: 'cursive' }}>
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
