import React, { createContext, useContext, useState, useEffect } from 'react';
import { curriculum as initialCurriculum } from '../data';

export interface Profile {
  studentName: string;
  teacherName: string;
  avatarIcon: string;
  studentClass: string;
  favoriteMascot: string;
  targetGoal: string;
  birthDate?: string;
}

export interface BadgeData {
  id: string;
  title: string;
  date: string;
  icon: string;
  color: string;
  description: string;
  photoUrl?: string;
}

export interface TestData {
  id: string;
  name: string;
  score: number;
  date: string;
  link: string;
  status: 'pending' | 'completed';
  accuracyPercent?: number;
}

export interface CustomWord {
  id: string;
  week: number;
  lessonId: number;
  en: string;
  vi: string;
}

export interface FeedbackEntry {
  id: string;
  lessonTitle: string;
  emoji: string;
  moodLabel: string;
  note: string;
  date: string;
}

export type HeroMood = 'normal' | 'crying' | 'happy' | 'angry' | 'victory' | 'sleepy' | 'shocked';

export type Language = 'vi' | 'en';

interface AppState {
  language: Language;
  isTeacherMode: boolean;
  profile: Profile;
  stars: number;
  fish: number;
  catLevel: number;
  catExp: number;
  catSkin: string;
  catHunger: number;
  lastHungerDate: string;
  heroMood: HeroMood;
  lastTestScore: number | null;
  completedLessons: number[];
  completedStages: { [lessonId: number]: number[]; };
  badges: BadgeData[];
  tests: TestData[];
  customWords: CustomWord[];
  feedbacks: FeedbackEntry[];
  curriculum: typeof initialCurriculum;
}

interface AppContextType {
  state: AppState;
  setLanguage: (lang: Language) => void;
  addStar: (amount: number) => void;
  addFish: (amount: number) => void;
  addExp: (amount: number) => void;
  setSkin: (skin: string) => void;
  updateHunger: (newHunger: number) => void;
  setHeroMood: (mood: HeroMood) => void;
  markStageComplete: (lessonId: number, stageIdx: number) => void;
  setTeacherMode: (val: boolean) => void;
  updateProfile: (profile: Profile) => void;
  addBadge: (badge: BadgeData) => void;
  deleteBadge: (badgeId: string) => void;
  updateBadgeDescription: (badgeId: string, newDesc: string) => void;
  addFeedback: (fb: FeedbackEntry) => void;
  deleteFeedback: (fbId: string) => void;
  addTest: (test: TestData) => void;
  deleteTest: (testId: string) => void;
  updateTestStatus: (testId: string, score: number, accuracyPercent?: number) => void;
  addCustomWord: (word: CustomWord) => void;
  updateStage: (weekId: number, lessonId: number, stageIdx: number, newStage: any) => void;
  addStage: (weekId: number, lessonId: number, newStage: any) => void;
  deleteStage: (weekId: number, lessonId: number, stageIdx: number) => void;
  updateLessonTitle: (weekId: number, lessonId: number, newTitle: string) => void;
  addLesson: (weekId: number, lessonTitle: string) => void;
  deleteLesson: (weekId: number, lessonId: number) => void;
  resetProgress: () => void;
  resetSingleLesson: (lessonId: number) => void;
}

export const computeHeroMood = (state: AppState): HeroMood => {
  const completedTests = state.tests.filter(t => t.status === 'completed');
  const pendingTests = state.tests.filter(t => t.status === 'pending');

  // 1. Check latest test score
  if (completedTests.length > 0) {
    const latestTest = completedTests[completedTests.length - 1];
    if (latestTest.score < 60) {
      return 'crying'; // Khóc nhè khi điểm < 60
    }
    if (latestTest.score >= 90) {
      return 'victory'; // Ăn mừng điểm xuất sắc >= 90
    }
    if (latestTest.score >= 60) {
      return 'happy'; // Vui vẻ điểm đạt 60 - 89
    }
  }

  // 2. Uncompleted pending tests
  if (pendingTests.length > 0) {
    return 'angry'; // Nhắc nhở làm bài test
  }

  // 3. Chưa có gì => vui vẻ chờ đợi
  return 'happy';
};

