export type Language = 'vi' | 'en';

export const translations = {
  vi: {
    // Navigation
    navDashboard: 'Trang Chủ',
    navActivities: 'Hoạt Động',
    navStudy: 'Nội Dung Học',
    navTests: 'Bài Kiểm Tra',
    navFeedback: 'Cảm Nhận',
    navCat: 'Mèo Cam',
    navBadges: 'Phiếu Bé Ngoan',

    // Header & Teacher mode
    teacherMode: 'Góc Cô Giáo',
    welcomeStudent: 'Xin chào, {name}! 👋',
    class: 'Lớp học',
    favoriteMascot: 'Linh vật',
    targetGoal: 'Mục tiêu',
    teacherName: 'Cô giáo',

    // Dashboard Cards
    expPoints: 'Điểm Kinh Nghiệm',
    completedLessons: 'Bài Đã Hoàn Thành',
    level: 'Cấp Độ',
    summerTrack: 'Bảng Đường Đua Mùa Hè',
    completedProgress: 'Hoàn thành {percent}%',
    lessonMilestone: 'Buổi {num}',

    // Profile Modal
    profileTitle: 'Hồ Sơ Thông Tin Học Sinh',
    selectAvatar: 'Chọn Icon Avatar Nhân Vật:',
    studentNameLabel: 'Tên của Bé:',
    classLabel: 'Lớp học / Tuổi:',
    teacherLabel: 'Cô Giáo / Phụ Huynh:',
    mascotLabel: 'Linh vật yêu thích:',
    goalLabel: 'Mục tiêu học tập:',
    birthDateLabel: 'Ngày sinh của Bé:',
    saveProfile: 'Lưu Thông Tin Hồ Sơ',
    cancel: 'Hủy',

    // Certificates / Badges
    badgeCardTitle: 'PHIẾU BÉ NGOAN',
    badgeBoardTitle: '📌 BẢNG THÀNH TÍCH DÁN PHIẾU BÉ NGOAN',
    badgeHeaderTitle: 'Bảng Tuyên Dương Phiếu Bé Ngoan',
    badgeHeaderSub: 'Bảng khen thưởng của học sinh: {student} (Cô {teacher} trao tặng)',
    issueCertificateBtn: 'Tặng Phiếu Bé Ngoan Mới',
    downloadBoardBtn: 'Tải Ảnh Full Bảng (PNG)',
    downloadingBoardBtn: 'Đang Xuất Ảnh...',
    defaultRewardDesc: 'Chúc mừng bé ngoan nhất tuần 6',
    issueModalTitle: 'Trao Phiếu Bé Ngoan Mới',
    issueModalStudent: 'Học sinh nhận phiếu:',
    issueModalCamera: '📸 Chụp Ảnh Học Sinh Trực Tiếp (Khung 1:1):',
    issueModalNote: 'Nội dung khen thưởng (Dòng chữ màu đen):',
    issueModalPin: 'Tạo & Dán Lên Bảng',
    deleteConfirm: 'Bạn có chắc chắn muốn xóa phiếu bé ngoan này không?',

    // PDF Export & Badges
    downloadSingleCardBtn: 'Tải Ảnh Phiếu Này (PNG)',
    exportPdfBtn: 'Xuất PDF Báo Cáo',
    exportingPdfBtn: 'Đang Tạo PDF...',
    pdfReportTitle: 'BÁO CÁO TỔNG KẾT KẾT QUẢ VÀ TIẾN ĐỘ HỌC TẬP',
    pdfStudentInfo: 'Thông Tin Học Sinh',
    pdfOverviewStats: 'Thống Kê Tổng Quan',
    pdfLessonProgress: 'Bảng Tiến Độ Học Tập (12 Buổi)',
    pdfTestHistory: 'Lịch Sử Bài Kiểm Tra',
    pdfBadgesSummary: 'Danh Sách Phiếu Bé Ngoan',
    pdfFeedbacks: 'Nhận Xét & Đánh Giá',
    pdfSignatures: 'Xác Nhận Ký Tên',
    pdfTeacherSign: 'Chữ ký Giáo Viên',
    pdfParentSign: 'Chữ ký Phụ Huynh',

    // Language Toggle
    langSwitch: 'Ngôn Ngữ',
    resetProgressBtn: 'Reset Tiến Độ',
    resetConfirm: 'Bạn có chắc chắn muốn reset lại toàn bộ tiến độ bài học của bé không?',
  },
  en: {
    // Navigation
    navDashboard: 'Dashboard',
    navActivities: 'Activities',
    navStudy: 'Study Content',
    navTests: 'Tests',
    navFeedback: 'Student Feedback',
    navCat: 'Orange Cat',
    navBadges: 'Certificates',

    // Header & Teacher mode
    teacherMode: 'Teacher Corner',
    welcomeStudent: 'Welcome, {name}! 👋',
    class: 'Grade/Class',
    favoriteMascot: 'Mascot',
    targetGoal: 'Target Goal',
    teacherName: 'Teacher',

    // Dashboard Cards
    expPoints: 'Experience Points',
    completedLessons: 'Completed Lessons',
    level: 'Level',
    summerTrack: 'Summer Learning Track',
    completedProgress: 'Completed {percent}%',
    lessonMilestone: 'Lesson {num}',

    // Profile Modal
    profileTitle: 'Student Profile Settings',
    selectAvatar: 'Select Character Avatar:',
    studentNameLabel: 'Student Name:',
    classLabel: 'Grade / Class:',
    teacherLabel: 'Teacher / Parent:',
    mascotLabel: 'Favorite Mascot:',
    goalLabel: 'Learning Target:',
    birthDateLabel: 'Birth Date:',
    saveProfile: 'Save Profile Settings',
    cancel: 'Cancel',

    // Certificates / Badges
    badgeCardTitle: 'GOOD BEHAVIOR CERTIFICATE',
    badgeBoardTitle: '📌 GOOD STUDENT CERTIFICATE BOARD',
    badgeHeaderTitle: 'Star Student Certificates',
    badgeHeaderSub: 'Honors Wall for Student: {student} (Awarded by Teacher {teacher})',
    issueCertificateBtn: 'Issue New Certificate',
    downloadBoardBtn: 'Download Board Image (PNG)',
    downloadingBoardBtn: 'Exporting Image...',
    defaultRewardDesc: 'Congratulations! Best Student of Week 6',
    issueModalTitle: 'Issue New Certificate',
    issueModalStudent: 'Awarded Student:',
    issueModalCamera: '📸 Capture Live Photo (1:1 Frame):',
    issueModalNote: 'Reward Note (Black Text Line):',
    issueModalPin: 'Issue & Pin to Board',
    deleteConfirm: 'Are you sure you want to delete this certificate?',

    // PDF Export & Badges
    downloadSingleCardBtn: 'Download Single Card (PNG)',
    exportPdfBtn: 'Export PDF Report',
    exportingPdfBtn: 'Generating PDF...',
    pdfReportTitle: 'SUMMARY REPORT OF LEARNING RESULTS AND PROGRESS',
    pdfStudentInfo: 'Student Information',
    pdfOverviewStats: 'Performance Overview',
    pdfLessonProgress: 'Lesson Progress Tracker (12 Lessons)',
    pdfTestHistory: 'Test History & Scores',
    pdfBadgesSummary: 'Certificates & Rewards',
    pdfFeedbacks: 'Teacher & Parent Comments',
    pdfSignatures: 'Signatures & Verification',
    pdfTeacherSign: 'Teacher Signature',
    pdfParentSign: 'Parent Signature',

    // Language Toggle
    langSwitch: 'Language',
    resetProgressBtn: 'Reset Progress',
    resetConfirm: 'Are you sure you want to reset all completed lesson progress?',
  }
};
