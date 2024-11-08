import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sSense } from "./s-sense";
import { analyzeReviews } from "@/lib/feedback";

const requestSchema = z.object({
  messages: z.string().array(),
  productName: z.string(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = requestSchema.safeParse(body);

  if (!data.success) {
    console.error("Invalid request body:", data.error);
    return NextResponse.json({ error: data.error }, { status: 400 });
  }

  const sSenseResult = await sSense(data.data.messages);

  if (sSenseResult.length > 0) {
    const analysis = await analyzeReviews(
      sSenseResult as any,
      data.data.productName
    );
    return NextResponse.json(analysis);
  } else {
    console.log("No reviews found");
    return NextResponse.json({ error: "No reviews found" }, { status: 400 });
  }
}
