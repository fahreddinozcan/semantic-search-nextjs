import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const token = process.env.OPENAI_KEY || "";
const openai = new OpenAI({
  apiKey: token,
});

const model = "text-embedding-ada-002";
export async function POST(req: NextRequest) {
  const data = await req.json();

  const { dataset } = data;

  const openai_response = await openai.embeddings.create({
    model: model,
    input: dataset,
    encoding_format: "float",
  });

  const embeddings = openai_response.data;

  return NextResponse.json({ embeddings });
}
