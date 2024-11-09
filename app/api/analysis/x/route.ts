import { extractPostId } from "@/lib/extract-post-id";
import { analyzeReviews } from "@/lib/feedback";
import { removeTags } from "@/lib/remove-text";
import { sSense } from "@/lib/s-sense";
import { NextRequest, NextResponse } from "next/server";

export interface Root {
  data: Daum[];
  meta: Meta;
}

export interface Daum {
  id: string;
  edit_history_tweet_ids: string[];
  text: string;
}

export interface Meta {
  newest_id: string;
  oldest_id: string;
  result_count: number;
  next_token: string;
}

export async function POST(req: NextRequest) {
  const { xUrl, productName } = await req.json();
  let data;
  const postId = extractPostId(xUrl);
  if (!postId) {
    return NextResponse.json({ error: "Invalid X URL" }, { status: 400 });
  }

  try {
    data = await getXData(postId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 400 }
    );
  }

  const sSenseResult = await sSense(data.data.map((value) => removeTags(value.text)));

  if (sSenseResult.length > 0) {
    const analysis = await analyzeReviews(sSenseResult as any, productName);
    return NextResponse.json(analysis);
  } else {
    console.log("No reviews found");
    return NextResponse.json({ error: "No reviews found" }, { status: 400 });
  }
}

async function getXData(postId: string) {
  
  const response = await fetch(
    `https://api.x.com/2/tweets/search/recent?query=conversation_id:${postId}`,
    {
        headers: {
            Authorization: `Bearer ${process.env.X_BEARER_TOKEN}`,
        },
    }
  );
  if (!response.ok) {
    console.error(await response.text())
  }
 
  const data = await response.json();

  return data as Root;
}
