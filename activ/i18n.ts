export const LANG = {
  ar: {
    common: {
      loading: 'جاري التحميل...',
      submit: 'إرسال',
      cancel: 'إلغاء',
    },
    header: {
      title: 'منصة تحليل اللاعبين',
      subtitle: 'تحليل بيانات اللاعبين وبناء خطط تطوير',
    },
    footer: {
      copy: 'جميع الحقوق محفوظة © 2026',
    },
    // كل كومبوننت أو صفحة هنا
    AIAnalyzer: {
      steps: [
        { num: '1', label: 'حمل النموذج', sub: 'حمل ملف Word الفارغ' },
        { num: '2', label: 'املأ البيانات', sub: 'أدخل بيانات اللاعب' },
        { num: '3', label: 'ارفع وحلل', sub: 'ارفع الملف للتحليل' },
      ],
      upload: {
        dragHere: 'اسحب الملف هنا أو اضغط للرفع',
        supported: 'صيغ الملفات المدعومة: .docx',
      },
      toast: {
        success: 'تم التحليل بنجاح!',
        error: 'حدث خطأ غير متوقع',
      },
    },
  },
  en: {
    common: {
      loading: 'Loading...',
      submit: 'Submit',
      cancel: 'Cancel',
    },
    header: {
      title: 'Player Analysis Platform',
      subtitle: 'Analyze player data & build development plans',
    },
    footer: {
      copy: 'All rights reserved © 2026',
    },
    AIAnalyzer: {
      steps: [
        { num: '1', label: 'Download Template', sub: 'Download the empty Word file' },
        { num: '2', label: 'Fill Data', sub: 'Enter player data' },
        { num: '3', label: 'Upload & Analyze', sub: 'Upload the file for analysis' },
      ],
      upload: {
        dragHere: 'Drag file here or click to upload',
        supported: 'Supported formats: .docx',
      },
      toast: {
        success: 'Analysis completed successfully!',
        error: 'Unexpected error occurred',
      },
    },
  },
};