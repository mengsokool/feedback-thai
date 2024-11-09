"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Loader, Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

interface KeywordFrequency {
  [keyword: string]: number;
}

export default function NegativeAnalysis({
  stats,
  productName,
  isNegativeAnalysisWorking,
  setIsNegativeAnalysisWorking,
}: {
  stats: KeywordFrequency;
  productName: string;
  isNegativeAnalysisWorking: boolean;
  setIsNegativeAnalysisWorking: (isNegativeAnalysisWorking: boolean) => void;
}) {
  const [isLoading, startLoadingTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  const startAnalysis = () => {
    startLoadingTransition(async () => {
      const response = await fetch("/api/analysis/negative-analysis", {
        method: "POST",
        body: JSON.stringify({ stats }),
      });
      if (!response.ok) {
        setResult("ไม่สามารถวิเคราะห์ได้ในขณะนี้");
        console.error(await response.text());
      } else {
        const data = await response.json();
        setResult(data.message);
      }
      return;
    });
  };

  useEffect(() => {
    if (stats && isNegativeAnalysisWorking) {
      startAnalysis();
    }
  }, [isNegativeAnalysisWorking]);

  return (
    <Dialog
      open={isNegativeAnalysisWorking}
      onOpenChange={setIsNegativeAnalysisWorking}
    >
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>วินิจฉัย</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="py-16 flex justify-center items-center flex-col">
            <Loader2 className="size-8 animate-spin" />
            <p>กำลังวิเคราะห์</p>
          </div>
        ) : result ? (
          <article className="whitespace-pre-wrap max-h-72 max-w-full overflow-auto pe-2 prose">
            {result}
          </article>
        ) : null}
        <DialogFooter>
          <DialogClose className={cn(buttonVariants({ variant: "outline" }))}>
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
