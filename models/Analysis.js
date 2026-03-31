import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
    fileName: String,
    rawExtractedText: { type: String, required: true },
    aiAnalysis: {
        personal_summary: String,
        medical_history: [String],
        nutritional_habits: [String],
        environmental_factors: [String],
        psychological_plan: [String],
        recommended_activities: [String]
    },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const Analysis = mongoose.model('Analysis', analysisSchema);
export default Analysis;
