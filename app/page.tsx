"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Info, MessageSquare, Sparkles } from "lucide-react";
import Textarea from "react-textarea-autosize";
import { motion } from "framer-motion";
import ResultSection from "./components/result-section";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z, ZodError } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define Zod schemas for input and output
const analysisInputSchema = z.object({
  productName: z.string().min(1, { message: "กรุณากรอกชื่อสินค้า" }),
  messages: z.string().min(1, { message: "กรุณากรอกข้อความรีวิว" }),
});

export default function Home() {
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const methods = useForm<z.infer<typeof analysisInputSchema>>({
    resolver: zodResolver(analysisInputSchema),
    defaultValues: {
      productName: "",
      messages: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof analysisInputSchema>) => {
    setIsLoading(true);
    setResult(null);
    setApiError(null);

    try {
      const messages = data.messages
        .split("\n")
        .filter((msg) => msg.trim() !== "");
      const response = await fetch("/api/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productName: data.productName, messages }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      setResult(responseData);
    } catch (error) {
      console.error("Error during analysis:", error);
      if (error instanceof ZodError) {
        setApiError("ข้อมูลจาก API ไม่ถูกต้อง  กรุณาตรวจสอบข้อมูลที่กรอก");
      } else {
        const errorData = error as { message: string };
        setApiError(errorData.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="grid lg:grid-cols-2 min-h-dvh bg-gradient-to-br from-purple-600 to-blue-500 text-white">
      <motion.div
        className="flex flex-col justify-center px-8 lg:px-16 py-12 lg:py-0"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold mb-4">FeedbackThai</h1>
        <p className="text-xl mb-8">บริการวิเคราะห์ความคิดเห็นอัจฉริยะ</p>
        <div className="flex items-center space-x-4 text-lg">
          <Sparkles className="w-6 h-6" />
          <span>เทคโนโลยี AI ล้ำสมัย</span>
        </div>
        <div className="flex items-center space-x-4 text-lg mt-4">
          <MessageSquare className="w-6 h-6" />
          <span>วิเคราะห์ความคิดเห็นแม่นยำ</span>
        </div>
      </motion.div>
      <motion.div
        className="flex flex-col justify-center px-8 lg:px-16 py-12 rounded-bl-3xl bg-white/10 backdrop-blur-lg"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-white/20 p-8 rounded-3xl shadow-2xl space-y-6">
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <Label
                htmlFor="productName"
                className="text-lg font-semibold mb-2 block"
              >
                ชื่อสินค้า
              </Label>
              <Input
                id="productName"
                {...methods.register("productName")}
                className="bg-white/10 h-11 text-xl border-none text-white"
                placeholder="กรอกชื่อสินค้าของคุณ"
              />
              {methods.formState.errors.productName && (
                <p className="text-red-500 text-sm">
                  {methods.formState.errors.productName.message}
                </p>
              )}
            </div>
            <div>
              <Label
                htmlFor="messages"
                className="text-lg font-semibold mb-2 block"
              >
                ข้อความรีวิว
              </Label>
              <Textarea
                id="messages"
                maxRows={10}
                {...methods.register("messages")}
                className="bg-white/10 border-none w-full text-white placeholder-white/60 min-h-[120px] p-2 rounded-xl"
                placeholder="วางข้อความรีวิวที่ต้องการวิเคราะห์"
              />
              {methods.formState.errors.messages && (
                <p className="text-red-500 text-sm">
                  {methods.formState.errors.messages.message}
                </p>
              )}
            </div>
            <div className="flex items-start mt-2 text-sm text-white/80">
              <Info className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
              <p>
                หากต้องการใส่หลายความคิดเห็น ให้กด Enter
                เพื่อขึ้นบรรทัดใหม่สำหรับแต่ละความคิดเห็น
              </p>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading || methods.formState.isSubmitting}
                size="lg"
                className="rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white font-semibold px-8 py-6 text-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                เริ่มต้นวิเคราะห์ <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            {apiError && (
              <p className="text-red-500 text-sm">Error: {apiError}</p>
            )}
          </form>
        </div>
      </motion.div>
      {isLoading ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : result ? (
        <div className="col-span-2 py-8">
          <ResultSection analysisData={result} />
        </div>
      ) : null}
    </main>
  );
}
