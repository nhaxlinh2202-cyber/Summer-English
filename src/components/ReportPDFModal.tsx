import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Download, BookOpen, User, Sparkles, GraduationCap, Award, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useAppContext } from '../context/AppContext';
import { translations } from '../translations';

// Custom SVG Mascot for PDF (Flower shape with student photo)
const BeNgoanFlowerPDF: React.FC<{ size?: number; photoUrl?: string }> = ({ size = 90, photoUrl }) => {
  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <radialGradient id="pdfFlowerCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff9c4" />
            <stop offset="100%" stopColor="#fbc02d" />
          </radialGradient>
        </defs>

        <g>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
            <path
              key={index}
              d="M 50 50 Q 38 18 50 5 Q 62 18 50 50 Z"
              fill={index % 2 === 0 ? '#ff4081' : '#ff80ab'}
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </g>

        <circle cx="50" cy="50" r="27" fill="url(#pdfFlowerCenter)" stroke="#f57c00" strokeWidth="1.5" />
      </svg>

      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: size * 0.44,
        height: size * 0.44,
        borderRadius: '50%',
        overflow: 'hidden',
        border: '2px solid #ffffff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Student Avatar"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ fontSize: `${size * 0.22}px` }}>🐱</span>
        )}
      </div>
    </div>
  );
};

