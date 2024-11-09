"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface KeywordFrequency {
  [keyword: string]: number;
}

const chartConfig = {
  frequency: {
    label: "Frequency",
    color: "hsl(var(--chart-1))", // Use your existing color variables
  },
  label: {
    color: "hsl(var(--background))", // Use your existing color variables
  },
} satisfies ChartConfig;

export function FrequencyWordChart({
  keywordData,
}: {
  keywordData: KeywordFrequency;
}) {
  // Prepare data for Recharts, limiting to top 10 keywords
  const chartData = Object.entries(keywordData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([keyword, frequency]) => ({ keyword, frequency }));

  return (
    <ChartContainer config={chartConfig}>
      <BarChart data={chartData} layout="vertical" margin={{ right: 16 }}>
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="keyword"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          hide
        />
        <XAxis type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Bar
          dataKey="frequency"
          layout="vertical"
          fill="var(--color-desktop)" // Use your existing color variable
          radius={4}
        >
          <LabelList
            dataKey="keyword"
            position="insideLeft"
            offset={8}
            className="fill-[--color-label]" // Use your existing color variable
            fontSize={12}
          />
          <LabelList
            dataKey="frequency"
            position="right"
            offset={8}
            className="fill-foreground" // Use your existing color variable
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
