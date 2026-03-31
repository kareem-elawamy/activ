import mammoth from 'mammoth';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json({ error: 'لم يتم رفع أي ملف' }, { status: 400 });
    }

    if (!file.name.endsWith('.docx')) {
      return Response.json({ error: 'يرجى رفع ملف .docx فقط' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { value: extractedText } = await mammoth.extractRawText({ buffer });

    if (!extractedText.trim()) {
      return Response.json({ error: 'الملف فارغ أو لا يحتوي على نص' }, { status: 400 });
    }

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `أنت محلل رياضي متخصص. قم بتحليل بيانات اللاعب التالية وأرجع النتيجة بصيغة JSON فقط بدون أي نص إضافي أو backticks.

البيانات:
${extractedText}

أرجع JSON بهذا الشكل بالضبط:
{
  "personal_summary": "ملخص شامل عن حالة اللاعب في جملة أو جملتين",
  "medical_history": ["نقطة 1", "نقطة 2", "نقطة 3"],
  "nutritional_habits": ["نقطة 1", "نقطة 2", "نقطة 3"],
  "psychological_plan": ["نقطة 1", "نقطة 2", "نقطة 3"],
  "environmental_factors": ["نقطة 1", "نقطة 2", "نقطة 3"],
  "recommended_activities": ["توصية 1", "توصية 2", "توصية 3", "توصية 4"]
}`,
        },
      ],
    });

    const rawText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('');

    const cleaned = rawText.replace(/```json|```/g, '').trim();

    let data;
    try {
      data = JSON.parse(cleaned);
    } catch {
      console.error('Claude response:', cleaned);
      return Response.json({ error: 'فشل في تحليل رد الذكاء الاصطناعي' }, { status: 500 });
    }

    return Response.json({ data });

  } catch (error) {
    console.error('Analyze API Error:', error);
    const msg = error?.message ?? 'حدث خطأ غير متوقع';
    return Response.json({ error: msg }, { status: 500 });
  }
}