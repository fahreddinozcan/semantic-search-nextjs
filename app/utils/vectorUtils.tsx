import type { Vector } from "@upstash/vector";
export const generateEmbeddings = async (dataset: string[]) => {
  const res = await fetch("api/generateEmbeddings", {
    method: "POST",
    body: JSON.stringify({
      dataset,
    }),
  });

  const data = await res.json();
  return data;
};

export const upsertEmbeddings = async (vectors: Vector[]) => {
  const res = await fetch("api/upsertEmbeddings", {
    method: "POST",
    body: JSON.stringify({
      vectors,
    }),
  });

  const data = await res.json();
  return data;
};

export const queryEmbeddings = async (queryEmbedding: number[]) => {
  const res = await fetch("api/queryEmbeddings", {
    method: "POST",
    body: JSON.stringify({
      queryEmbedding: queryEmbedding,
    }),
  });

  const data = await res.json();
  return data;
};
