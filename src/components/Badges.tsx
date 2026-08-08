import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Plus, X, Trash2, Edit3, Check, Award, Sparkles, Camera, Upload, Download, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { useAppContext } from '../context/AppContext';
import { translations } from '../translations';
import ReportPDFModal from './ReportPDFModal';

// Vector Flower Mascot Component with Student Photo centered in 8 Large Vivid Petals
const BeNgoanFlower: React.FC<{ size?: number; photoUrl?: string }> = ({ size = 160, photoUrl = '/student_photo.png' }) => {
  const petals = [
    { angle: 0, color: '#e91e63' },   // Top (Pink)
    { angle: 45, color: '#fdd835' },  // Top Right (Yellow)
    { angle: 90, color: '#1976d2' },  // Right (Blue)
    { angle: 135, color: '#c2185b' }, // Bottom Right (Magenta)
    { angle: 180, color: '#fdd835' }, // Bottom (Yellow)
    { angle: 225, color: '#388e3c' }, // Bottom Left (Green)
    { angle: 270, color: '#1976d2' }, // Left (Blue)
    { angle: 315, color: '#e91e63' }, // Top Left (Pink)
  ];

  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="flowerCenterFaceClip">
          <circle cx="100" cy="90" r="35" />
        </clipPath>
      </defs>

      {/* Stem & Leaves */}
      <path d="M 100 122 L 100 195" stroke="#2e7d32" strokeWidth="8" strokeLinecap="round" />
      <path d="M 100 160 C 65 150 45 135 40 145 C 50 165 80 165 100 165 Z" fill="#43a047" stroke="#1b5e20" strokeWidth="2" />
      <path d="M 100 170 C 135 160 155 145 160 155 C 150 175 120 175 100 175 Z" fill="#43a047" stroke="#1b5e20" strokeWidth="2" />

      {/* 8 Large Round Petals */}
      <g id="flower-petals">
        {petals.map((p, idx) => (
          <g key={idx} transform={`translate(100, 90) rotate(${p.angle})`}>
            <ellipse 
              cx="0" 
              cy="-42" 
              rx="18" 
              ry="26" 
              fill={p.color} 
              stroke="#222222" 
              strokeWidth="2.5" 
            />
          </g>
        ))}
      </g>

      {/* Center White Face Circle Background & Border */}
      <circle cx="100" cy="90" r="35" fill="#ffffff" stroke="#222222" strokeWidth="3" />

      {/* Real Student Photo Clipped in Center Circle */}
      <image 
        href={photoUrl} 
        x="58" 
        y="44" 
        width="84" 
        height="84" 
        preserveAspectRatio="xMidYMid slice" 
        clipPath="url(#flowerCenterFaceClip)" 
      />

      {/* Decorative Outer Border Circle for clean finish */}
      <circle cx="100" cy="90" r="35" fill="none" stroke="#222222" strokeWidth="3" />
    </svg>
  );
};

