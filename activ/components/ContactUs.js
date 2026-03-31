'use client'; // لو Next 13+ مع App Router، ممكن تستخدم "app/ai-coach/page.jsx"

import { useState, useRef } from 'react';

export default function AiCoach() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  const fileInputRef = useRef(null);

  // ==== Toast ====
  const showToast = (icon, message, type = 'success') => {
    alert(message); // مؤقتًا، ممكن تحسني بالـ toast component
  };

  // ==== File Handlers ====
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file.name.endsWith('.docx')) {
      showToast('fas fa-exclamation-circle', 'يرجى رفع ملف Word (.docx) فقط', 'error');
      return;
    }
    setSelectedFile(file);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
  };

  const startAnalysis = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setAnalysisData(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('/api/analyze', { method: 'POST', body: formData });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'حدث خطأ في الخادم');
      setAnalysisData(result.data);
      showToast('fas fa-check-circle', 'تم التحليل بنجاح!', 'success');
    } catch (err) {
      showToast('fas fa-times-circle', err.message || 'حدث خطأ غير متوقع', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen font-cairo px-4 py-10">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-red-glow-sm">
            <i className="fas fa-brain text-white text-xl"></i>
          </div>
          <span className="text-3xl font-black tracking-wide">AI Coach Analyst</span>
        </div>
        <p className="text-white/60 text-base">
          منصة ذكية لتحليل بيانات اللاعبين وبناء خطط تطوير شاملة
        </p>
      </header>

      {/* Steps */}
      <div className="flex items-center justify-center gap-0 mb-10">
        {/* يمكنك تكرار نفس HTML للخطوات */}
      </div>

      {/* Upload Card */}
      <div className="bg-black/80 border-2 border-red-900/70 rounded-3xl p-8 shadow-red-glow mb-8 relative overflow-hidden">
        <div
          className="drop-zone border-2 border-dashed border-red-800/60 rounded-2xl p-10 text-center cursor-pointer"
          onClick={() => fileInputRef.current.click()}
        >
          {!selectedFile && (
            <div>
              <i className="fas fa-cloud-upload-alt text-5xl text-red-500/70 mb-4 block"></i>
              <h3 className="text-lg font-bold text-white/80 mb-1">
                اسحب الملف هنا أو اضغط للرفع
              </h3>
              <p className="text-white/40 text-sm">صيغ الملفات المدعومة: .docx (Word)</p>
            </div>
          )}

          {selectedFile && (
            <div className="flex items-center justify-center gap-4">
              <i className="fas fa-file-word text-4xl text-red-400"></i>
              <span className="text-white font-bold text-base">{selectedFile.name}</span>
              <button onClick={removeFile} className="w-8 h-8 rounded-full bg-red-900/60 flex items-center justify-center">
                <i className="fas fa-times text-red-300 text-sm"></i>
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <button
          className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:bg-red-900/40 text-white font-black text-lg rounded-2xl mt-6"
          disabled={!selectedFile || loading}
          onClick={startAnalysis}
        >
          {loading ? 'جاري التحليل...' : 'بدء التحليل الذكي'}
        </button>
      </div>

      {/* Results */}
      {analysisData && (
        <div id="resultsContainer">
          <h2 className="text-2xl font-black mb-4">تقرير التحليل</h2>
          <pre className="bg-black/70 p-4 rounded-2xl">{JSON.stringify(analysisData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}