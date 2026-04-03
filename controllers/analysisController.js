const Analysis = require('../models/Analysis.js');
const aiService = require('../services/aiService.js'); 
const fileParser = require('../utils/fileParser.js');

exports.analyzeFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: "من فضلك قم برفع ملف." });
        }

        const text = await fileParser.extractTextFromWord(req.file.buffer);

        console.log("تم استخراج النص، جاري الإرسال للذكاء الاصطناعي...");
        const aiAnalysisResult = await aiService.analyzeStudentData(text);
        const newAnalysis = new Analysis({
            fileName: req.file.originalname,
            rawExtractedText: text,     
            aiAnalysis: aiAnalysisResult,
            status: 'completed'
        });

        const savedData = await newAnalysis.save();

        res.status(200).json({
            success: true,
            message: "تم تحليل الملف بنجاح",
            id: savedData._id,
            data: savedData.aiAnalysis
        });

    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};