const Badges: React.FC = () => {
  const { state, addBadge, deleteBadge, updateBadgeDescription } = useAppContext();
  const lang = state.language || 'vi';
  const t = translations[lang];

  const [showForm, setShowForm] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  
  // New Badge Form State
  const [descInput, setDescInput] = useState(t.defaultRewardDesc);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  // Camera States & Refs
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Inline Editing State for Black Text Line
  const [editingBadgeId, setEditingBadgeId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Export Board Image Function
  const handleDownloadBoardImage = async () => {
    if (!boardRef.current) return;
    try {
      setIsExporting(true);
      const canvas = await html2canvas(boardRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: '#5c3818',
        ignoreElements: (el) => el.getAttribute('data-html2canvas-ignore') === 'true',
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Bang_Phieu_Be_Ngoan_${state.profile.studentName || 'Student'}.png`;
      link.click();
    } catch (err) {
      alert('Không thể xuất hình ảnh. Vui lòng thử lại!');
    } finally {
      setIsExporting(false);
    }
  };

  // Export Single Badge Image Function
  const handleDownloadSingleBadgeImage = async (badgeId: string) => {
    const cardElement = document.getElementById(`badge-card-${badgeId}`);
    if (!cardElement) return;
    try {
      const canvas = await html2canvas(cardElement, {
        useCORS: true,
        allowTaint: true,
        scale: 3,
        backgroundColor: '#ffffff',
        ignoreElements: (el) => el.getAttribute('data-html2canvas-ignore') === 'true',
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Phieu_Be_Ngoan_${state.profile.studentName || 'Student'}_${badgeId}.png`;
      link.click();
    } catch (err) {
      alert('Không thể xuất hình ảnh phiếu. Vui lòng thử lại!');
    }
  };

  // Start Camera Stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 600 }, height: { ideal: 600 }, facingMode: 'user' }
      });
      setMediaStream(stream);
      setIsCameraActive(true);
    } catch (err) {
      alert('Không thể truy cập Camera. Bạn có thể chọn ảnh từ máy tính hoặc điện thoại nhé!');
    }
  };

  useEffect(() => {
    if (isCameraActive && videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [isCameraActive, mediaStream]);

  // Stop Camera Stream
  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    setIsCameraActive(false);
  };

  // Capture 1:1 Photo from Video
  const takeSnapshot = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const size = Math.min(video.videoWidth || 400, video.videoHeight || 400);
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const sx = (video.videoWidth - size) / 2;
        const sy = (video.videoHeight - size) / 2;
        ctx.drawImage(video, sx, sy, size, size, 0, 0, 400, 400);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedPhoto(dataUrl);
        stopCamera();
      }
    }
  };

  // Handle File Upload Fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedPhoto(event.target.result as string);
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseModal = () => {
    stopCamera();
    setShowForm(false);
  };

  const handleAdd = () => {
    addBadge({
      id: Date.now().toString(),
      title: 'Certificate',
      description: descInput.trim() || t.defaultRewardDesc,
      icon: '🌸',
      color: '#d81b60',
      date: new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'vi-VN'),
      photoUrl: capturedPhoto || '/student_photo.png'
    });
    stopCamera();
    setShowForm(false);
    setCapturedPhoto(null);
    setDescInput(t.defaultRewardDesc);
  };

  const handleDelete = (badgeId: string) => {
    if (confirm(t.deleteConfirm)) {
      deleteBadge(badgeId);
    }
  };

  const startEditDescription = (badgeId: string, currentDesc: string) => {
    setEditingBadgeId(badgeId);
    setEditingText(currentDesc);
  };

  const saveDescription = (badgeId: string) => {
    if (editingText.trim()) {
      updateBadgeDescription(badgeId, editingText.trim());
      setEditingBadgeId(null);
    }
  };

  const totalBadges = state.badges.length;
  const cardDim = totalBadges <= 2 
    ? { width: '250px', minHeight: '350px', flowerSize: 135, titleSize: '1.3rem', nameSize: '1.75rem', minGrid: '250px', textLineSize: '0.9rem' }
    : totalBadges <= 5 
    ? { width: '210px', minHeight: '300px', flowerSize: 115, titleSize: '1.12rem', nameSize: '1.5rem', minGrid: '210px', textLineSize: '0.85rem' }
    : { width: '180px', minHeight: '265px', flowerSize: 95, titleSize: '0.98rem', nameSize: '1.3rem', minGrid: '180px', textLineSize: '0.78rem' };

  return (
    <div className="badges-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'linear-gradient(135deg, #e91e63 0%, #ff6090 100%)', padding: '12px', borderRadius: '16px', color: 'white', boxShadow: '0 4px 14px rgba(233, 30, 99, 0.35)' }}>
            <Award size={28} />
          </div>
          <div>
            <h2 style={{ margin: 0, color: '#880e4f', fontSize: '1.6rem' }}>{t.badgeHeaderTitle}</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {t.badgeHeaderSub.replace('{student}', state.profile.studentName).replace('{teacher}', state.profile.teacherName)}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* Download Full Board Image Button */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn" 
            onClick={handleDownloadBoardImage} 
            disabled={isExporting}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', 
              color: 'white',
              fontSize: '0.95rem',
              fontWeight: 'bold',
              padding: '12px 18px',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}
          >
            <Download size={18} />
            <span>{isExporting ? t.downloadingBoardBtn : t.downloadBoardBtn}</span>
          </motion.button>

          {/* Export PDF Report Button */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn" 
            onClick={() => setShowPdfModal(true)} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', 
              color: 'white',
              fontSize: '0.95rem',
              fontWeight: 'bold',
              padding: '12px 18px',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)'
            }}
          >
            <FileText size={18} />
            <span>{t.exportPdfBtn}</span>
          </motion.button>

          {state.isTeacherMode && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn" 
              onClick={() => { setShowForm(true); setCapturedPhoto(null); setDescInput(t.defaultRewardDesc); }} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: 'linear-gradient(135deg, #d81b60 0%, #e91e63 100%)', 
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: 'bold',
                padding: '12px 20px',
                boxShadow: '0 4px 14px rgba(216, 27, 96, 0.4)'
              }}
            >
              <Plus size={18} /> {t.issueCertificateBtn}
            </motion.button>
          )}
        </div>
      </div>

      {/* Achievement Cork/Wooden Board Display */}
      <div 
        ref={boardRef}
        className="glass-panel p-6" 
        style={{ 
          background: '#d4a373',
          backgroundImage: 'radial-gradient(#e0b589 15%, transparent 16%), radial-gradient(#c69462 15%, transparent 16%)',
          backgroundSize: '60px 60px',
          backgroundPosition: '0 0, 30px 30px',
          border: '12px solid #5c3818',
          borderRadius: '24px',
          minHeight: '600px',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.4), 0 10px 30px rgba(0,0,0,0.15)',
          position: 'relative'
        }}
      >
        {/* Board Title Tag */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(8px)',
          border: '2px solid #5c3818',
          borderRadius: '16px',
          padding: '10px 24px',
          width: 'fit-content',
          margin: '0 auto 36px auto',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: 0, color: '#5c3818', fontSize: '1.2rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {t.badgeBoardTitle}
          </h3>
        </div>

        <div 
          className="badges-grid" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(auto-fill, minmax(${cardDim.minGrid}, 1fr))`, 
            gap: '24px', 
            padding: '8px',
            justifyItems: 'center'
          }}
        >
          {state.badges.map((badge, idx) => {
            const isEditingThis = editingBadgeId === badge.id;
            const rotationAngle = (idx % 2 === 0 ? -2.5 : 2.5);

            return (
              <motion.div
                key={badge.id}
                id={`badge-card-${badge.id}`}
                whileHover={{ scale: 1.06, rotate: 0, zIndex: 10 }}
                transition={{ duration: 0.2 }}
                style={{
                  width: cardDim.width,
                  backgroundColor: '#ffffff',
                  background: '#ffffff',
                  borderRadius: '14px',
                  padding: '14px 10px 10px 10px',
                  textAlign: 'center',
                  position: 'relative',
                  boxShadow: '0 8px 22px rgba(0, 0, 0, 0.18)',
                  transform: `rotate(${rotationAngle}deg)`,
                  // Double Magenta Line Border matching authentic paper certificate
                  border: '2.5px solid #d81b60',
                  outline: '2px solid #ffffff',
                  outlineOffset: '-6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: cardDim.minHeight,
                }}
              >
                {/* Red Push Pin on top center of card */}
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, #ff5252 0%, #b71c1c 100%)',
                  border: '1.5px solid #ffffff',
                  boxShadow: '0 3px 6px rgba(0,0,0,0.35)',
                  zIndex: 6
                }} />

                {/* Single Card Download Button */}
                <span 
                  data-html2canvas-ignore="true"
                  title={t.downloadSingleCardBtn}
                  onClick={(e) => { e.stopPropagation(); handleDownloadSingleBadgeImage(badge.id); }}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    background: '#ecfdf5',
                    border: '1px solid #6ee7b7',
                    borderRadius: '50%',
                    padding: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#059669',
                    zIndex: 8,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <Download size={12} />
                </span>

                {/* Delete Button */}
                {state.isTeacherMode && (
                  <span 
                    data-html2canvas-ignore="true"
                    title="Delete this certificate"
                    onClick={(e) => { e.stopPropagation(); handleDelete(badge.id); }}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#fef2f2',
                      border: '1px solid #fca5a5',
                      borderRadius: '50%',
                      padding: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ef4444',
                      zIndex: 8,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Trash2 size={12} />
                  </span>
                )}

                {/* Top Magenta Card Title (Dynamic Bilingual Title) */}
                <h2 style={{ 
                  margin: '4px 0 2px 0', 
                  color: '#c2185b', 
                  fontSize: cardDim.titleSize, 
                  fontWeight: 900,
                  letterSpacing: '0.2px',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  textTransform: 'uppercase',
                  lineHeight: 1.15
                }}>
                  {t.badgeCardTitle}
                </h2>

                {/* Center Vector Flower Mascot with Custom/Captured Photo */}
                <div style={{ margin: '1px 0' }}>
                  <BeNgoanFlower size={cardDim.flowerSize} photoUrl={badge.photoUrl || '/student_photo.png'} />
                </div>

                {/* Student Name Line (Vietnamese Calligraphic Script Font) */}
                <div style={{ 
                  color: '#c2185b', 
                  fontSize: cardDim.nameSize, 
                  fontWeight: 'bold',
                  fontFamily: '"Dancing Script", "Be Vietnam Pro", cursive, sans-serif',
                  margin: '1px 0 4px 0',
                  lineHeight: 1.2,
                  textShadow: '0 1px 1px rgba(0,0,0,0.05)'
                }}>
                  {state.profile.studentName || (lang === 'en' ? 'Good Student' : 'Bé Ngoan')}
                </div>

                {/* Black Text Line (Editable Dòng Chữ Màu Đen) */}
                <div style={{ width: '100%', position: 'relative' }}>
                  {isEditingThis ? (
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <input
                        value={editingText}
                        onChange={e => setEditingText(e.target.value)}
                        placeholder="Enter text..."
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          border: '2px solid #d81b60',
                          fontSize: cardDim.textLineSize,
                          fontWeight: 'bold',
                          color: '#000',
                          textAlign: 'center',
                        }}
                      />
                      <button 
                        data-html2canvas-ignore="true"
                        onClick={() => saveDescription(badge.id)} 
                        className="btn" 
                        style={{ padding: '6px 8px', background: '#d81b60', color: 'white', display: 'flex', alignItems: 'center' }}
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => state.isTeacherMode && startEditDescription(badge.id, badge.description)}
                      title={state.isTeacherMode ? "Click to edit black text line" : undefined}
                      style={{
                        border: '1.5px solid #d81b60',
                        borderRadius: '6px',
                        padding: '4px 6px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        color: '#111827',
                        fontWeight: 800,
                        fontSize: cardDim.textLineSize,
                        textAlign: 'center',
                        lineHeight: 1.25,
                        cursor: state.isTeacherMode ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>{badge.description || t.defaultRewardDesc}</span>
                      {state.isTeacherMode && (
                        <Edit3 data-html2canvas-ignore="true" size={12} color="#880e4f" style={{ opacity: 0.7 }} />
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Date Tag */}
                <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '6px' }}>
                  {badge.date}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {ReactDOM.createPortal(
        <AnimatePresence>
          {showForm && (
            <div
              onClick={handleCloseModal}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="glass-panel p-6"
                onClick={e => e.stopPropagation()}
                style={{ width: '480px', maxWidth: '92vw', background: 'white', borderRadius: '24px', maxHeight: '90vh', overflowY: 'auto' }}
              >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ margin: 0, color: '#c2185b', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={20} /> {t.issueModalTitle}
                </h2>
                <X cursor="pointer" onClick={handleCloseModal} color="#94a3b8" />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#475569', fontSize: '0.9rem' }}>
                  {t.issueModalStudent}
                </label>
                <div style={{ padding: '8px 14px', borderRadius: '12px', background: '#fff0f5', color: '#c2185b', fontWeight: 'bold', fontSize: '1rem', border: '1px solid #f8bbd0' }}>
                  🌸 {state.profile.studentName || (lang === 'en' ? 'Good Student' : 'Bé Ngoan')}
                </div>
              </div>

              {/* 1:1 Camera / Photo Selection Section */}
              <div style={{ marginBottom: '20px', background: '#f8fafc', padding: '16px', borderRadius: '18px', border: '1.5px dashed #cbd5e1', textAlign: 'center' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#334155', fontSize: '0.9rem' }}>
                  {t.issueModalCamera}
                </label>

                {/* Viewfinder / Preview Box */}
                <div style={{ width: '180px', height: '180px', margin: '0 auto 14px auto', position: 'relative', borderRadius: '50%', overflow: 'hidden', border: '4px solid #d81b60', boxShadow: '0 4px 14px rgba(216, 27, 96, 0.3)', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isCameraActive ? (
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <BeNgoanFlower size={150} photoUrl={capturedPhoto || '/student_photo.png'} />
                  )}
                </div>

                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={handleFileUpload} 
                />

                {/* Action Camera Controls */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {isCameraActive ? (
                    <button
                      type="button"
                      onClick={takeSnapshot}
                      className="btn"
                      style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.9rem' }}
                    >
                      <Camera size={16} /> Chụp Ảnh Ngay 📸
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="btn"
                      style={{ background: 'linear-gradient(135deg, #d81b60 0%, #e91e63 100%)', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.9rem' }}
                    >
                      <Camera size={16} /> Mở Camera Chụp 1:1
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-secondary"
                    style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.9rem' }}
                  >
                    <Upload size={16} /> Chọn Tệp Ảnh
                  </button>
                </div>
              </div>

              {/* Reward Note Input */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#475569', fontSize: '0.9rem' }}>
                  {t.issueModalNote}
                </label>
                <textarea 
                  value={descInput} 
                  onChange={e => setDescInput(e.target.value)} 
                  placeholder={t.defaultRewardDesc} 
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #cbd5e1', fontSize: '0.95rem', minHeight: '75px', outline: 'none' }} 
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={handleAdd} 
                  className="btn" 
                  style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #d81b60 0%, #e91e63 100%)', color: 'white', fontWeight: 'bold', fontSize: '1rem' }}
                >
                  {t.issueModalPin}
                </button>
                <button 
                  onClick={handleCloseModal} 
                  className="btn btn-secondary" 
                  style={{ padding: '12px 20px', fontWeight: 'bold' }}
                >
                  {t.cancel}
                </button>
              </div>
            </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* PDF Summary Report Modal */}
      <ReportPDFModal isOpen={showPdfModal} onClose={() => setShowPdfModal(false)} />
    </div>
  );
};

export default Badges;
