import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Play, Check, ChevronDown, ChevronRight, Video, Gamepad2, Brain, Star, Edit3, Plus, X, Save, Trash2, BookPlus, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const Activities: React.FC = () => {
  const { state, markStageComplete, updateStage, addStage, deleteStage, updateLessonTitle, addLesson, deleteLesson, resetProgress, resetSingleLesson } = useAppContext();
  const [activeWeek, setActiveWeek] = useState(1);
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);

  // Edit Stage State
  const [editingStage, setEditingStage] = useState<{lessonId: number, stageIdx: number} | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editLink, setEditLink] = useState('');

  // Add Stage State
  const [addingToLesson, setAddingToLesson] = useState<number | null>(null);

  // Lesson Edit & Add States
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [editingLessonTitleText, setEditingLessonTitleText] = useState('');
  
  const getStageIcon = (idx: number) => {
    switch (idx) {
      case 0: return <Video size={20} />;
      case 1: return <Brain size={20} />;
      case 2: return <Gamepad2 size={20} />;
      case 3: return <Star size={20} />;
      default: return <Play size={20} />;
    }
  };

  const weekData = state.curriculum.find((w: any) => w.week === activeWeek);

  const startEdit = (lessonId: number, stageIdx: number, stage: any) => {
    setEditingStage({ lessonId, stageIdx });
    setEditName(stage.name);
    setEditDesc(stage.desc);
    setEditLink(stage.link || '');
  };

  const saveEdit = () => {
    if (editingStage) {
      updateStage(activeWeek, editingStage.lessonId, editingStage.stageIdx, {
        name: editName,
        desc: editDesc,
        link: editLink
      });
      setEditingStage(null);
    }
  };

  const handleDeleteStage = (lessonId: number, stageIdx: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa chặng hoạt động này không?')) {
      deleteStage(activeWeek, lessonId, stageIdx);
      if (editingStage?.lessonId === lessonId && editingStage?.stageIdx === stageIdx) {
        setEditingStage(null);
      }
    }
  };

  const handleAddStage = () => {
    if (addingToLesson && editName) {
      addStage(activeWeek, addingToLesson, {
        name: editName,
        desc: editDesc,
        link: editLink
      });
      setAddingToLesson(null);
    }
  };

  const openAddModal = (lessonId: number) => {
    setAddingToLesson(lessonId);
    setEditName('');
    setEditDesc('');
    setEditLink('');
  };

  // Handle Lesson Title Management
  const handleSaveLessonTitle = (lessonId: number) => {
    if (editingLessonTitleText.trim()) {
      updateLessonTitle(activeWeek, lessonId, editingLessonTitleText.trim());
      setEditingLessonId(null);
    }
  };

  const handleCreateLesson = () => {
    if (newLessonTitle.trim()) {
      addLesson(activeWeek, newLessonTitle.trim());
      setShowAddLessonModal(false);
      setNewLessonTitle('');
    }
  };

  const handleDeleteLesson = (lessonId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài học này khỏi giáo trình không?')) {
      deleteLesson(activeWeek, lessonId);
    }
  };

  return (
    <div className="activities-container">
      {/* Week Selector & Add Lesson Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {[1, 2, 3].map(w => (
            <button 
              key={w}
              onClick={() => setActiveWeek(w)}
              className={`btn ${activeWeek === w ? '' : 'btn-secondary'}`}
              style={{ opacity: activeWeek === w ? 1 : 0.7 }}
            >
              Tuần {w}
            </button>
          ))}

          {/* Reset All Lessons Button (Teacher Mode Only) */}
          {state.isTeacherMode && (
            <button 
              onClick={() => {
                if (confirm('Bạn có chắc chắn muốn reset lại TOÀN BỘ các buổi học không?')) {
                  resetProgress();
                }
              }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '8px 14px', 
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
              <RotateCcw size={14} /> Reset Tất Cả Buổi Học
            </button>
          )}
        </div>

        {state.isTeacherMode && (
          <button 
            className="btn" 
            onClick={() => setShowAddLessonModal(true)} 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)', color: 'white' }}
          >
            <BookPlus size={18} /> Thêm Bài Học Mới (Tuần {activeWeek})
          </button>
        )}
      </div>

      <div className="glass-panel p-6">
        <h2 style={{ marginBottom: '8px' }}>{weekData?.title}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Phương pháp học: 5 phút Khởi động - 10 phút Vận động - 10 phút Trò chơi - 5 phút Tổng kết.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {weekData?.lessons.map((lesson: any) => {
            const isExpanded = expandedLesson === lesson.id;
            const completedStages = state.completedStages[lesson.id] || [];
            const isLessonCompleted = completedStages.length >= 4;
            const hasStarted = completedStages.length > 0;
            const isEditingTitle = editingLessonId === lesson.id;

            return (
              <div key={lesson.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: isLessonCompleted ? '2px solid var(--secondary)' : '1px solid #eee' }}>
                {/* Lesson Header */}
                <div 
                  onClick={() => setExpandedLesson(isExpanded ? null : lesson.id)}
                  style={{ 
                    padding: '16px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    background: isLessonCompleted ? 'rgba(78, 205, 196, 0.1)' : 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }} onClick={(e) => isEditingTitle && e.stopPropagation()}>
                    {isLessonCompleted ? <Check color="var(--secondary)" size={24} /> : <Play color="var(--primary)" size={24} />}
                    
                    {isEditingTitle ? (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1 }} onClick={e => e.stopPropagation()}>
                        <input
                          value={editingLessonTitleText}
                          onChange={e => setEditingLessonTitleText(e.target.value)}
                          style={{ padding: '6px 12px', borderRadius: '8px', border: '2px solid #6c5ce7', fontSize: '1.1rem', flex: 1 }}
                        />
                        <button onClick={() => handleSaveLessonTitle(lesson.id)} className="btn" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Lưu</button>
                        <button onClick={() => setEditingLessonId(null)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Hủy</button>
                      </div>
                    ) : (
                      <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {lesson.title}

                        {/* Reset Single Lesson Button (Teacher Mode Only) */}
                        {hasStarted && state.isTeacherMode && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Bạn có chắc muốn reset lại tiến độ của "${lesson.title}" không?`)) {
                                resetSingleLesson(lesson.id);
                              }
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 8px',
                              borderRadius: '8px',
                              border: '1px solid #fed7aa',
                              background: '#fff7ed',
                              color: '#ea580c',
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              marginLeft: '8px'
                            }}
                            title="Reset tiến độ bài học này"
                          >
                            <RotateCcw size={12} /> Reset Buổi Này
                          </button>
                        )}

                        {state.isTeacherMode && (
                          <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', marginLeft: '6px' }} onClick={e => e.stopPropagation()}>
                            <span title="Chỉnh sửa tên bài học" onClick={() => { setEditingLessonId(lesson.id); setEditingLessonTitleText(lesson.title); }} style={{ cursor: 'pointer', display: 'flex' }}>
                              <Edit3 size={16} color="var(--text-muted)" />
                            </span>
                            <span title="Xóa bài học này" onClick={() => handleDeleteLesson(lesson.id)} style={{ cursor: 'pointer', display: 'flex' }}>
                              <Trash2 size={16} color="#ef4444" />
                            </span>
                          </div>
                        )}
                      </h3>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {state.isTeacherMode && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); openAddModal(lesson.id); }} 
                        className="btn btn-secondary" 
                        style={{ padding: '4px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Plus size={14} /> Thêm chặng
                      </button>
                    )}
                    {isExpanded ? <ChevronDown /> : <ChevronRight />}
                  </div>
                </div>

                {/* Stages */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ padding: '0 16px 16px', borderTop: '1px solid #eee' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                        {lesson.stages.map((stage: any, idx: number) => {
                          const isStageCompleted = completedStages.includes(idx);
                          const isEditing = editingStage?.lessonId === lesson.id && editingStage?.stageIdx === idx;

                          return (
                            <div key={idx} style={{ 
                              display: 'flex', 
                              alignItems: 'flex-start', 
                              gap: '16px', 
                              padding: '12px',
                              background: isStageCompleted ? '#f0fdf4' : '#f8f9fa',
                              borderRadius: '12px',
                              borderLeft: `4px solid ${isStageCompleted ? 'var(--secondary)' : 'var(--primary)'}`
                            }}>
                              <div style={{ padding: '8px', background: isStageCompleted ? 'var(--secondary)' : 'white', color: isStageCompleted ? 'white' : 'var(--primary)', borderRadius: '50%' }}>
                                {isStageCompleted ? <Check size={20} /> : getStageIcon(idx)}
                              </div>
                              
                              <div style={{ flex: 1 }}>
                                {isEditing ? (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <input value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Tên chặng" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    <input value={editDesc} onChange={e=>setEditDesc(e.target.value)} placeholder="Mô tả hoạt động" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    <input value={editLink} onChange={e=>setEditLink(e.target.value)} placeholder="Link đính kèm (YouTube, Quizizz...)" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <button onClick={saveEdit} className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Save size={14}/> Lưu thay đổi</button>
                                      <button onClick={() => handleDeleteStage(lesson.id, idx)} className="btn" style={{ background: '#ef4444', color: 'white', padding: '6px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Trash2 size={14}/> Xóa chặng</button>
                                      <button onClick={() => setEditingStage(null)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Huỷ</button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <h4 style={{ margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      {stage.name}
                                      {state.isTeacherMode && (
                                         <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', marginLeft: '6px' }}>
                                           <span title="Chỉnh sửa chặng" onClick={() => startEdit(lesson.id, idx, stage)} style={{ cursor: 'pointer', display: 'flex' }}>
                                             <Edit3 size={14} color="var(--text-muted)" />
                                           </span>
                                           <span title="Xóa chặng này" onClick={() => handleDeleteStage(lesson.id, idx)} style={{ cursor: 'pointer', display: 'flex' }}>
                                             <Trash2 size={14} color="#ef4444" />
                                           </span>
                                         </div>
                                      )}
                                    </h4>
                                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{stage.desc}</p>
                                    {stage.link && (
                                      <a href={stage.link} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '8px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                        Mở liên kết ↗
                                      </a>
                                    )}
                                  </>
                                )}
                              </div>

                              {!isStageCompleted && !isEditing && (
                                <button 
                                  onClick={() => markStageComplete(lesson.id, idx)}
                                  className="btn" 
                                  style={{ padding: '8px 16px', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
                                >
                                  Xong (+XP)
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {ReactDOM.createPortal(
        addingToLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAddingToLesson(null)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '400px', background: 'white', borderRadius: '24px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', position: 'relative' }}
            >
              <button onClick={() => setAddingToLesson(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
              <h2 style={{ marginBottom: '20px', color: '#2d3436', fontSize: '1.2rem' }}>➕ Thêm Hoạt Động (Chặng Mới)</h2>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: '#374151' }}>Tên chặng:</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="VD: Chặng 5 (10p): Game Ô chữ" style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', fontFamily: 'Nunito, sans-serif' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: '#374151' }}>Mô tả chi tiết:</label>
                <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Hướng dẫn trò chơi..." style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', minHeight: '80px', fontSize: '0.95rem', outline: 'none', fontFamily: 'Nunito, sans-serif' }} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: '#374151' }}>Link đính kèm (YouTube/Quizizz):</label>
                <input value={editLink} onChange={e => setEditLink(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', fontFamily: 'Nunito, sans-serif' }} />
              </div>
              <button onClick={handleAddStage} className="btn" style={{ width: '100%', fontSize: '1rem', padding: '14px' }}>Thêm Vào Giáo Trình</button>
            </motion.div>
          </motion.div>
        ),
        document.body
      )}

      {ReactDOM.createPortal(
        showAddLessonModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddLessonModal(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '440px', background: 'white', borderRadius: '24px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', position: 'relative' }}
            >
              <button onClick={() => setShowAddLessonModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
              <h2 style={{ marginBottom: '20px', color: '#2d3436', fontSize: '1.2rem' }}>📚 Tạo Bài Học Mới (Tuần {activeWeek})</h2>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: '#374151' }}>Tên bài học mới:</label>
                <input
                  value={newLessonTitle}
                  onChange={e => setNewLessonTitle(e.target.value)}
                  placeholder="VD: Buổi 4: Hát bài hát phát âm ABC & Từ vựng mới"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', fontFamily: 'Nunito, sans-serif' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handleCreateLesson} className="btn" style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)', color: 'white', fontWeight: 'bold' }}>Tạo Bài Học</button>
                <button onClick={() => setShowAddLessonModal(false)} className="btn btn-secondary" style={{ padding: '12px 20px', fontWeight: 'bold' }}>Hủy</button>
              </div>
            </motion.div>
          </motion.div>
        ),
        document.body
      )}
    </div>
  );
};

export default Activities;
