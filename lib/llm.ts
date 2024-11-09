import { LLM_URL } from "./config";

export async function analyzeThroughLLM(prompt: string) {
    const apiUrl = `${LLM_URL}/ask`; // URL ของ FastAPI ที่เราใช้งาน
  
    console.log(apiUrl);
  
    const response = await fetch(apiUrl, {
      method: "POST", // กำหนดเป็น POST request
      headers: {
        "Content-Type": "application/json", // ระบุประเภทข้อมูลเป็น JSON
      },
      body: JSON.stringify({
        question: prompt, // ส่งคำถามไปใน body
      }),
    });
  
    // ตรวจสอบสถานะการตอบกลับ
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    // แปลงข้อมูล JSON ที่ได้รับ
    const data = await response.json();
    return data.answer; // ส่งคำตอบที่ได้รับจาก API
  }
  