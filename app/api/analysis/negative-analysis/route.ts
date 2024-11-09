import { analyzeThroughLLM } from "@/lib/llm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { stats, productName } = await req.json();
  const prompt = `คุณคือผู้วินิจฉัยความคิดเห็นเชิงลบของลูกค้าจำนวนมาก จากกลุ่มคำสำคัญต่างๆ สินค้าคือ: ${productName} คุณจงช่วยวิเคราะห์คำสำคัญต่อไปนี้: ${JSON.stringify(
    stats
  )} และวิเคราะห์ความคิดเห็นเชิงลบของผู้ใช้ว่ามีด้านไหนบ้าง และช่วยคิดแนวทางการแก้ไขอย่างรอบคอบ
  เช่น: 
  - ประมาณ 58% บอกว่าฟองน้ำแข็งเกินไป
  - ประมาณ 20% บอกว่าฟองน้ำอ่อนนุ่มเกินไป

  และบอกแนวคิดหรือกลยุทธ์ในการแก้ไขปัญหาที่ได้รับจาก feedback ของลูกค้า
    `;
  const result = await analyzeThroughLLM(prompt);
  return NextResponse.json({ message: result });
}
