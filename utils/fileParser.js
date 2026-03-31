import mammoth from 'mammoth';

export const extractTextFromWord = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer }, { preserveEmptyParagraphs: false });
    const cleanText = result.value.trim();
    if (!cleanText) throw new Error("لم يتم العثور على نص داخل الملف.");
    return cleanText;
  } catch (error) {
    throw new Error(`خطأ في معالجة ملف الوورد: ${error.message}`);
  }
};