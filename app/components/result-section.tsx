"use client";

import { useState } from "react";
import Markdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThumbsUp, ThumbsDown, Star, BarChart2, Bot } from "lucide-react";
import NegativeAnalysis from "./negative-analysis";
import { Button } from "@/components/ui/button";
import { FrequencyWordChart } from "./frequency-word-chart";

interface SimplifiedReview {
  text: string;
  sentiment: "positive" | "negative";
  score: number;
  positiveWords: string[];
  negativeWords: string[];
  keywords: string[];
}

interface KeywordFrequency {
  [keyword: string]: number;
}

interface Statistics {
  totalReviews: number;
  positiveReviews: number;
  negativeReviews: number;
  averageScore: number;
  keywordFrequency: KeywordFrequency;
  positiveKeywordFrequency: KeywordFrequency;
  negativeKeywordFrequency: KeywordFrequency;
}

interface AnalysisData {
  simplified: SimplifiedReview[];
  statistics?: Statistics;
  analysis: string;
}

export default function ResultSection({
  analysisData,
  productName,
}: {
  analysisData: AnalysisData;
  productName: string;
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isNagativeAnalysisDialogWorking, setIsNagativeAnalysisDialogWorking] =
    useState(false);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold my-8">ผลการวิเคราะห์รีวิว</h1>
      {analysisData.statistics && (
        <NegativeAnalysis
          productName={productName}
          stats={analysisData.statistics.negativeKeywordFrequency}
          isNegativeAnalysisWorking={isNagativeAnalysisDialogWorking}
          setIsNegativeAnalysisWorking={setIsNagativeAnalysisDialogWorking}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รีวิวทั้งหมด</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analysisData.statistics?.totalReviews}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">คะแนนเฉลี่ย</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analysisData.statistics?.averageScore.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รีวิวเชิงบวก</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analysisData.statistics?.positiveReviews}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รีวิวเชิงลบ</CardTitle>
            <ThumbsDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analysisData.statistics?.negativeReviews}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
          <TabsTrigger value="reviews">รีวิว</TabsTrigger>
          <TabsTrigger value="keywords">คำสำคัญ</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>การวิเคราะห์</CardTitle>
            </CardHeader>
            <CardContent>
              <Markdown className={"prose max-w-full"}>{analysisData.analysis}</Markdown>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="space-y-4">
          {analysisData.simplified.map((review, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span>รีวิว {index + 1}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      review.sentiment === "positive"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {review.sentiment === "positive" ? "เชิงบวก" : "เชิงลบ"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">{review.text}</p>
                <Progress value={review.score} className="h-2" />
                <div className="mt-2 text-sm text-muted-foreground">
                  คะแนน: {review.score.toFixed(2)}%
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ภาพรวม</CardTitle>
            </CardHeader>
            <CardContent>
              {analysisData.statistics?.keywordFrequency && (
                <FrequencyWordChart
                  keywordData={analysisData.statistics?.keywordFrequency}
                />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>คำสำคัญเชิงบวกที่พบบ่อย</CardTitle>
            </CardHeader>
            <CardContent>
              {analysisData.statistics?.positiveKeywordFrequency && (
                <FrequencyWordChart
                  keywordData={
                    analysisData.statistics?.positiveKeywordFrequency
                  }
                />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <p>คำสำคัญเชิงลบที่พบบ่อย</p>
                <Button
                  onClick={() => setIsNagativeAnalysisDialogWorking(true)}
                >
                  <Bot className="size-4 me-2" />
                  วิเคราะห์
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysisData.statistics?.negativeKeywordFrequency && (
                <FrequencyWordChart
                  keywordData={
                    analysisData.statistics?.negativeKeywordFrequency
                  }
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
