import { AI_API_KEY, AI_URL } from "@/lib/config";
import { SSenseResponse } from "@/types/s-sense.type";

export const sSense = async (messages: string[]) => {
  const result: SSenseResponse[] = [];

  await Promise.all(
    messages.map(async (message) => {
      try {
        const response = await fetch(AI_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Apikey": AI_API_KEY,
          },
          body: `text=${encodeURIComponent(message)}`,
        });
        
        if (response.ok) {
          try {
            const text = await response.text(); // อ่านเป็น text ก่อน
            const data = JSON.parse(text); // แปลงเป็น JSON
            result.push(data);
          } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Raw response:", await response.text());
          }
        } else {
          console.error("API Error:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Network Error:", error);
      }
    })
  );

  return result;
};