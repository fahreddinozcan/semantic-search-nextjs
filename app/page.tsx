"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  upsertEmbeddings,
  generateEmbeddings,
  queryEmbeddings,
} from "./utils/vectorUtils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { QueryResult, Vector } from "@upstash/vector";
// import { defaultText } from "./utils/data";
type Metadata = {
  sentence: string;
};

export default function Home() {
  const { toast } = useToast();
  const [dataValue, setDataValue] = useState<string>(defaultData);
  const [queryValue, setQueryValue] = useState<string>("");
  const [queryResponse, setQueryResponse] = useState<QueryResult<Metadata>[]>();

  const handleEmbed = async () => {
    const dataset = splitIntoSentences(dataValue);

    if (!dataset) return;

    const dataEmbeddings = await generateEmbeddings(dataset);

    const vectorsToUpsert: Vector[] = [];

    for (const embedding of dataEmbeddings.embeddings) {
      const newVector: Vector = {
        id: embedding.index,
        metadata: {
          sentence: dataset[embedding.index],
        },
        vector: embedding.embedding,
      };
      vectorsToUpsert.push(newVector);
    }

    const upsertResponse = await upsertEmbeddings(vectorsToUpsert);

    if (upsertResponse.message === "Success") {
      toast({
        variant: "default",
        title: "Success!",
        description:
          "The embeddings have been successfully created from the dataset, and upserted to Upstash Vector.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "An error has ocurred",
        description:
          "The embedding operation didn't work properly. Please try again with another data.",
      });
    }
  };

  const handleQuery = async () => {
    if (!queryValue) return;

    const queryEmbedding = await generateEmbeddings([queryValue]);

    const queryResult = await queryEmbeddings(
      queryEmbedding.embeddings[0].embedding
    );

    setQueryResponse(queryResult.message);
  };

  return (
    <main className="  text-start w-[62rem] mx-auto my-8 ">
      <Card className="p-8 shadow-xl border border-emerald-500">
        <CardHeader>
          <CardTitle>Semantic Search Example</CardTitle>
          <CardDescription>
            This is Upstash Vector example that uses OpenAI and Upstash Vector
            SDK
          </CardDescription>
        </CardHeader>
        <CardContent className=" gap-2 flex imtes-center justify-start flex-col w-full ">
          <p className="self-start font-semibold">
            Please enter your paragraph to query:
          </p>

          <Textarea
            className="w-full h-48"
            onChange={(e) => setDataValue(e.target.value)}
            value={dataValue}
          />
          <Button
            type="button"
            onClick={handleEmbed}
            className="border border-black px-4 py-2 self-end rounded-lg bg-emerald-500 border-none text-white hover:bg-emerald-600"
          >
            Embed
          </Button>

          <p className="self-start mt-2 font-semibold">
            Please enter your query:
          </p>
          <Input
            className="w-full h-8"
            onChange={(e) => setQueryValue(e.target.value)}
          />
          <Button
            type="button"
            onClick={handleQuery}
            className="border border-black px-4 py-2 self-end rounded-lg bg-emerald-500 border-none text-white hover:bg-emerald-600"
          >
            Query
          </Button>

          <p className="self-start mt-2 font-semibold">Resulting vectors:</p>
          {queryResponse ? (
            <Table>
              <TableCaption>
                A list of the most similar embeddings to your query.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead className="w-[100px]">Score</TableHead>
                  <TableHead>Sentence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queryResponse.map((response) => {
                  return (
                    <TableRow key={response.id}>
                      <TableCell className="font-medium">
                        {response.id}
                      </TableCell>
                      <TableCell>{response.score}</TableCell>
                      <TableCell>{response.metadata?.sentence}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p>No result</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

function splitIntoSentences(text: string) {
  const sentenceEndingsRegex = /(?<=[.!?])\s+/;

  const splitSentences = text.split(sentenceEndingsRegex);

  const cleanSentences = splitSentences.map((sentence) =>
    sentence.replace(/\n/g, " ").trim()
  );
  return cleanSentences;
}

const defaultData = [
  "Solar panels convert sunlight into electricity, offering a renewable energy source for homes and businesses.",
  "The Louvre Museum in Paris houses the famous Mona Lisa painting by Leonardo da Vinci.",
  "Artificial Intelligence (AI) is transforming industries by automating tasks and analyzing large datasets.",
  "The Great Pyramid of Giza in Egypt is one of the Seven Wonders of the Ancient World.",
  "Climate change is leading to rising sea levels and more frequent extreme weather events.",
  "Blockchain technology underpins cryptocurrencies like Bitcoin and enables secure digital transactions.",
  "The human genome project mapped the entire sequence of human DNA, revolutionizing genetics.",
  "Quantum computing promises to solve complex problems much faster than traditional computers.",
  "Mars rovers, like NASA's Perseverance, explore the Martian surface for signs of past life.",
  "The theory of evolution, proposed by Charles Darwin, explains the diversity of life on Earth.",
  "The International Space Station (ISS) is a collaborative effort for space exploration and research.",
  "Machine learning algorithms can predict consumer behavior and personalize online experiences.",
  "The Grand Canyon in Arizona is a natural wonder, formed by millions of years of erosion.",
  "The invention of the printing press by Johannes Gutenberg revolutionized information dissemination.",
  "Virtual reality (VR) technology creates immersive digital environments for gaming and education.",
  "The Amazon Rainforest is vital for global biodiversity and plays a key role in carbon absorption.",
  "Wireless communication technologies, like 5G, are enhancing connectivity and data transmission speeds.",
  "Self-driving cars use sensors and AI to navigate roads and improve transportation safety.",
  "Plastic pollution in oceans threatens marine life and ecosystems around the world.",
  "Meditation and mindfulness practices have been shown to reduce stress and improve mental health.",
].join("\n");
