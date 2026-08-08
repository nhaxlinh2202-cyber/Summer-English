import { useState } from 'react';
import ReactDOM from 'react-dom';
import { 
  Home, 
  BookOpen, 
  CheckCircle, 
  Star, 
  Smile, 
  Award,
  Cat,
  Settings,
  X,
  GraduationCap,
  Sparkles,
  User,
  Target,
  Heart,
  Globe,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

import Dashboard from './components/Dashboard';
import Activities from './components/Activities';
import StudyContent from './components/StudyContent';
import Tests from './components/Tests';
import Feedback from './components/Feedback';
import OrangeCatPet from './components/OrangeCatPet';
import Badges from './components/Badges';
import FloatingCatWidget from './components/FloatingCatWidget';

import { useAppContext } from './context/AppContext';
import { translations } from './translations';

const AVATAR_ICONS = ['🐱', '🐶', '🦊', '🐼', '🦄', '🦁', '🚀', '👑', '🤖', '🐯', '🐰', '🐸'];

function App() {
  const { state, setTeacherMode, updateProfile, setLanguage } = useAppContext();
  const lang = state.language || 'vi';
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Profile Form States
  const [tempStudent, setTempStudent] = useState(state.profile.studentName || 'Bé Ngoan');
  const [tempTeacher, setTempTeacher] = useState(state.profile.teacherName || 'Cô Giáo');
  const [tempAvatar, setTempAvatar] = useState(state.profile.avatarIcon || '🐱');
  const [tempClass, setTempClass] = useState(state.profile.studentClass || 'Lớp 3A');
  const [tempMascot, setTempMascot] = useState(state.profile.favoriteMascot || 'Mèo Cam 🍊');
  const [tempGoal, setTempGoal] = useState(state.profile.targetGoal || 'Đạt 100 điểm Tiếng Anh');
  const [tempBirth, setTempBirth] = useState(state.profile.birthDate || '01/01/2017');

  const menuItems = [
    { id: 'dashboard', label: t.navDashboard, icon: <Home size={24} /> },
    { id: 'activities', label: t.navActivities, icon: <BookOpen size={24} /> },
    { id: 'study', label: t.navStudy, icon: <Star size={24} /> },
    { id: 'tests', label: t.navTests, icon: <CheckCircle size={24} /> },
    { id: 'feedback', label: t.navFeedback, icon: <Smile size={24} /> },
    { id: 'cat', label: t.navCat, icon: <Cat size={24} style={{ color: '#ff9f43' }} /> },
    { id: 'badges', label: t.navBadges, icon: <Award size={24} /> },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'activities': return <Activities />;
      case 'study': return <StudyContent />;
      case 'tests': return <Tests />;
      case 'feedback': return <Feedback />;
      case 'spiderman': 
      case 'cat': return <OrangeCatPet />;
      case 'badges': return <Badges />;
      default: return <Dashboard />;
    }
  };

  const openModal = () => {
    setTempStudent(state.profile.studentName || 'Bé Ngoan');
    setTempTeacher(state.profile.teacherName || 'Cô Giáo');
    setTempAvatar(state.profile.avatarIcon || '🐱');
    setTempClass(state.profile.studentClass || 'Lớp 3A');
    setTempMascot(state.profile.favoriteMascot || 'Mèo Cam 🍊');
    setTempGoal(state.profile.targetGoal || 'Đạt 100 điểm Tiếng Anh');
    setTempBirth(state.profile.birthDate || '01/01/2017');
    setShowProfileModal(true);
  };

  const saveProfile = () => {
    updateProfile({
      studentName: tempStudent,
      teacherName: tempTeacher,
      avatarIcon: tempAvatar,
      studentClass: tempClass,
      favoriteMascot: tempMascot,
      targetGoal: tempGoal,
      birthDate: tempBirth,
    });
    setShowProfileModal(false);
  };

  return (
    <div className="app-container">
      {/* Floating Cat Popup Widget */}
      <FloatingCatWidget activeTab={activeTab} />

      {/* Sidebar */}
      <div className="sidebar glass-panel">
        <div className="sidebar-logo title-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sun style={{ color: '#ff9f43' }} size={32} />
          <span>Summer English</span>
        </div>
        
        <div className="nav-list">
          {menuItems.map(item => (
            <div 
              key={item.id} 
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="top-header mb-6">
          <h1 className="title-primary" style={{ fontSize: '2rem', margin: 0 }}>
            {menuItems.find(i => i.id === activeTab)?.label}
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            
            {/* Bilingual Language Switcher Switcher (🇻🇳 VI | 🇬🇧 EN) */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'white',
                padding: '4px 6px',
                borderRadius: '999px',
                border: '2px solid #e2e8f0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                gap: '4px'
              }}
            >
              <Globe size={18} color="#0984e3" style={{ marginLeft: '4px' }} />
              <button
                onClick={() => setLanguage('vi')}
                style={{
                  border: 'none',
                  background: lang === 'vi' ? 'linear-gradient(135deg, #ff7675 0%, #d63031 100%)' : 'transparent',
                  color: lang === 'vi' ? 'white' : '#64748b',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                🇻🇳 VI
              </button>
              <button
                onClick={() => setLanguage('en')}
                style={{
                  border: 'none',
                  background: lang === 'en' ? 'linear-gradient(135deg, #0984e3 0%, #6c5ce7 100%)' : 'transparent',
                  color: lang === 'en' ? 'white' : '#64748b',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                🇬🇧 EN
              </button>
            </motion.div>

            {/* Styled Teacher Mode Button (Top Header Position) */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTeacherMode(!state.isTeacherMode)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '8px 16px', 
                borderRadius: '999px',
                border: state.isTeacherMode ? '2px solid #a29bfe' : '2px solid #e2e8f0',
                background: state.isTeacherMode 
                  ? 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)' 
                  : 'white',
                color: state.isTeacherMode ? 'white' : '#475569',
                boxShadow: state.isTeacherMode 
                  ? '0 4px 14px rgba(108, 92, 231, 0.4)' 
                  : '0 2px 6px rgba(0,0,0,0.05)',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <GraduationCap size={18} />
              <span>{t.teacherMode}</span>
              <span 
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 6px',
                  borderRadius: '12px',
                  background: state.isTeacherMode ? 'rgba(255,255,255,0.3)' : '#f1f5f9',
                  color: state.isTeacherMode ? 'white' : '#64748b',
                  fontWeight: 800,
                  marginLeft: '2px',
                }}
              >
                {state.isTeacherMode ? 'ON ✨' : 'OFF'}
              </span>
            </motion.button>

            {/* User Profile Card Header */}
            <motion.div 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={openModal}
              className="user-profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'white',
                padding: '5px 12px 5px 6px',
                borderRadius: '999px',
                border: '2px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                cursor: 'pointer'
              }}
            >
              <div 
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #ffeaa7 0%, #ff7675 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}
              >
                {state.profile.avatarIcon || '🐱'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#2d3436' }}>
                  {state.profile.studentName}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#b2bec3' }}>
                  {state.profile.studentClass || 'Lớp 3A'}
                </span>
              </div>
              <Settings size={16} color="#94a3b8" style={{ marginLeft: '4px' }} />
            </motion.div>
          </div>
        </header>

        <div className="content-area">
          {renderContent()}
        </div>
      </div>

      {ReactDOM.createPortal(
        <AnimatePresence>
          {showProfileModal && (
            <div
              onClick={() => setShowProfileModal(false)}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
            >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass-panel p-6" 
              style={{ width: '520px', maxWidth: '92vw', background: 'white', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px' }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2d3436', margin: 0, fontSize: '1.4rem' }}>
                  <Sparkles color="#ff9f43" /> {t.profileTitle}
                </h2>
                <X cursor="pointer" onClick={() => setShowProfileModal(false)} color="#94a3b8" />
              </div>

              {/* Avatar Icon Selector Grid */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#475569', fontSize: '0.9rem' }}>
                  {t.selectAvatar}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
                  {AVATAR_ICONS.map(icon => (
                    <motion.div
                      key={icon}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setTempAvatar(icon)}
                      style={{
                        fontSize: '1.8rem',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '16px',
                        background: tempAvatar === icon ? '#fff7ed' : '#f8fafc',
                        border: tempAvatar === icon ? '3px solid #ff9f43' : '2px solid #e2e8f0',
                        cursor: 'pointer',
                        boxShadow: tempAvatar === icon ? '0 4px 10px rgba(255, 159, 67, 0.25)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {icon}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Information Form Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.85rem', color: '#475569' }}>
                    <User size={16} color="#0984e3" /> {t.studentNameLabel}
                  </label>
                  <input 
                    value={tempStudent} 
                    onChange={e => setTempStudent(e.target.value)} 
                    placeholder="VD: Nguyễn Văn A"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.85rem', color: '#475569' }}>
                    <GraduationCap size={16} color="#6c5ce7" /> {t.classLabel}
                  </label>
                  <input 
                    value={tempClass} 
                    onChange={e => setTempClass(e.target.value)} 
                    placeholder="VD: Lớp 3A"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.85rem', color: '#475569' }}>
                    <User size={16} color="#00b894" /> {t.teacherLabel}
                  </label>
                  <input 
                    value={tempTeacher} 
                    onChange={e => setTempTeacher(e.target.value)} 
                    placeholder="VD: Cô Mai Anh"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.85rem', color: '#475569' }}>
                    <Heart size={16} color="#e17055" /> {t.mascotLabel}
                  </label>
                  <input 
                    value={tempMascot} 
                    onChange={e => setTempMascot(e.target.value)} 
                    placeholder="VD: Mèo Cam 🍊"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.85rem', color: '#475569' }}>
                  <Target size={16} color="#d63031" /> {t.goalLabel}
                </label>
                <input 
                  value={tempGoal} 
                  onChange={e => setTempGoal(e.target.value)} 
                  placeholder="VD: Hoàn thành 10 bài test 100 điểm"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.85rem', color: '#475569' }}>
                  {t.birthDateLabel}
                </label>
                <input 
                  value={tempBirth} 
                  onChange={e => setTempBirth(e.target.value)} 
                  placeholder="VD: 15/08/2017"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={saveProfile} 
                  className="btn" 
                  style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #ff9f43 0%, #ff6b6b 100%)', color: 'white', fontWeight: 'bold', fontSize: '1rem' }}
                >
                  {t.saveProfile}
                </button>
                <button 
                  onClick={() => setShowProfileModal(false)} 
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
    </div>
  );
}

export default App;
