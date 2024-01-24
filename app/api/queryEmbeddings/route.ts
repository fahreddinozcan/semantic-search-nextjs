import { NextRequest, NextResponse } from "next/server";

import { Index } from "@upstash/vector";

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL as string,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
});

export async function POST(req: NextRequest) {
  const data = await req.json();

  const { queryEmbedding } = data;

  if (!queryEmbedding) return NextResponse.json({ message: "Unsuccessful" });
  const responseQuery = await index.query({
    vector: queryEmbedding,
    topK: 10,
    includeMetadata: true,
    includeVectors: false,
  });

  return NextResponse.json({ message: responseQuery });
}