interface ReportPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportPDFModal: React.FC<ReportPDFModalProps> = ({ isOpen, onClose }) => {
  const { state } = useAppContext();
  const allLessons = state.curriculum.flatMap(w => w.lessons);
  const reportRef = React.useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLessonIds, setSelectedLessonIds] = useState<number[]>([1, 2]);

  if (!isOpen) return null;

  const t = translations[state.language || 'vi'];
  const completedCount = state.completedLessons.length;
  const totalLessons = allLessons.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const completedTests = state.tests.filter(t => t.status === 'completed');
  const avgScore = completedTests.length > 0
    ? Math.round(completedTests.reduce((acc, curr) => acc + curr.score, 0) / completedTests.length)
    : null;

  const todayStr = new Date().toLocaleDateString(state.language === 'en' ? 'en-US' : 'vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Publication-grade Page-Break & Canvas Rendering Algorithm
  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);
    try {
      const element = reportRef.current;

      // Render entire element to high resolution canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

      const domWidth = element.offsetWidth;
      const scale = canvas.width / domWidth;
      const pageCanvasHeight = (canvas.width * pdfHeight) / pdfWidth;

      // Helper function to calculate exact vertical offset of an element relative to the root printable container
      const getRelativeOffsetTop = (node: HTMLElement, container: HTMLElement): number => {
        const nodeRect = node.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        return nodeRect.top - containerRect.top;
      };

      // Find all indivisible atomic items (cards, lesson items, table rows)
      const breakableNodes = Array.from(
        element.querySelectorAll('.pdf-card, .pdf-item, tr')
      ) as HTMLElement[];

      const elementRects = breakableNodes.map(node => {
        const topPx = getRelativeOffsetTop(node, element);
        const elemTop = topPx * scale;
        const elemBottom = (topPx + node.offsetHeight) * scale;
        return { top: elemTop, bottom: elemBottom };
      }).filter(r => r.bottom > r.top).sort((a, b) => a.top - b.top);

      // Find heading positions to prevent orphan section headers at bottom of page
      const headingNodes = Array.from(element.querySelectorAll('h3, h2, h1')) as HTMLElement[];
      const headingRects = headingNodes.map(node => {
        const topPx = getRelativeOffsetTop(node, element);
        const elemTop = topPx * scale;
        const elemBottom = (topPx + node.offsetHeight) * scale;
        return { top: elemTop, bottom: elemBottom };
      });

      // Compute smart page break positions in canvas pixels
      const pageBreaks: number[] = [0];
      let currentY = 0;

      while (currentY < canvas.height - 10) {
        let nextBreak = currentY + pageCanvasHeight;

        if (nextBreak >= canvas.height) {
          pageBreaks.push(canvas.height);
          break;
        }

        // Check if nextBreak cuts through any indivisible atomic item (.pdf-card, .pdf-item, tr)
        const straddling = elementRects.find(r => r.top < nextBreak && r.bottom > nextBreak);
        if (straddling && straddling.top > currentY + 100) {
          // Break cleanly in the margin gap 12px BEFORE the card's top edge
          nextBreak = Math.max(currentY + 100, straddling.top - 12);
        }

        // Orphan heading protection: If heading is within 100px before page break, move break 10px above heading
        const orphanHeading = headingRects.find(h => h.top < nextBreak && h.top > nextBreak - 100 && h.top > currentY + 100);
        if (orphanHeading) {
          nextBreak = Math.max(currentY + 100, orphanHeading.top - 10);
        }

        pageBreaks.push(nextBreak);
        currentY = nextBreak;
      }

      // Render each page slice onto PDF without slicing elements
      for (let i = 0; i < pageBreaks.length - 1; i++) {
        const sliceTop = pageBreaks[i];
        const sliceHeight = pageBreaks[i + 1] - sliceTop;

        if (sliceHeight <= 0) continue;

        if (i > 0) {
          pdf.addPage();
        }

        // Create temporary canvas for this page slice
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;

        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(
            canvas,
            0, sliceTop, canvas.width, sliceHeight,
            0, 0, canvas.width, sliceHeight
          );

          const imgData = pageCanvas.toDataURL('image/png');
          const sliceMmHeight = (sliceHeight * pdfWidth) / canvas.width;
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, Math.min(sliceMmHeight, pdfHeight));
        }
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
          background: 'rgba(0, 0, 0, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(5px)'
        }}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '94%',
            maxWidth: '920px',
            maxHeight: '92vh',
            background: '#ffffff',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            position: 'relative'
          }}
        >
          {/* Modal Toolbar Header */}
          <div style={{
            padding: '18px 24px',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📄 {t.pdfReportTitle}
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', opacity: 0.9 }}>
                Xem trước báo cáo A4 và tùy chọn xuất file PDF chính thức
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                style={{
                  background: '#f59e0b',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                {isGenerating ? (
                  <span>⏳ Đang Tạo PDF...</span>
                ) : (
                  <>
                    <Download size={18} /> {t.exportPdfBtn}
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Lesson Selector Bar */}
          <div style={{ padding: '12px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} color="#2563eb" /> Chọn Các Buổi Học Xuất Vào Báo Cáo:
            </span>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
              {allLessons.map((lesson, idx) => {
                const isSelected = selectedLessonIds.includes(lesson.id);
                const isCompleted = state.completedLessons.includes(lesson.id);
                return (
                  <label
                    key={lesson.id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '5px 10px',
                      borderRadius: '8px',
                      border: `1.5px solid ${isSelected ? '#2563eb' : '#cbd5e1'}`,
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      color: isSelected ? '#1d4ed8' : '#64748b',
                      fontSize: '0.8rem',
                      fontWeight: isSelected ? 'bold' : 'normal',
                      cursor: 'pointer',
                      userSelect: 'none'
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
                position: 'relative',
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
                paddingBottom: '14px',
                borderBottom: '3px solid #2563eb',
                marginBottom: '18px'
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
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold' }}>NGÀY XUẤT BÁO CÁO</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{todayStr}</div>
                </div>
              </div>

              {/* Report Main Title */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1 style={{
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  color: '#1e3a8a',
                  margin: '0 0 4px 0',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  {t.pdfReportTitle}
                </h1>
                <div style={{ fontSize: '0.82rem', color: '#475569', fontStyle: 'italic' }}>
                  Tổng hợp thành tích học tập, kết quả kiểm tra và hoạt động thực hành
                </div>
              </div>

              {/* Section 1: Student & Teacher Profile (Atomic Card) */}
              <div className="pdf-item" style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '14px 18px',
                marginBottom: '18px',
                border: '1.5px solid #cbd5e1'
              }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={16} color="#2563eb" /> {t.pdfStudentInfo}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.85rem' }}>
                  <div><strong>Tên Học Sinh:</strong> <span style={{ color: '#2563eb', fontWeight: 800 }}>{state.profile.studentName || 'Bé Ngoan'}</span></div>
                  <div><strong>Lớp / Tuổi:</strong> {state.profile.studentClass || 'Lớp 3A'}</div>
                  <div><strong>Giáo Viên Hướng Dẫn:</strong> {state.profile.teacherName || 'Cô Giáo'}</div>
                  <div><strong>Ngày Sinh:</strong> {state.profile.birthDate || '01/01/2017'}</div>
                  <div><strong>Linh Vật Yêu Thích:</strong> {state.profile.favoriteMascot || 'Mèo Cam 🍊'}</div>
                  <div><strong>Mục Tiêu Học Tập:</strong> {state.profile.targetGoal || 'Đạt 100 điểm Tiếng Anh'}</div>
                </div>
              </div>

              {/* Section 2: Key Stats Overview (Atomic Card) */}
              <div className="pdf-item" style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} color="#eab308" /> {t.pdfOverviewStats}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  
                  <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', padding: '10px 8px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: '#991b1b', fontWeight: 'bold' }}>TÍCH LŨY SAO / XP</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#dc2626', marginTop: '2px' }}>{state.stars} ⭐</div>
                  </div>

                  <div style={{ background: '#ecfdf5', border: '1.5px solid #6ee7b7', padding: '10px 8px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: '#065f46', fontWeight: 'bold' }}>TIẾN ĐỘ BÀI HỌC</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#059669', marginTop: '2px' }}>{completedCount}/{totalLessons} ({progressPercent}%)</div>
                  </div>

                  <div style={{ background: '#f0f9ff', border: '1.5px solid #7dd3fc', padding: '10px 8px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: '#075985', fontWeight: 'bold' }}>CẤP ĐỘ MÈO CAM</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0284c7', marginTop: '2px' }}>Lv. {state.catLevel} 🐱</div>
                  </div>

                  <div style={{ background: '#faf5ff', border: '1.5px solid #d8b4fe', padding: '10px 8px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: '#6b21a8', fontWeight: 'bold' }}>ĐIỂM ĐÁNH GIÁ TB</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#9333ea', marginTop: '2px' }}>
                      {avgScore !== null ? `${avgScore}đ` : 'Chưa thi'}
                    </div>
                  </div>

                </div>
              </div>

              {/* Section 3: Test History Table */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#1e3a8a', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GraduationCap size={16} color="#4f46e5" /> {t.pdfTestHistory}
                </h3>
                {completedTests.length === 0 ? (
                  <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.82rem', color: '#64748b' }}>
                    Chưa có bài kiểm tra nào được hoàn thành.
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ background: '#4f46e5', color: '#ffffff', textAlign: 'left' }}>
                        <th style={{ padding: '7px 10px', borderRadius: '6px 0 0 6px' }}>Tên Bài Kiểm Tra</th>
                        <th style={{ padding: '7px 10px' }}>Ngày Làm Bài</th>
                        <th style={{ padding: '7px 10px' }}>Điểm Số / Tỷ Lệ Đúng</th>
                        <th style={{ padding: '7px 10px', borderRadius: '0 6px 6px 0' }}>Đánh Giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedTests.map((test, idx) => (
                        <tr key={test.id} className="pdf-item" style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                          <td style={{ padding: '7px 10px', fontWeight: 'bold', color: '#1e293b' }}>{test.name}</td>
                          <td style={{ padding: '7px 10px', color: '#64748b' }}>{test.date}</td>
                          <td style={{ padding: '7px 10px', fontWeight: 900, color: test.score >= 90 ? '#059669' : test.score >= 60 ? '#2563eb' : '#dc2626' }}>
                            {test.score}/100đ ({test.accuracyPercent ?? test.score}% câu đúng)
                          </td>
                          <td style={{ padding: '7px 10px', fontWeight: 'bold' }}>
                            {test.score >= 90 ? '🏆 Xuất sắc' : test.score >= 60 ? '🌟 Đạt yêu cầu' : '⚠️ Cần cố gắng'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Section 4: Compact Executive Lesson Activity Table */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#1e3a8a', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={16} color="#059669" /> Bảng Chi Tiết Hoạt Động Báo Cáo ({lessonsToExport.length} Buổi Được Chọn)
                </h3>
                
                {lessonsToExport.length === 0 ? (
                  <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '0.85rem', color: '#991b1b', textAlign: 'center', fontWeight: 'bold' }}>
                    ⚠️ Chưa chọn buổi học nào để xuất báo cáo. Vui lòng tích chọn các buổi học ở khung bên trên.
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ background: '#059669', color: '#ffffff', textAlign: 'left' }}>
                        <th style={{ padding: '8px 10px', width: '24%', borderRadius: '6px 0 0 6px' }}>Buổi Học & Trạng Thái</th>
                        <th style={{ padding: '8px 10px', width: '48%' }}>4 Chặng Hoạt Động Chi Tiết</th>
                        <th style={{ padding: '8px 10px', width: '28%', borderRadius: '0 6px 6px 0' }}>Từ Vựng Trong Bài</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lessonsToExport.map((lesson, idx) => {
                        const lessonOriginalIdx = allLessons.findIndex(l => l.id === lesson.id);
                        const isLessonDone = state.completedLessons.includes(lesson.id);
                        const doneStages = state.completedStages[lesson.id] || (isLessonDone ? [0, 1, 2, 3] : []);
                        const staticWords = lesson.words || [];
                        const customWordsForLesson = state.customWords.filter(w => w.lessonId === lesson.id);
                        const allLessonWords = [...staticWords, ...customWordsForLesson];

                        return (
                          <tr 
                            key={lesson.id} 
                            className="pdf-item" 
                            style={{ 
                              borderBottom: '1.5px solid #cbd5e1', 
                              background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' 
                            }}
                          >
                            {/* Col 1: Lesson Header */}
                            <td style={{ padding: '10px 8px', verticalAlign: 'top' }}>
                              <div style={{ fontWeight: 800, color: '#065f46', fontSize: '0.88rem' }}>
                                Buổi {lessonOriginalIdx + 1}:
                              </div>
                              <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.82rem', marginTop: '2px', lineHeight: 1.25 }}>
                                {lesson.title.includes(':') ? lesson.title.split(':')[1] : lesson.title}
                              </div>
                              <div style={{ marginTop: '6px' }}>
                                <span style={{
                                  background: isLessonDone ? '#d1fae5' : '#e0f2fe',
                                  color: isLessonDone ? '#047857' : '#0369a1',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.72rem',
                                  fontWeight: 'bold',
                                  display: 'inline-block'
                                }}>
                                  {isLessonDone ? '✓ Hoàn thành' : 'Đang học'} ({doneStages.length}/4)
                                </span>
                              </div>
                            </td>

                            {/* Col 2: 4 Stages Breakdown */}
                            <td style={{ padding: '10px 8px', verticalAlign: 'top' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px 8px', fontSize: '0.75rem' }}>
                                {lesson.stages.map((stage, stageIdx) => {
                                  const isStageDone = isLessonDone || doneStages.includes(stageIdx);
                                  return (
                                    <div key={stageIdx} style={{ lineHeight: 1.25, color: isStageDone ? '#065f46' : '#475569' }}>
                                      <span style={{ color: isStageDone ? '#059669' : '#cbd5e1', fontWeight: 'bold' }}>
                                        {isStageDone ? '☑' : '▫'}
                                      </span>{' '}
                                      <strong style={{ color: isStageDone ? '#0f766e' : '#334155' }}>{stage.name.split('(')[0]}:</strong>{' '}
                                      <span style={{ color: '#475569' }}>{stage.desc}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </td>

                            {/* Col 3: Vocabulary Words Tags */}
                            <td style={{ padding: '10px 8px', verticalAlign: 'top' }}>
                              {allLessonWords.length === 0 ? (
                                <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontStyle: 'italic' }}>Chưa có từ vựng</span>
                              ) : (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 4px' }}>
                                  {allLessonWords.map((w, wIdx) => (
                                    <span 
                                      key={wIdx} 
                                      style={{ 
                                        background: '#eff6ff', 
                                        border: '1px solid #bfdbfe', 
                                        padding: '1px 5px', 
                                        borderRadius: '4px', 
                                        fontSize: '0.72rem', 
                                        color: '#1d4ed8',
                                        display: 'inline-block'
                                      }}
                                    >
                                      <b>{w.en}</b> <span style={{ color: '#475569' }}>({w.vi})</span>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Section 5: Badges / Visual Certificates Cards */}
              <div className="pdf-item" style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={16} color="#d81b60" /> {t.pdfBadgesSummary} ({state.badges.length} Phiếu)
                </h3>

                {state.badges.length === 0 ? (
                  <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.82rem', color: '#64748b' }}>
                    Chưa có phiếu bé ngoan nào được trao.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'flex-start' }}>
                    {state.badges.map((badge) => (
                      <div
                        key={badge.id}
                        className="pdf-card"
                        style={{
                          width: '155px',
                          minHeight: '235px',
                          backgroundColor: '#ffffff',
                          background: '#ffffff',
                          borderRadius: '12px',
                          padding: '14px 8px 8px 8px',
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
                        {/* Red Push Pin (Positioned safely inside card boundary) */}
                        <div style={{
                          position: 'absolute',
                          top: '4px',
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
                          margin: '6px 0 0 0', 
                          color: '#c2185b', 
                          fontSize: '0.8rem', 
                          fontWeight: 900,
                          letterSpacing: '0.2px',
                          textTransform: 'uppercase'
                        }}>
                          {t.badgeCardTitle}
                        </h4>

                        {/* Student Photo Flower Mascot */}
                        <div style={{ margin: '2px 0' }}>
                          <BeNgoanFlowerPDF size={76} photoUrl={badge.photoUrl || '/student_photo.png'} />
                        </div>

                        {/* Student Name */}
                        <div style={{ 
                          color: '#c2185b', 
                          fontSize: '1rem', 
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
                          fontSize: '0.68rem',
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
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#1e3a8a', fontSize: '0.95rem', fontWeight: 800 }}>
                    💬 {t.pdfFeedbacks}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {state.feedbacks.slice(0, 3).map(fb => (
                      <div key={fb.id} className="pdf-item" style={{ background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '8px', padding: '7px 12px', fontSize: '0.8rem' }}>
                        <span style={{ marginRight: '8px' }}>{fb.emoji}</span>
                        <strong>{fb.lessonTitle}:</strong> {fb.note}
                        <span style={{ float: 'right', color: '#8c8c8c', fontSize: '0.72rem' }}>{fb.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 7: Official Sign-off Footer */}
              <div className="pdf-item" style={{
                marginTop: '28px',
                paddingTop: '14px',
                borderTop: '2px dashed #cbd5e1',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                textAlign: 'center',
                fontSize: '0.85rem'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1e293b' }}>{t.pdfParentSign}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>(Ký và ghi rõ họ tên)</div>
                  <div style={{ height: '40px' }}></div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1e293b' }}>{t.pdfTeacherSign}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>(Ký và ghi rõ họ tên)</div>
                  <div style={{ height: '40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', color: '#2563eb', fontWeight: 800, fontFamily: 'cursive' }}>
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