const getTodayDateString = () => new Date().toLocaleDateString('vi-VN');

const initialState: AppState = {
  language: 'vi',
  isTeacherMode: false,
  profile: {
    studentName: 'Bé Ngoan',
    teacherName: 'Cô Giáo',
    avatarIcon: '🐱',
    studentClass: 'Lớp 3A',
    favoriteMascot: 'Mèo Cam 🍊',
    targetGoal: 'Đạt 100 điểm Tiếng Anh',
    birthDate: '01/01/2017',
  },
  stars: 0,
  fish: 0,
  catLevel: 1,
  catExp: 0,
  catSkin: 'default',
  catHunger: 40, // 40% initial hunger
  lastHungerDate: getTodayDateString(),
  heroMood: 'normal',
  lastTestScore: null,
  completedLessons: [],
  completedStages: {},
  badges: [
    { id: '1', title: 'Good Student Certificate', date: '08/08/2026', icon: '🌸', color: '#e91e63', description: 'Congratulations! Best Student of Week 6' },
  ],
  tests: [], // Clean start without initial test
  customWords: [],
  feedbacks: [
    {
      id: '1',
      lessonTitle: 'Tuần 1 - Buổi 1: Alphabet & Greetings',
      emoji: '😄',
      moodLabel: 'Rất vui',
      note: 'Bé rất thích phần trò chơi phát âm và mở nắp quà!',
      date: '08/08/2026'
    }
  ],
  curriculum: initialCurriculum,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const today = getTodayDateString();
    const saved = localStorage.getItem('englishAppProgressV3');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Clean out default test '1' if present
      if (parsed.tests) {
        parsed.tests = parsed.tests.filter((t: any) => t.id !== '1');
      }
      // Reset hunger when a new day arrives
      if (!parsed.lastHungerDate || parsed.lastHungerDate !== today) {
        parsed.catHunger = 40;
        parsed.lastHungerDate = today;
      }
      if (!parsed.language) {
        parsed.language = 'vi';
      }
      return parsed;
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem('englishAppProgressV3', JSON.stringify(state));
  }, [state]);

  const setLanguage = (lang: Language) => setState(p => ({ ...p, language: lang }));

  const setTeacherMode = (val: boolean) => setState(p => ({ ...p, isTeacherMode: val }));
  
  const updateProfile = (profile: Profile) => setState(p => ({ ...p, profile }));
  
  const addBadge = (badge: BadgeData) => setState(p => ({ ...p, badges: [...p.badges, badge] }));
  
  const deleteBadge = (badgeId: string) => setState(p => ({
    ...p,
    badges: p.badges.filter(b => b.id !== badgeId)
  }));

  const updateBadgeDescription = (badgeId: string, newDesc: string) => setState(p => ({
    ...p,
    badges: p.badges.map(b => b.id === badgeId ? { ...b, description: newDesc } : b)
  }));

  const addFeedback = (fb: FeedbackEntry) => setState(p => ({
    ...p,
    feedbacks: [fb, ...(p.feedbacks || [])]
  }));

  const deleteFeedback = (fbId: string) => setState(p => ({
    ...p,
    feedbacks: (p.feedbacks || []).filter(f => f.id !== fbId)
  }));

  const addTest = (test: TestData) => setState(p => ({ ...p, tests: [...p.tests, test] }));

  const deleteTest = (testId: string) => setState(p => ({
    ...p,
    tests: p.tests.filter(t => t.id !== testId)
  }));
  
  const setHeroMood = (mood: HeroMood) => setState(p => ({ ...p, heroMood: mood }));

  const updateTestStatus = (testId: string, score: number, accuracyPercent?: number) => setState(p => {
    let newMood: HeroMood = 'happy';
    const percent = accuracyPercent !== undefined ? accuracyPercent : score;
    if (score < 60) {
      newMood = 'crying';
      setTimeout(() => alert(`😭 Ôi không! Bé đạt ${percent}% câu đúng (${score} điểm). Mèo Cam đang khóc nhè vì điểm thấp này! Hãy làm lại bài để Mèo Cam vui lại nhé!`), 400);
    } else if (score >= 90) {
      newMood = 'victory';
      setTimeout(() => alert(`🏆 Tuyệt vời! Bé đạt ${percent}% câu đúng (${score} điểm)! Mèo Cam vô cùng tự hào và ăn mừng chiến thắng cùng bé!`), 400);
    } else {
      newMood = 'happy';
    }

    return {
      ...p,
      heroMood: newMood,
      lastTestScore: score,
      tests: p.tests.map(t => t.id === testId ? { ...t, status: 'completed', score, accuracyPercent: percent } : t),
      stars: p.stars + (score >= 60 ? 10 : 2),
      fish: p.fish + (score >= 60 ? 5 : 1),
      catExp: p.catExp + (score >= 60 ? 50 : 10)
    };
  });

  const addCustomWord = (word: CustomWord) => setState(p => ({ ...p, customWords: [...p.customWords, word] }));

  const updateStage = (weekId: number, lessonId: number, stageIdx: number, newStage: any) => {
    setState(p => {
      const newCurriculum = JSON.parse(JSON.stringify(p.curriculum)); // deep copy
      const week = newCurriculum.find((w: any) => w.week === weekId);
      if (week) {
        const lesson = week.lessons.find((l: any) => l.id === lessonId);
        if (lesson && lesson.stages[stageIdx]) {
          lesson.stages[stageIdx] = newStage;
        }
      }
      return { ...p, curriculum: newCurriculum };
    });
  };

  const addStage = (weekId: number, lessonId: number, newStage: any) => {
    setState(p => {
      const newCurriculum = JSON.parse(JSON.stringify(p.curriculum));
      const week = newCurriculum.find((w: any) => w.week === weekId);
      if (week) {
        const lesson = week.lessons.find((l: any) => l.id === lessonId);
        if (lesson) {
          lesson.stages.push(newStage);
        }
      }
      return { ...p, curriculum: newCurriculum };
    });
  };

  const deleteStage = (weekId: number, lessonId: number, stageIdx: number) => {
    setState(p => {
      const newCurriculum = JSON.parse(JSON.stringify(p.curriculum));
      const week = newCurriculum.find((w: any) => w.week === weekId);
      if (week) {
        const lesson = week.lessons.find((l: any) => l.id === lessonId);
        if (lesson && lesson.stages && lesson.stages[stageIdx] !== undefined) {
          lesson.stages.splice(stageIdx, 1);
        }
      }
      return { ...p, curriculum: newCurriculum };
    });
  };

  const updateLessonTitle = (weekId: number, lessonId: number, newTitle: string) => {
    setState(p => {
      const newCurriculum = JSON.parse(JSON.stringify(p.curriculum));
      const week = newCurriculum.find((w: any) => w.week === weekId);
      if (week) {
        const lesson = week.lessons.find((l: any) => l.id === lessonId);
        if (lesson) {
          lesson.title = newTitle;
        }
      }
      return { ...p, curriculum: newCurriculum };
    });
  };

  const addLesson = (weekId: number, lessonTitle: string) => {
    setState(p => {
      const newCurriculum = JSON.parse(JSON.stringify(p.curriculum));
      const week = newCurriculum.find((w: any) => w.week === weekId);
      if (week) {
        const newId = Date.now();
        week.lessons.push({
          id: newId,
          title: lessonTitle,
          words: [],
          stages: [
            { name: 'Chặng 1 (5p): Khởi động', desc: 'Hát bài hát tiếng Anh và làm quen từ vựng mới.' },
            { name: 'Chặng 2 (10p): Vận động', desc: 'Chơi trò chơi hành động từ vựng.' },
            { name: 'Chặng 3 (10p): Luyện tập', desc: 'Thực hành giao tiếp và mẫu câu.' },
            { name: 'Chặng 4 (5p): Tổng kết', desc: 'Ôn tập và thưởng sao khen ngợi.' }
          ]
        });
      }
      return { ...p, curriculum: newCurriculum };
    });
  };

  const deleteLesson = (weekId: number, lessonId: number) => {
    setState(p => {
      const newCurriculum = JSON.parse(JSON.stringify(p.curriculum));
      const week = newCurriculum.find((w: any) => w.week === weekId);
      if (week) {
        week.lessons = week.lessons.filter((l: any) => l.id !== lessonId);
      }
      return { ...p, curriculum: newCurriculum };
    });
  };

  const addStar = (amount: number) => setState(p => ({ ...p, stars: p.stars + amount }));
  const addFish = (amount: number) => setState(p => ({ ...p, fish: p.fish + amount }));
  
  const addExp = (amount: number) => {
    setState(p => {
      let newExp = p.catExp + amount;
      let newLevel = p.catLevel;
      const expNeeded = newLevel * 100;
      
      if (newExp >= expNeeded) {
        newExp -= expNeeded;
        newLevel += 1;
        alert(`Chúc mừng! Mèo Cam của bạn đã lên cấp ${newLevel}!`);
      }
      
      return { ...p, catExp: newExp, catLevel: newLevel };
    });
  };

  const setSkin = (skin: string) => setState(p => ({ ...p, catSkin: skin }));

  const updateHunger = (val: number) => setState(p => ({
    ...p,
    catHunger: Math.max(0, Math.min(100, val)),
    lastHungerDate: getTodayDateString()
  }));

  const markStageComplete = (lessonId: number, stageIdx: number) => {
    setState(p => {
      const currentLessonStages = p.completedStages[lessonId] || [];
      if (!currentLessonStages.includes(stageIdx)) {
        const newStages = [...currentLessonStages, stageIdx];
        
        let newCompletedLessons = [...p.completedLessons];
        if (newStages.length === 4 && !newCompletedLessons.includes(lessonId)) {
          newCompletedLessons.push(lessonId);
          setTimeout(() => alert('Chúc mừng bé đã hoàn thành buổi học! Thưởng 10 cá 🐟 và 50 điểm kinh nghiệm cho Mèo Cam!'), 500);
          return {
            ...p,
            completedStages: { ...p.completedStages, [lessonId]: newStages },
            completedLessons: newCompletedLessons,
            fish: p.fish + 10,
            catExp: p.catExp + 50,
            stars: p.stars + 10
          };
        }
        
        return {
          ...p,
          completedStages: { ...p.completedStages, [lessonId]: newStages },
          fish: p.fish + 1,
          catExp: p.catExp + 10
        };
      }
      return p;
    });
  };

  const resetProgress = () => {
    setState(p => ({
      ...p,
      completedLessons: [],
      completedStages: {},
      stars: 0,
    }));
  };

  const resetSingleLesson = (lessonId: number) => {
    setState(p => ({
      ...p,
      completedLessons: p.completedLessons.filter(id => id !== lessonId),
      completedStages: {
        ...p.completedStages,
        [lessonId]: []
      }
    }));
  };

  return (
    <AppContext.Provider value={{ 
      state, setLanguage, addStar, addFish, addExp, setSkin, updateHunger, setHeroMood, markStageComplete, 
      setTeacherMode, updateProfile, addBadge, deleteBadge, updateBadgeDescription, addFeedback, deleteFeedback, addTest, deleteTest, updateTestStatus, 
      addCustomWord, updateStage, addStage, deleteStage, updateLessonTitle, addLesson, deleteLesson, resetProgress, resetSingleLesson
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
