import { LLM_URL } from "./config";

// Types
interface SentimentResult {
  score: string;
  'polarity-neg': boolean;
  'polarity-pos': boolean;
  polarity: string;
}

interface Preprocess {
  input: string;
  neg: string[];
  pos: string[];
  keyword: string[];
}

export interface SSenseItem {
  sentiment: SentimentResult;
  preprocess: Preprocess;
}

interface SimplifiedReview {
  text: string;
  sentiment: string;
  score: number;
  positiveWords: string[];
  negativeWords: string[];
  keywords: string[];
}

// Function to simplify SSense results
export function simplifyFeedback(sSenseResult: SSenseItem[]): SimplifiedReview[] {
  return sSenseResult?.map(item => ({
    text: item.preprocess.input,
    sentiment: item.sentiment.polarity,
    score: parseFloat(item.sentiment.score),
    positiveWords: item.preprocess.pos,
    negativeWords: item.preprocess.neg,
    keywords: item.preprocess.keyword
  }));
}

// Function to generate statistics
export function generateStats(reviews: SimplifiedReview[]) {
  const totalReviews = reviews?.length || 0;
  const positiveReviews = reviews?.filter(r => r.sentiment === 'positive').length;
  const negativeReviews = reviews?.filter(r => r.sentiment === 'negative').length;
  
  const averageScore = reviews?.reduce((acc, r) => acc + r.score, 0) / totalReviews;
  
  // Collect all keywords and count frequencies
  const keywordFrequency = reviews?.flatMap(r => r.keywords)
    .reduce((acc, keyword) => {
      acc[keyword] = (acc[keyword] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  return {
    totalReviews,
    positiveReviews,
    negativeReviews,
    averageScore,
    keywordFrequency
  };
}

// Function to generate LLM prompt
export function generatePrompt(reviews: SimplifiedReview[], stats: any, productName: string): string {
  return `
กรุณาวิเคราะห์รีวิวจากลูกค้าของร้านอาหารต่อไปนี้:

ชื่อสินค้า: ${productName}

สถิติโดยสรุป:
- จำนวนรีวิวทั้งหมด: ${stats.totalReviews}
- รีวิวเชิงบวก: ${stats.positiveReviews} (${((stats.positiveReviews/stats.totalReviews)*100).toFixed(1)}%)
- รีวิวเชิงลบ: ${stats.negativeReviews} (${((stats.negativeReviews/stats.totalReviews)*100).toFixed(1)}%)
- คะแนนความรู้สึกเฉลี่ย: ${stats.averageScore.toFixed(1)}

คำที่ถูกกล่าวถึงบ่อยที่สุด:
${Object.entries(stats.keywordFrequency)
  .sort(([,a], [,b]) => (b as number) - (a as number))
  .slice(0, 5)
  .map(([keyword, count]) => `- ${keyword}: ${count} ครั้ง`)
  .join('\n')}

ตัวอย่างรีวิวเชิงบวก:
${reviews
  .filter(r => r.sentiment === 'positive')
  .slice(0, 3)
  .map(r => `- "${r.text}"`)
  .join('\n')}

ตัวอย่างรีวิวเชิงลบ:
${reviews
  .filter(r => r.sentiment === 'negative')
  .slice(0, 3)
  .map(r => `- "${r.text}"`)
  .join('\n')}

กรุณาวิเคราะห์ประเด็นต่อไปนี้:
1. จุดแข็งหลักของร้านอาหารจากรีวิว
2. ประเด็นที่ควรปรับปรุง
3. คำแนะนำที่สามารถนำไปปฏิบัติได้จริง
4. แนวโน้มและรูปแบบความคิดเห็นของลูกค้า
5. แนวทางการตอบกลับรีวิวเชิงลบที่แนะนำ

ตอบกลับมาในรูปแบบของ Markdown เพื่อความสวยงาม
`;
}

export async function analyzeReviews(sSenseResult: SSenseItem[], productName: string) {
  try {
    // 1. Simplify the raw data
    const simplifiedReviews = simplifyFeedback(sSenseResult);

    // 2. Generate statistics
    const stats = generateStats(simplifiedReviews);
  
    // 3. Generate prompt for LLM
    const prompt = generatePrompt(simplifiedReviews, stats, productName);

    // 4. Send to LLM (example using OpenAI)
    const analysis = await analyzeThroughLLM(prompt);

    return {
      simplified: simplifiedReviews,
      statistics: stats,
      analysis
    };
  } catch (error) {
    console.error('Error analyzing reviews:', error);
    throw error;
  }
}

async function analyzeThroughLLM(prompt: string) {
  const apiUrl = `${LLM_URL}/ask`  // URL ของ FastAPI ที่เราใช้งาน

  const response = await fetch(apiUrl, {
      method: 'POST',  // กำหนดเป็น POST request
      headers: {
          'Content-Type': 'application/json',  // ระบุประเภทข้อมูลเป็น JSON
      },
      body: JSON.stringify({
          question: prompt,  // ส่งคำถามไปใน body
      }),
  });

  // ตรวจสอบสถานะการตอบกลับ
  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }

  // แปลงข้อมูล JSON ที่ได้รับ
  const data = await response.json();
  return data.answer;  // ส่งคำตอบที่ได้รับจาก API
}