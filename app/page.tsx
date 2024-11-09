"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z, ZodError } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Textarea from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info, Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import ResultSection from "./components/result-section";
import { cn } from "@/lib/utils";

// Define Zod schemas for input and output
const analysisInputSchema = z.object({
  productName: z.string().min(1, { message: "กรุณากรอกชื่อสินค้า" }),
  messages: z.string().min(1, { message: "กรุณากรอกข้อความรีวิว" }),
});

export default function Home() {
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const resultSectionRef = useRef(null);

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
      if (resultSectionRef.current) {
        (resultSectionRef.current as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
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
    <main
      className={cn(
        "h-dvh realtive overflow-auto grid grid-cols-1 gap-4 divide-x",
        result && "md:grid-cols-2"
      )}
    >
      <div className="md:sticky bg-background md:top-0 md:h-dvh px-4">
        <div className="container mx-auto max-w-3xl py-16">
          <span className="text-4xl font-semibold">
            <p className="bg-gradient-to-br from-violet-500 to-blue-600 bg-clip-text py-2 leading-tight text-transparent">
              FeedbackThai
            </p>
          </span>
        </div>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="relative items-center w-full container mx-auto max-w-3xl flex flex-col gap-4"
        >
          <Input
            placeholder="ชื่อสินค้า"
            disabled={isLoading}
            className="w-full bg-muted border rounded-lg border-input h-12"
            {...methods.register("productName")}
          />
          <Textarea
            {...methods.register("messages")}
            autoFocus
            disabled={isLoading}
            rows={3}
            maxRows={12}
            placeholder="ความคิดเห็นของลูกค้า"
            className="flex min-h-24 transition-all w-full rounded-lg border border-input bg-muted px-3 py-3 text-base shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          />
          <div className="flex w-full items-start mt-2 text-sm text-muted-foreground">
            <Info className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
            <p>
              หากต้องการใส่หลายความคิดเห็น ให้กด Enter
              เพื่อขึ้นบรรทัดใหม่สำหรับแต่ละความคิดเห็น
            </p>
          </div>
          <div className="flex justify-end w-full">
            <Button size={"lg"} disabled={isLoading}>
              {isLoading ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                <>
                  เริ่มต้นวิเคราะห์ <ArrowRight className="size-4 ms-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
      <div className="flex flex-col gap-4 pl-4">
        {result && (
          <>
            <ResultSection analysisData={result} />
          </>
        )}
        <div ref={resultSectionRef} />
        {apiError && (
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-semibold">ผลลัพธ์</span>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-lg font-semibold text-red-500">
                  {apiError}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
